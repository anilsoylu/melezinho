"use client"
import { useCallback, useMemo } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"

import { Dna, Home, User } from "lucide-react"
import { tokensMenu, usersMenu } from "@/types/dashboard-menu-list"

export const dashboardPrefix = "/admpanel"

type Route = {
  name: string
  path?: string
  childrenName?: string
  icon?: JSX.Element
  isAdmin?: boolean
  children?: Route[]
}

const useDashboardMenu = () => {
  const user = useCurrentUser()
  const isSuperAdmin = user?.isAdmin

  const filterRoutes = useCallback(
    (routes: Route[]): Route[] =>
      routes
        .filter((route) => !route.isAdmin || (route.isAdmin && isSuperAdmin))
        .map((route) => ({
          ...route,
          children: route.children ? filterRoutes(route.children) : undefined,
        })),
    [isSuperAdmin]
  )

  const allRoutes: Route[] = useMemo(
    () => [
      {
        name: "Anasayfa",
        path: dashboardPrefix,
        childrenName: dashboardPrefix,
        icon: <Home />,
      },
      {
        name: "Token Listesi",
        path: `${dashboardPrefix}/${tokensMenu}`,
        childrenName: dashboardPrefix,
        isAdmin: true,
        icon: <Dna />,
      },
      {
        name: "Üye Listesi",
        path: `${dashboardPrefix}/${usersMenu}`,
        childrenName: dashboardPrefix,
        isAdmin: true,
        icon: <User />,
      },
    ],
    []
  )

  const filteredRoutes: Route[] = useMemo(
    () => filterRoutes(allRoutes),
    [allRoutes, filterRoutes]
  )

  return filteredRoutes
}

export default useDashboardMenu
