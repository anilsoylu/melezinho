import { auth } from "@/auth"
import Loading from "@/components/Loading"
import { NavigationEvents } from "@/components/navigation-events"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { panelText } from "@/lib/utils"
import { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: {
    template: `%s | ${panelText}`,
    default: panelText,
  },
  robots: "noindex,nofollow",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
        <Suspense fallback={<Loading />}>
          <NavigationEvents />
        </Suspense>
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
}
