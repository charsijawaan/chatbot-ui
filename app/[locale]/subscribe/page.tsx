import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { SubscribeForms } from "@/components/subscribe/subscribe-forms"
import { createServerClient } from "@supabase/ssr"
import { cookies, headers } from "next/headers"
import { Database } from "@/supabase/types"

const DAY_IN_MS = 86_400_000

export default async function SubscribePage() {
  let isPro = false

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

  const session = (await supabase.auth.getSession()).data.session

  const { data, error: supabaseError } = await supabase
    .from("user_subscription")
    .select(
      "stripe_subscription_id, stripe_current_period_end, stripe_customer_id, stripe_price_id"
    )
    .eq("user_id", session?.user?.id ?? "")
    .single()

  if (supabaseError || !data) {
    isPro = false
  }

  const isValid =
    data?.stripe_price_id &&
    new Date(data.stripe_current_period_end).getTime() + DAY_IN_MS > Date.now()

  isPro = !!isValid

  return (
    <>
      <Link href="/login">
        <Button className="absolute left-2 top-2">Home</Button>
      </Link>

      <Card className=" absolute mt-20 flex h-[80%] w-[70%] flex-col items-center justify-center">
        <CardHeader className="flex items-center justify-center text-center">
          <CardTitle>
            Your Current Plan is{" "}
            {isPro ? (
              <Badge className=" text-xl">Pro</Badge>
            ) : (
              <>
                <Badge className=" text-xl">Free</Badge>
                <br />
                <span className="mt-4">Select your plan.</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SubscribeForms isPro={isPro} />
        </CardContent>
      </Card>
    </>
  )
}
