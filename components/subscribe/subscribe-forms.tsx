"use client"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { toast } from "sonner"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function SubscribeForms({ isPro }: { isPro: boolean }) {
  const onSubscribe = async (tier: "basic" | "pro" | "") => {
    try {
      const response = await axios.get("/api/stripe?tier=" + tier)
      window.location.href = response.data.url
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  // const onCancelSubscription = async () => {
  //   try {
  //     const response = await axios.get("/api/stripe/cancel")
  //     toast.success("Subscription cancelled")
  //     window.location.reload()
  //   } catch (error) {
  //     toast.error("Something went wrong")
  //   }
  // }

  return (
    <>
      {isPro ? (
        <div>
          <Card className=" m-6 w-[500px] p-6">
            <CardHeader>
              <CardTitle>
                <div className="flex h-[60px] justify-between">
                  <div className="text-4xl font-extrabold tracking-wide">
                    Pro
                  </div>
                  <div>
                    <span className="text-4xl font-extrabold">$10</span>/ mo
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-2 grow space-y-1.5 font-light">
                <div className="space-y-1 font-semibold">
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Use 100+ AI models with your API keys</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Prompt Library</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Reusable Chat Settings</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>AI Assistants &amp; Tools</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Files &amp; Retrieval</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Workspaces</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Faster Messages</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="">
              <Button
                className="mt-12 h-11 w-full bg-blue-500 text-xl font-bold"
                // onClick={onCancelSubscription}
                onClick={() => {
                  onSubscribe("")
                }}
              >
                Cancel Subscription
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6 ">
            <CardHeader>
              <CardTitle>
                <div className="flex h-[60px] justify-between">
                  <div className="text-4xl font-extrabold tracking-wide">
                    Free
                  </div>
                  <div>
                    <span className="text-4xl font-extrabold">$0</span>/ mo
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-2 grow space-y-1.5 font-light">
                <div className="space-y-1 font-semibold">
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Use 100+ AI models with your API keys</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Standard chat features</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({}),
                  "mt-48 h-11 w-full text-xl font-bold"
                )}
              >
                Remain on Free
              </Link>
            </CardFooter>
          </Card>
          <Card className="p-6 ">
            <CardHeader>
              <CardTitle>
                <div className="flex h-[60px] justify-between">
                  <div className="text-4xl font-extrabold tracking-wide">
                    Basic
                  </div>
                  <div>
                    <span className="text-4xl font-extrabold">$10</span>/ mo
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-2 grow space-y-1.5 font-light">
                <div className="space-y-1 font-semibold">
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Use 100+ AI models with your API keys</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Prompt Library</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Reusable Chat Settings</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>AI Assistants &amp; Tools</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Files &amp; Retrieval</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Workspaces</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Faster Messages</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="">
              <Button
                className="mt-12 h-11 w-full bg-blue-500 text-xl font-bold"
                onClick={() => {
                  onSubscribe("basic")
                }}
              >
                Upgrade to Basic
              </Button>
            </CardFooter>
          </Card>
          <Card className="p-6 ">
            <CardHeader>
              <CardTitle>
                <div className="flex h-[60px] justify-between">
                  <div className="text-4xl font-extrabold tracking-wide">
                    Pro
                  </div>
                  <div>
                    <span className="text-4xl font-extrabold">$20</span>/ mo
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-2 grow space-y-1.5 font-light">
                <div className="space-y-1 font-semibold">
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Use 100+ AI models with your API keys</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Prompt Library</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Reusable Chat Settings</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>AI Assistants &amp; Tools</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Files &amp; Retrieval</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Workspaces</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckIcon />
                    <div>Faster Messages</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="">
              <Button
                className="mt-12 h-11 w-full bg-blue-500 text-xl font-bold"
                onClick={() => {
                  onSubscribe("pro")
                }}
              >
                Upgrade to Pro
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}

const CheckIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="tabler-icon tabler-icon-circle-check-filled"
      >
        <path
          d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
          fill="currentColor"
          strokeWidth="0"
        ></path>
      </svg>
    </>
  )
}
