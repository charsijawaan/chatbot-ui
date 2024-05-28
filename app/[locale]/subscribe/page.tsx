import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { checkSubscription } from "@/lib/subscription"
import Link from "next/link"
import { SubscribeForms } from "@/components/subscribe/subscribe-forms"

export default async function SubscribePage() {
  const isPro = await checkSubscription()

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
