const DAY_IN_MS = 86_400_000

import { supabase } from "@/lib/supabase/browser-client"

export const checkSubscription = async () => {
  const user = (await supabase.auth.getUser()).data.user

  if (!user) {
    return false
  }

  const { data, error: supabaseError } = await supabase
    .from("user_subscription")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (supabaseError || !data) {
    return false
  }

  const isValid =
    data.stripe_price_id &&
    new Date(data.stripe_current_period_end).getTime() + DAY_IN_MS > Date.now()

  if (!!isValid) {
    return data?.tier
  }
  return false
}
