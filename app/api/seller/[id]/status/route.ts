import { db } from "@/lib/db"
import { verifyAuthorization } from "@/lib/verify-api"
import { NextRequest, NextResponse } from "next/server"

const handleError = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status })

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  const sellerId = params.id

  if (!sellerId) {
    return handleError("Seller ID not provided", 400)
  }

  try {
    const { isActivated } = await req.json()

    if (typeof isActivated !== "boolean") {
      return handleError("Invalid or missing 'isActivated' field", 400)
    }

    const updatedSeller = await db.seller.update({
      where: { id: sellerId },
      data: { isActivated },
    })

    return NextResponse.json(updatedSeller, { status: 200 })
  } catch (error) {
    console.error("Seller update error:", error)
    return handleError("Server error", 500)
  }
}
