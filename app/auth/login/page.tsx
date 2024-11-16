import { Suspense } from "react"
import LoginForm from "@/app/auth/login/_components/login-form"
import Loading from "@/components/Loading"

export async function generateMetadata() {
  return {
    title: "Giriş Yap",
    description: "Giriş yaparak uygulamaya erişebilirsiniz.",
  }
}

const AuthLoginPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  )
}

export default AuthLoginPage
