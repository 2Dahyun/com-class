import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { action, email, password } = await req.json()

  try {
    if (action === 'register') {
      const exists = await prisma.user.findUnique({ where: { email } })
      if (exists) return NextResponse.json({ error: '이미 존재하는 이메일입니다.' }, { status: 400 })

      const user = await prisma.user.create({ data: { email, password } })
      return NextResponse.json({ message: '회원가입 성공!', user })
    }

    if (action === 'login') {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user || user.password !== password) {
        return NextResponse.json({ error: '이메일 또는 비밀번호가 틀렸습니다.' }, { status: 400 })
      }
      return NextResponse.json({ message: '로그인 성공!', user })
    }

    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '인증 처리 오류' }, { status: 500 })
  }
}