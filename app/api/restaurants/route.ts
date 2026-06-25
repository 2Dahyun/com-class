import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // 💡 핵심 기능: Docker에 켜놓은 데이터베이스에서 모든 식당 정보를 긁어옵니다.
    const restaurants = await prisma.restaurant.findMany()
    return NextResponse.json(restaurants)
  } catch (error) {
    console.error('식당 목록 로드 실패:', error)
    return NextResponse.json({ error: '데이터를 가져오지 못했습니다.' }, { status: 500 })
  }
}