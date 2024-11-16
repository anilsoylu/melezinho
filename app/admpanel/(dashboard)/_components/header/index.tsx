"use client"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { memo } from "react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { userNoImages } from "@/types/dashboard"
import { dashboardPrefix } from "../../routes"
import { profileMenu } from "@/types/dashboard-menu-list"
import { LogoutButton } from "../logout-button"

const themes = ["light", "dark", "system"]

const Header = () => {
  const router = useRouter()
  const user = useCurrentUser()
  const { setTheme } = useTheme()
  const userImage = user?.image || userNoImages
  const headText = user?.username || "Kullanıcı"

  return (
    <header className="bg-sidebar p-2 border-b flex items-center justify-between">
      <div className="flex flex-row items-center justify-center gap-2.5">
        <SidebarTrigger />
        <span className="text-xs md:text-lg max-md:hidden">
          {`Hoş Geldin, ${headText}`}
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer border-black border dark:border-none">
            <AvatarImage
              src={userImage}
              alt={headText}
              className="h-10 w-auto"
            />
            <AvatarFallback>{headText.charAt(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{`Hesabım`}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push(`${dashboardPrefix}/${profileMenu}`)}
          >
            {`Profil`}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`${dashboardPrefix}/withdrawals`)}
            className="bg-green-500"
          >
            {`Çekim Talebi`}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Tema</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {themes.map((theme) => (
                    <DropdownMenuItem
                      key={theme}
                      onClick={() => setTheme(theme)}
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <LogoutButton>{`Çıkış Yap`}</LogoutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default memo(Header)
