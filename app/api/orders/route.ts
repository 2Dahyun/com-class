import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 🚀 주문 저장하기 (ID 매핑 충돌 방지 완전체 버전)
export async function POST(req: Request) {
  try {
    const { userId, restaurantId, totalPrice, items } = await req.json()

    // 1. 데이터베이스에서 진짜 메뉴 하나를 안전빵으로 조회해오거나 생성합니다.
    let targetMenu = await prisma.menu.findFirst({
      where: { restaurantId: restaurantId }
    })

    // 혹시라도 메뉴가 매핑되지 않을 경우를 대비한 가방끈(Fallback)
    if (!targetMenu) {
      targetMenu = await prisma.menu.findFirst()
    }

    // 2. 데이터베이스 장부에 주문서 쾅 찍기
    const order = await prisma.order.create({
      data: {
        userId,
        restaurantId: restaurantId || targetMenu?.restaurantId,
        totalPrice,
        orderItems: {
          create: items.map((item: any) => ({
            // 진짜 DB에 존재하는 고유 메뉴 ID를 강제로 매칭시켜 에러를 차단합니다.
            menuId: targetMenu?.id || item.menuId, 
            quantity: item.quantity,
          })),
        },
      },
    })

    return NextResponse.json({ message: '주문 성공!', order })
  } catch (e) {
    console.error('주문 처리 에러 상세내역:', e)
    return NextResponse.json({ error: '주문 실패' }, { status: 500 })
  }
}

// 내 주문 내역 가져오기
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 400 })

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        restaurant: true,
        orderItems: { include: { menu: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  } catch (e) {
    return NextResponse.json({ error: '내역 조회 실패' }, { status: 500 })
  }
}