import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb-client';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const bearerToken = process.env.DODO_PAYMENTS_API_KEY;
    const env = process.env.DODO_PAYMENTS_ENV || 'test';
    const baseUrl = env === 'live' ? 'https://live.dodopayments.com' : 'https://test.dodopayments.com';
    if (!bearerToken) {
      return NextResponse.json(
        { ok: false, error: 'Server not configured' },
        { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache' } }
      );
    }

    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id') || url.searchParams.get('sessionId') || '';
    const paymentId = url.searchParams.get('payment_id') || url.searchParams.get('paymentId') || '';
    const checkId = sessionId || paymentId;

    if (!checkId) {
      // Nothing to verify
      return NextResponse.json(
        { ok: false },
        { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache' } }
      );
    }

    // Validate ID to prevent path injection/SSRF
    const idSchema = z.string().regex(/^[a-zA-Z0-9_-]{1,128}$/);
    const parsed = idSchema.safeParse(checkId);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid ID' },
        { status: 400, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache' } }
      );
    }

    // Try checkout sessions endpoint first (new API)
    let resp = await fetch(`${baseUrl}/checkouts/${checkId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    let data = await resp.json().catch(() => ({} as any));
    
    // If checkout not found and we have a paymentId, try the old payments endpoint
    if (!resp.ok && paymentId) {
      resp = await fetch(`${baseUrl}/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      data = await resp.json().catch(() => ({} as any));
    }

    if (!resp.ok) {
      return NextResponse.json(
        { ok: false, error: data?.message || 'Failed to verify' },
        { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache' } }
      );
    }

    // Check if payment succeeded
    const paymentStatus = data?.status || data?.payment_status;
    
    if (paymentStatus === 'succeeded' || paymentStatus === 'paid') {
      try {
        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');
        // Check all possible email locations in Dodo response
        const userEmail = 
          data?.metadata?.userEmail || 
          data?.customer?.email || 
          data?.customer_email ||  // Dodo uses snake_case
          data?.email || 
          null;
        
        if (userEmail) {
          const emailSchema = z.string().email();
          const parsedEmail = emailSchema.safeParse(String(userEmail));
          
          if (parsedEmail.success) {
            await usersCollection.updateOne(
              { email: parsedEmail.data },
              { $set: { payment: true, updatedAt: new Date() } }
            );
          }
        }
      } catch (e) {
        // Silently handle database errors
      }
    }

    return NextResponse.json(
      { ok: true, status: paymentStatus || 'unknown' },
      { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache' } }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false },
      { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache' } }
    );
  }
}
