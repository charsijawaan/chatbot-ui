import { Database } from "@/supabase/types"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { getServerProfile } from "@/lib/server/server-chat-helpers"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET() {
  try {
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
      const { data: userSubscription } = await supabaseAdmin
        .from("user_subscription")
        .select("*")
        .eq("user_id", userId)
        .single()

      await stripe.subscriptions.cancel(
        userSubscription?.stripe_subscription_id
      )

      let date = new Date()
      date.setDate(date.getDate() - 1)

      await supabaseAdmin
        .from("user_subscription")
        .update({
          stripe_current_period_end: date.toISOString()
        })
        .eq("user_id", userId)

      return new NextResponse(JSON.stringify({}))
    }

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
  } catch (error) {
    console.log("[STRIPE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
