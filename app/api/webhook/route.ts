import Stripe from "stripe"
import { Database } from "@/supabase/types"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

import { stripe } from "@/lib/stripe"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

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

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 })
    }

    const { error } = await supabase.from("user_subscription").insert({
      user_id: session.metadata.userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      stripe_price_id: subscription.items.data[0].price.id,
      stripe_current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString()
    })

    if (error) {
      console.error("[WEBHOOK_ERROR]", error)
      return new NextResponse("Internal Error", { status: 500 })
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    const { error } = await supabase
      .from("user_subscription")
      .update({
        stripe_price_id: subscription.items.data[0].price.id,
        stripe_current_period_end: new Date(
          subscription.current_period_end * 1000
        ).toISOString()
      })
      .eq("stripe_subscription_id", subscription.id)

    if (error) {
      console.error("[WEBHOOK_ERROR]", error)
      return new NextResponse("Internal Error", { status: 500 })
    }
  }

  return new NextResponse(null, { status: 200 })
}
