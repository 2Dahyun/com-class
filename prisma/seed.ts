import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 기존 데이터가 있다면 싹 청소하기
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.menu.deleteMany()
  await prisma.restaurant.deleteMany()

  // 1. 맛있는 식당들 만들기 (치킨 3 / 한식 2 / 피자 1 / 베이커리 1 / 양식 1 / 분식 1 / 일식 1)
  const r1 = await prisma.restaurant.create({
    data: { name: '교촌치킨 송도감천점', category: '치킨' },
  })
  const r2 = await prisma.restaurant.create({
    data: { name: 'BBQ치킨 부산송도점', category: '치킨' },
  })
  const r3 = await prisma.restaurant.create({
    data: { name: '치킨신드롬 송도베이시티점', category: '치킨' },
  })
  const r4 = await prisma.restaurant.create({
    data: { name: '남도갈비 송도이진베이시티점', category: '한식' },
  })
  const r5 = await prisma.restaurant.create({
    data: { name: '마선생얼큰국밥 부산송도점', category: '한식' },
  })
  const r6 = await prisma.restaurant.create({
    data: { name: '7번가피자 송도점(부산)', category: '피자' },
  })
  const r7 = await prisma.restaurant.create({
    data: { name: '아덴블랑제리 부산송도점', category: '베이커리' },
  })
  const r8 = await prisma.restaurant.create({
    data: { name: '플루어', category: '베이커리' },
  })
  const r9 = await prisma.restaurant.create({
    data: { name: '동대문 엽기떡볶이', category: '분식' },
  })
  const r10 = await prisma.restaurant.create({
    data: { name: '백초밥 부산송도점', category: '일식' },
  })

  // 2. 각 식당에 메뉴판 채워 넣기
  await prisma.menu.createMany({
    data: [
      { name: '허니콤보', price: 23000, restaurantId: r1.id },
      { name: '레드콤보', price: 23000, restaurantId: r1.id },
    ],
  })

  await prisma.menu.createMany({
    data: [
      { name: '황금올리브', price: 23000, restaurantId: r2.id },
      { name: '맵소디', price: 24500, restaurantId: r2.id },
    ],
  })

  await prisma.menu.createMany({
    data: [
      { name: '핫 스페셜', price: 24000, restaurantId: r3.id },
      { name: '핫윙', price: 24000, restaurantId: r3.id },
    ],
  })

  await prisma.menu.createMany({
    data: [
      { name: '점심특선', price: 14000, restaurantId: r4.id },
      { name: '남도도시락', price: 10000, restaurantId: r4.id },
    ],
  })

  await prisma.menu.createMany({
    data: [
      { name: '얼큰이 국밥', price: 11000, restaurantId: r5.id },
      { name: '삼겹수육보쌈 백반', price: 13000, restaurantId: r5.id },
    ],
  })

  await prisma.menu.createMany({
    data: [
      { name: '페페로니 씬바삭(L)', price: 26900, restaurantId: r6.id },
      { name: '화이트쉬림프(R)', price: 22900, restaurantId: r6.id },
    ],
  })

  await prisma.menu.createMany({
    data: [
      { name: '잠봉뵈르 소금빵', price: 4900, restaurantId: r7.id },
      { name: '두바이 초코 소금빵', price: 7800, restaurantId: r7.id },
    ],
  })

  await prisma.menu.createMany({
    data: [
      { name: '해시브라운 샌드위치', price: 6000, restaurantId: r8.id },
      { name: '베이컨 갈레트', price: 14000, restaurantId: r8.id },
    ],
  })

  await prisma.menu.createMany({
    data: [
      { name: '엽기떡볶이(착한맛)', price: 6000, restaurantId: r9.id },
      { name: '마라로제엽기떡볶이', price: 16000, restaurantId: r9.id },
    ],
  })

  await prisma.menu.createMany({
    data: [
      { name: '시그니처', price: 15800, restaurantId: r10.id },
      { name: '베이직', price: 12800, restaurantId: r10.id },
    ],
  })

  console.log('✅ 가짜 식당이랑 메뉴 데이터가 창고에 가득 찼습니다!')
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })