import { signOut } from "next-auth/react"

interface LogoutButtonProps {
  children: React.ReactNode
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = async () => {
    await signOut()
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  )
}
