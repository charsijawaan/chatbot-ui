import { Database } from "@/supabase/types"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"
import { getServerProfile } from "@/lib/server/server-chat-helpers"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const returnUrl = absoluteUrl("/subscribe")

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.searchParams)
    const tier = searchParams.get("tier")
    const cookieStore = cookies()

    const supabaseAdmin = createServerClient<Database>(
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

    const user = (await supabaseAdmin.auth.getUser()).data.user
    const profile = await getServerProfile()

    if (profile) {
      const userId = profile.user_id
      const { data: userSubscription, error } = await supabaseAdmin
        .from("user_subscription")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (error) {
        console.log(error)
      }
      if (userSubscription && userSubscription.stripe_customer_id) {
        const stripeSession = await stripe.billingPortal.sessions.create({
          customer: userSubscription.stripe_customer_id,
          return_url: returnUrl
        })

        return new NextResponse(JSON.stringify({ url: stripeSession.url }))
      }

      const stripeSession = await stripe.checkout.sessions.create({
        success_url: returnUrl,
        cancel_url: returnUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user?.email,
        line_items: [
          {
            price:
              tier === "basic"
                ? "price_1PLS3BDQymimXUADLgGF7K8V"
                : "price_1PLS3QDQymimXUADI5ZAhm74",
            quantity: 1
          }
        ],
        metadata: {
          userId
        }
      })

      return new NextResponse(JSON.stringify({ url: stripeSession.url }))
    }

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
  } catch (error) {
    console.log("[STRIPE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
