import { ContentType } from "@/types"
import {
  IconAdjustmentsHorizontal,
  IconBolt,
  IconBooks,
  IconFile,
  IconMessage,
  IconPencil,
  IconRobotFace,
  IconSparkles
} from "@tabler/icons-react"
import { FC, useEffect } from "react"
import { TabsList } from "../ui/tabs"
import { WithTooltip } from "../ui/with-tooltip"
import { ProfileSettings } from "../utility/profile-settings"
import { SidebarSwitchItem } from "./sidebar-switch-item"
import { LockKeyholeIcon } from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card"
import Link from "next/link"
import { checkSubscription } from "@/db/user-subscription"
import { useState } from "react"

export const SIDEBAR_ICON_SIZE = 28

interface SidebarSwitcherProps {
  onContentTypeChange: (contentType: ContentType) => void
}

export const SidebarSwitcher: FC<SidebarSwitcherProps> = ({
  onContentTypeChange
}) => {
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    ;(async () => {
      const res = await checkSubscription()
      setIsPro(res)
    })()
  }, [])

  return (
    <div className="flex flex-col justify-between border-r-2 pb-5">
      <TabsList className="bg-background grid h-[440px] grid-rows-7">
        <SidebarSwitchItem
          icon={<IconMessage size={SIDEBAR_ICON_SIZE} />}
          contentType="chats"
          onContentTypeChange={onContentTypeChange}
        />

        {isPro ? (
          <SidebarSwitchItem
            icon={<IconAdjustmentsHorizontal size={SIDEBAR_ICON_SIZE} />}
            contentType="presets"
            onContentTypeChange={onContentTypeChange}
          />
        ) : (
          <LockedIcon />
        )}

        {isPro ? (
          <SidebarSwitchItem
            icon={<IconPencil size={SIDEBAR_ICON_SIZE} />}
            contentType="prompts"
            onContentTypeChange={onContentTypeChange}
          />
        ) : (
          <LockedIcon />
        )}

        {isPro ? (
          <SidebarSwitchItem
            icon={<IconSparkles size={SIDEBAR_ICON_SIZE} />}
            contentType="models"
            onContentTypeChange={onContentTypeChange}
          />
        ) : (
          <LockedIcon />
        )}

        {isPro ? (
          <SidebarSwitchItem
            icon={<IconFile size={SIDEBAR_ICON_SIZE} />}
            contentType="files"
            onContentTypeChange={onContentTypeChange}
          />
        ) : (
          <LockedIcon />
        )}

        {isPro ? (
          <SidebarSwitchItem
            icon={<IconBooks size={SIDEBAR_ICON_SIZE} />}
            contentType="collections"
            onContentTypeChange={onContentTypeChange}
          />
        ) : (
          <LockedIcon />
        )}

        {isPro ? (
          <SidebarSwitchItem
            icon={<IconRobotFace size={SIDEBAR_ICON_SIZE} />}
            contentType="assistants"
            onContentTypeChange={onContentTypeChange}
          />
        ) : (
          <LockedIcon />
        )}

        {isPro ? (
          <SidebarSwitchItem
            icon={<IconBolt size={SIDEBAR_ICON_SIZE} />}
            contentType="tools"
            onContentTypeChange={onContentTypeChange}
          />
        ) : (
          <LockedIcon />
        )}
      </TabsList>

      <div className="flex flex-col items-center space-y-4">
        {/* TODO */}
        {/* <WithTooltip display={<div>Import</div>} trigger={<Import />} /> */}

        {/* TODO */}
        {/* <Alerts /> */}

        <WithTooltip
          display={<div>Profile Settings</div>}
          trigger={<ProfileSettings />}
        />
      </div>
    </div>
  )
}

function LockedIcon() {
  return (
    <Link href={"/subscribe"}>
      <HoverCard>
        <HoverCardTrigger>
          <div>
            <LockKeyholeIcon
              href="/subscribe"
              className=" ml-3 cursor-pointer text-white transition hover:text-gray-400"
              size={28}
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent side="right">
          Click to upgrade and unlock Presets
        </HoverCardContent>
      </HoverCard>
    </Link>
  )
}
