import { db } from "@/lib/db"
import { verifyAuthorization } from "@/lib/verify-api"
import { NextRequest, NextResponse } from "next/server"

async function fetchSellerById(sellerId: string) {
  return await db.seller.findUnique({ where: { id: sellerId } })
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  const sellerId = params.id
  if (!sellerId) {
    return NextResponse.json(
      { error: "Seller ID not provided" },
      { status: 400 }
    )
  }

  try {
    const seller = await fetchSellerById(sellerId)
    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 })
    }
    return NextResponse.json(seller, { status: 200 })
  } catch (error) {
    console.error("GET Seller Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  const sellerId = params.id
  if (!sellerId) {
    return NextResponse.json(
      { error: "Seller ID not provided" },
      { status: 400 }
    )
  }

  try {
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
  } catch (error) {
    console.error("PATCH Seller Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  const sellerId = params.id
  if (!sellerId) {
    return NextResponse.json(
      { error: "Seller ID not provided" },
      { status: 400 }
    )
  }

  try {
    const deletedSeller = await db.seller.delete({ where: { id: sellerId } })
    return NextResponse.json(deletedSeller, { status: 200 })
  } catch (error) {
    console.error("DELETE Seller Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
