'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  // 🎰 룰렛 기능을 위한 상태 변수
  const [rouletteResult, setRouletteResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const categories = ['치킨', '한식', '피자', '베이커리', '일식', '분식']; // 추천할 음식 종류

  // 🎰 룰렛 돌리기 함수
  const spinRoulette = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setRouletteResult(null);

    let currentDelay = 40; // ⚡ 처음에는 엄청나게 빠른 속도 (40ms)
    const maxDelay = 600;   // 🐢 마지막엔 서서히 느려짐 (600ms)
    let index = 0;

    const run = () => {
      // 배열 순서대로 다음 메뉴를 계속 보여주며 뺑뺑이 돌리기
      index = (index + 1) % categories.length;
      const currentSelection = categories[index];
      setRouletteResult(currentSelection);

      // 🎯 핵심 알고리즘: 돌릴 때마다 딜레이를 조금씩 늘려서 "촤르르륵 멈추는 효과" 연출
      currentDelay += 35;

      if (currentDelay < maxDelay) {
        // 아직 돌 때면 다음 바퀴 예약
        setTimeout(run, currentDelay);
      } else {
        // 멈췄을 때!
        setIsSpinning(false);

        // 0.1초 뒤 타이밍 맞춰서 축하 효과 알림창 띄우기
        setTimeout(() => {
          alert(`🎰 [😇오늘의 먹내림🌪️]\n\n✨ 🎶추천 음식은 바로 "${currentSelection}" 입니다! ✨\n\n맛집 리스트에서 골라 담아보세요!`);
        }, 100);
      }
    };

    // 룰렛 시동!
    setTimeout(run, currentDelay);
  };

  // 타입 정의
  type Restaurant = {
    id: string
    name: string
    category: string
  }

  type Menu = {
    id: string
    name: string
    price: number
  }

  type OrderItem = {
    id: string
    quantity: number
    menu?: { name: string }
  }

  type Order = {
    id: string
    status: string
    totalPrice: number
    restaurant?: { name: string }
    orderItems?: OrderItem[]
  }

  // 앱 상태 관리
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home') // 'home', 'cart', 'orders'

  // 1️⃣ 회원 관련 상태 (회원가입/로그인/로그아웃)
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [isRegisterMode, setIsRegisterMode] = useState(false)

  // 2️⃣ 식당 및 메뉴 상태
  const [selectedResId, setSelectedResId] = useState<string | null>(null)
  const [selectedResName, setSelectedResName] = useState('')
  const [menus, setMenus] = useState<Menu[]>([])

  // 3️⃣ 장바구니 담기 상태
  const [cart, setCart] = useState<{ menuId: string; name: string; price: number; quantity: number }[]>([])
  const [cartResId, setCartResId] = useState<string | null>(null)

  // 4️⃣ 내 주문 내역 상태
  const [myOrders, setMyOrders] = useState<Order[]>([])
  // 식당 정보 가져오기
  useEffect(() => {
    fetch('/api/restaurants')
      .then((res) => res.json())
      .then((data) => { setRestaurants(data); setLoading(false) })
  }, [])

  // 내 주문 내역 동기화
  const fetchMyOrders = async () => {
    if (!user) return
    const res = await fetch(`/api/orders?userId=${user.id}`)
    const data = await res.json()
    setMyOrders(data)
  }

  useEffect(() => { if (user) fetchMyOrders() }, [user, activeTab])

  // 회원가입 및 로그인 처리 함수
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    const action = isRegisterMode ? 'register' : 'login'
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, email: authEmail, password: authPassword }),
    })
    const data = await res.json()
    if (data.error) return alert(data.error)

    if (isRegisterMode) {
      alert('회원가입 완료! 로그인 해주세요.')
      setIsRegisterMode(false)
    } else {
      setUser({ id: data.user.id, email: data.user.email })
      alert(`${data.user.email}님 환영합니다!`)
    }
    setAuthPassword('')
  }

  // 메뉴 불러오기 매핑
  const handleRestaurantClick = (id: string, name: string) => {
    setSelectedResId(id)
    setSelectedResName(name)
    if (name.includes('교촌치킨 송도감천점')) {
      setMenus([{ id: 'm1', name: ' 허니콤보', price: 23000 }, { id: 'm2', name: ' 레드콤보', price: 23000 }])
    } else if (name.includes('BBQ치킨 부산송도점')) {
      setMenus([{ id: 'm3', name: '황금올리브 ', price: 23000 }, { id: 'm4', name: '맵소디', price: 24500 }])
    } else if (name.includes('치킨신드롬 송도베이시티점')) {
      setMenus([{ id: 'm5', name: '핫 스페셜', price: 24000 }, { id: 'm6', name: '핫윙', price: 24000 }])
      //여기까지 치킨
    } else if (name.includes('남도갈비 송도이진베이시티점')) {
      setMenus([{ id: 'm7', name: '점심특선', price: 14000 }, { id: 'm8', name: '남도도시락', price: 10000 }])
    } else if (name.includes('마선생얼큰국밥 부산송도점')) {
      setMenus([{ id: 'm9', name: '얼큰이 국밥', price: 11000 }, { id: 'm10', name: '삼겹수육보쌈 백반', price: 13000 }])
      //여기까지 한식
    } else if (name.includes('7번가피자 송도점(부산)')) {
      setMenus([{ id: 'm11', name: '페페로니 씬바샤삭 L(L)', price: 26900 }, { id: 'm12', name: '화이트쉬림프(R)', price: 22900 }])
      //여까지 피자
    } else if (name.includes('아덴블랑제리 부산송도점')) {
      setMenus([{ id: 'm13', name: '잠봉뵈르 소금빵', price: 4900 }, { id: 'm14', name: '두바이 초코 소금빵', price: 7800 }])
    } else if (name.includes('플루어')) {
      setMenus([{ id: 'm15', name: '해시브라운 샌드위치', price: 6000 }, { id: 'm16', name: '베이컨 갈레트', price: 14000 }])
      // 빵
    } else if (name.includes('동대문 엽기떡볶이')) {
      setMenus([{ id: 'm17', name: '엽기떡볶이(착한맛)', price: 6000 }, { id: 'm18', name: '마라로제엽기떡볶이', price: 16000 }])
    } else { //초밥
      setMenus([{ id: 'm15', name: '시그니처', price: 15800 }, { id: 'm16', name: '베이직', price: 12800 }])
    }
  }

  // 장바구니 담기
  const addToCart = (menu: any) => {
    if (cartResId && cartResId !== selectedResId) {
      if (!confirm('다른 식당의 메뉴를 담으려면 기존 장바구니가 초기화됩니다. 담으시겠습니까?')) return
      setCart([])
    }
    setCartResId(selectedResId)
    setCart((prev) => {
      const exists = prev.find((item) => item.menuId === menu.id)
      if (exists) return prev.map((item) => item.menuId === menu.id ? { ...item, quantity: item.quantity + 1 } : item)
      return [...prev, { menuId: menu.id, name: menu.name, price: menu.price, quantity: 1 }]
    })
    alert(`🛒${menu.name}🛒 장바구니 담기 완료!`)
  }
  // 룰렛 결과로 필터링된 식당 목록
  const filteredRestaurants = rouletteResult
    ? restaurants.filter((r: Restaurant) => r.category === rouletteResult)
    : restaurants

  // 주문하기 버튼 클릭 (DB 저장)
  const handleOrder = async () => {
    if (!user) return alert('주문하려면 먼저 로그인해 주세요!')
    if (cart.length === 0) return alert('장바구니가 비어 있습니다.')

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, restaurantId: cartResId, totalPrice, items: cart }),
    })
    const data = await res.json()
    if (data.error) return alert('주문 실패')

    alert('🚀 주문이 저장되었습니다!')
    setCart([])
    setCartResId(null)
    setActiveTab('orders')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* 상단 헤더 */}
      <header className="max-w-md mx-auto bg-white p-5 shadow-sm sticky top-0 z-50 flex justify-between items-center border-b border-gray-100">
        <h1 className="text-xl font-black text-orange-500 tracking-tight" onClick={() => setActiveTab('home')}>🛵배달의 민족🛵</h1>
        {user ? (
          <div className="text-right">
            <p className="text-xs font-bold text-gray-700 truncate max-w-[120px]">{user.email}</p>
            <button onClick={() => { setUser(null); setCart([]); alert('로그아웃 되었습니다.'); }} className="text-[10px] text-red-500 font-bold underline">로그아웃</button>
          </div>
        ) : (
          <span className="text-xs font-bold text-gray-400">로그인 필요</span>
        )}
      </header>

      <main className="max-w-md mx-auto p-4">
        {/* 비로그인 상태일 때의 로그인/회원가입 폼 */}
        {!user && (
          <div className="bg-white p-5 rounded-2xl shadow-md border border-orange-100 mb-6">
            <h3 className="text-sm font-black text-gray-800 mb-3">{isRegisterMode ? '📝 간단 회원가입' : '🔒 필수 로그인'}</h3>
            <form onSubmit={handleAuth} className="space-y-2">
              <input type="email" placeholder="이메일 입력" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full p-2.5 text-sm bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-orange-500" />
              <input type="password" placeholder="비밀번호 입력" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full p-2.5 text-sm bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-orange-500" />
              <button type="submit" className="w-full bg-orange-500 text-white font-bold text-sm py-2.5 rounded-xl shadow-sm hover:bg-orange-600 transition-colors">{isRegisterMode ? '가입하기' : '로그인'}</button>
            </form>
            <button onClick={() => setIsRegisterMode(!isRegisterMode)} className="w-full text-center text-xs text-gray-400 mt-3 underline font-medium">{isRegisterMode ? '이미 계정이 있나요? 로그인하기' : '처음이신가요? 회원가입하기'}</button>
          </div>
        )}

        {/* 🎰 : 오늘 뭐 먹지? 룰렛 추천 기능 */}
        <div className="bg-white p-5 rounded-2xl shadow-md border border-dashed border-orange-300 mb-6 text-center">
          <h3 className="text-sm font-black text-gray-800 mb-2">🤔 오늘 뭐먹지?</h3>
          <p className="text-xs text-gray-400 mb-4">메뉴를 추천해드립니다👌</p>

          <div className="flex flex-col items-center justify-center gap-3">
            {rouletteResult && (
              <div className={`text-lg font-black px-6 py-2 rounded-xl border-2 transition-all ${isSpinning ? 'bg-gray-100 border-gray-300 animate-pulse text-gray-400' : 'bg-orange-50 border-orange-400 text-orange-600'}`}>
                {isSpinning ? '🔄 돌아가는 중...' : `✨ 오늘의 픽: ${rouletteResult} ✨`}
              </div>
            )}

            <button
              onClick={spinRoulette}
              disabled={isSpinning}
              className={`w-full font-black text-sm py-3 rounded-xl shadow-sm transition-all transform active:scale-95 ${isSpinning ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-orange-400 to-amber-500 text-white hover:from-orange-500 hover:to-amber-600'}`}
            > {isSpinning ? '🎰 룰렛 도는 중...' : '🎰 오늘 뭐 먹지? 룰렛 돌리기'}    
            </button>
          </div>
        </div>

        {/* 탭 내용 분기 */}
        {activeTab === 'home' && (
          <div>
            <h2 className="text-base font-black text-gray-800 mb-3">
              {rouletteResult ? `🎯 "${rouletteResult}" 맛집 리스트` : '🏠 전체 리스트'}
            </h2>

            {rouletteResult && (
              <button
                onClick={() => setRouletteResult(null)}
                className="text-xs text-gray-400 underline mb-3"
              >
                전체 맛집 다시 보기
              </button>
            )}

            {loading ? (
              <p className="text-center text-sm text-gray-400 py-10">로딩 중...</p>
            ) : filteredRestaurants.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-10">
                "{rouletteResult}" 카테고리의 맛집이 없어요 😢
              </p>
            ) : (
              <div className="space-y-2">
                {filteredRestaurants.map((r: Restaurant) => (
                  <div key={r.id}>
                    <div
                      onClick={() => handleRestaurantClick(r.id, r.name)}
                      className={`bg-white p-4 rounded-xl border transition-all cursor-pointer ${selectedResId === r.id ? 'border-orange-500 ring-2 ring-orange-50' : 'border-gray-100'
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] bg-orange-50 text-orange-600 font-bold px-1.5 py-0.5 rounded mb-1 inline-block">
                            {r.category}
                          </span>
                          <h4 className="text-sm font-bold text-gray-900">{r.name}</h4>
                        </div>
                        <span className="text-xs text-gray-400">{selectedResId === r.id ? '👇' : '➡️'}</span>
                      </div>
                    </div>

                    {selectedResId === r.id && (
                      <div className="mt-2 bg-white p-4 rounded-xl shadow-sm border border-orange-100">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                          📋 {selectedResName} 메뉴
                        </h3>
                        <div className="space-y-2">
                          {menus.map((m: Menu) => (
                            <div key={m.id} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg text-sm">
                              <span className="font-bold text-gray-800">{m.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-orange-600">{m.price.toLocaleString()}원</span>
                                <button
                                  onClick={() => addToCart(m)}
                                  className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-md"
                                >
                                  담기
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'cart' && (
          <div>
            <h2 className="text-base font-black text-gray-800 mb-3">🛒 장바구니 내역</h2>
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              {cart.length === 0 ? <p className="text-center text-sm text-gray-400 py-10">장바구니가 비어 있습니다.</p> : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.menuId} className="flex justify-between items-center text-sm pb-2 border-b border-gray-50">
                      <div>
                        <p className="font-bold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.price.toLocaleString()}원 × {item.quantity}개</p>
                      </div>
                      <span className="font-black text-gray-900">{(item.price * item.quantity).toLocaleString()}원</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 font-black text-base text-gray-900">
                    <span>총 결제금액:</span>
                    <span className="text-orange-600">{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}원</span>
                  </div>
                  <button onClick={handleOrder} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl text-sm shadow-md mt-4">💳 주문하기</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-base font-black text-gray-800 mb-3">📜 내 주문 내역</h2>
            {!user ? <p className="text-center text-sm text-gray-400 py-10">로그인하시면 주문 내역을 조회할 수 있습니다.</p> : (
              <div className="space-y-3">
                {myOrders.length === 0 ? <p className="text-center text-sm text-gray-400 py-10">주문 내역이 없습니다.</p> : myOrders.map((order: any) => (
                  <div key={order.id} className="bg-white p-4 rounded-xl border border-gray-100 text-sm">
                    <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-50">
                      <span className="font-black text-gray-800">{order.restaurant?.name || '가게 정보'}</span>
                      <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded">{order.status}</span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-500 mb-2">
                      {order.orderItems?.map((oi: any) => (
                        <p key={oi.id}>• {oi.menu?.name} ({oi.quantity}개)</p>
                      ))}
                    </div>
                    <div className="text-right font-black text-gray-900 text-sm">결제금액: <span className="text-orange-500">{order.totalPrice.toLocaleString()}원</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 하단 네비게이션 바 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 max-w-md mx-auto flex justify-around p-3 shadow-lg z-50">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'home' ? 'text-orange-500 font-bold' : 'text-gray-400'}`}><span className="text-lg">🏠</span><span className="text-[10px]">홈/맛집</span></button>
        <button onClick={() => setActiveTab('cart')} className={`flex flex-col items-center gap-0.5 relative ${activeTab === 'cart' ? 'text-orange-500 font-bold' : 'text-gray-400'}`}><span className="text-lg">🛒</span><span className="text-[10px]">장바구니</span>{cart.length > 0 && <span className="absolute top-0 right-2 bg-orange-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold">{cart.length}</span>}</button>
        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'orders' ? 'text-orange-500 font-bold' : 'text-gray-400'}`}><span className="text-lg">📜</span><span className="text-[10px]">주문내역</span></button>
      </nav>

      {/* CDN 컴파일용 헤더 동적 주입 */}
      <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    </div>
  )
}