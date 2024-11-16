"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import BackButton from "@/app/auth/_components/back-button"

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  description?: string
  backButtonHref?: string
  backButtonLabel?: string
}

export const CardWrapper = ({
  children,
  headerLabel,
  description,
  backButtonHref,
  backButtonLabel,
}: CardWrapperProps) => {
  return (
    <Card className="mx-auto min-w-80 max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{headerLabel}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {backButtonHref && backButtonLabel && (
        <CardFooter>
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
      )}
    </Card>
  )
}
