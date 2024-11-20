import { db } from "@/lib/db"
import { verifyAuthorization } from "@/lib/verify-api"
import { NextRequest, NextResponse } from "next/server"

const handleError = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status })

const withAuthorization = async (
  req: NextRequest,
  sellerId: string,
  handler: (sellerId: string, req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> => {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  if (!sellerId) {
    return handleError("Seller ID not provided", 400)
  }

  try {
    return await handler(sellerId, req)
  } catch (error) {
    console.error("Server Error:", error)
    return handleError("Internal Server Error", 500)
  }
}

async function fetchSellerById(sellerId: string) {
  return db.seller.findUnique({ where: { id: sellerId } })
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuthorization(req, params.id, async (sellerId) => {
    const seller = await fetchSellerById(sellerId)

    if (!seller) {
      return handleError("Seller not found", 404)
    }

    return NextResponse.json(seller, { status: 200 })
  })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuthorization(req, params.id, async (sellerId) => {
    const data = await req.json()

    if (data.isActive) {
      const activeSeller = await db.seller.findFirst({
        where: { isActivated: true },
      })

      if (activeSeller && activeSeller.id !== sellerId) {
        await db.seller.updateMany({ data: { isActivated: false } })
      }
    }

    const updatedSeller = await db.seller.update({
      where: { id: sellerId },
      data,
    })

    return NextResponse.json(updatedSeller, { status: 200 })
  })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuthorization(req, params.id, async (sellerId) => {
    const deletedSeller = await db.seller.delete({ where: { id: sellerId } })
    return NextResponse.json(deletedSeller, { status: 200 })
  })
}
