import Stripe from "stripe"
import { Database } from "@/supabase/types"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

import { stripe } from "@/lib/stripe"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get("Stripe-Signature") as string

    let event: Stripe.Event

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    const session = event.data.object as Stripe.Checkout.Session
    const cookieStore = cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          }
        }
      }
    )

    if (event.type === "customer.subscription.deleted") {
      const { error } = await supabase
        .from("user_subscription")
        .delete()
        .eq("stripe_subscription_id", session.id)

      if (error) {
        console.error("[WEBHOOK_ERROR]", error)
        return new NextResponse("Internal Error", { status: 500 })
      }
    }
    return new NextResponse(null, { status: 200 })
  } catch (error: any) {
    console.log(error)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }
}
