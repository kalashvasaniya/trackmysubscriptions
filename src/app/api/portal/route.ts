import { CustomerPortal } from "@polar-sh/nextjs";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  getCustomerId: async (req: NextRequest) => {
    // Get the current session
    const session = await auth();
    
    // Return the Polar customer ID associated with this user
    // You'll need to store this when processing webhooks
    // For now, we'll use the user's email to look up their customer ID
    // You should replace this with your actual customer ID lookup logic
    const customerId = session?.user?.id || "";
    
    return customerId;
  },
  server: "production",
});
