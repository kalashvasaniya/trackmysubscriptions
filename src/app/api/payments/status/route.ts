import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-client';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { paid: false },
        { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache' } }
      );
    }

    const email = session.user.email;

    // Check user document first
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email });
    if (user?.payment) {
      return NextResponse.json(
        { paid: true },
        { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache' } }
      );
    }

    return NextResponse.json(
      { paid: false },
      { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache' } }
    );
  } catch (err) {
    return NextResponse.json(
      { paid: false },
      { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache' } }
    );
  }
}
