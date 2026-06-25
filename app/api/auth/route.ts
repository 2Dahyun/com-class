import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { action, email, password } = await req.json()

  try {
    if (action === 'register') {
      // 회원가입: 이미 존재하는 이메일인지 체크
      const exists = await prisma.user.findUnique({ where: { email } })
      if (exists) return NextResponse.json({ error: '이미 존재하는 이메일입니다.' }, { status: 400 })
      
      const user = await prisma.user.create({ data: { email, password } })
      return NextResponse.json({ message: '회원가입 성공!', user })
    }

    if (action === 'login') {
      // 로그인: 이메일과 비밀번호 일치 확인
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user || user.password !== password) {
        return NextResponse.json({ error: '이메일 또는 비밀번호가 틀렸습니다.' }, { status: 400 })
      }
      return NextResponse.json({ message: '로그인 성공!', user })
    }
  } catch (e) {
    return NextResponse.json({ error: '인증 처리 오류' }, { status: 500 })
  }
}