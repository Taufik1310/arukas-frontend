import { FiShoppingCart, FiZap, FiBarChart2, FiShield, FiEdit, FiStar, FiLock } from "react-icons/fi";

interface Props { variant: "login" | "register"; }

function LoginContent() {
  return (
    <>
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Ilustrasi */}
        <div className="w-56 h-56 mb-8 relative">
          <svg viewBox="0 0 240 240" fill="none" className="w-full h-full">
            <rect x="40" y="30" width="160" height="110" rx="10" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.25" strokeWidth="1.5"/>
            <rect x="52" y="42" width="136" height="88" rx="6" fill="white" fillOpacity="0.08"/>
            <rect x="64" y="54" width="56" height="8" rx="4" fill="white" fillOpacity="0.4"/>
            <rect x="64" y="68" width="40" height="6" rx="3" fill="white" fillOpacity="0.25"/>
            <rect x="64" y="80" width="50" height="6" rx="3" fill="white" fillOpacity="0.25"/>
            <rect x="64" y="92" width="35" height="6" rx="3" fill="white" fillOpacity="0.2"/>
            <rect x="134" y="54" width="44" height="68" rx="4" fill="white" fillOpacity="0.1"/>
            <rect x="141" y="62" width="30" height="6" rx="3" fill="white" fillOpacity="0.3"/>
            <rect x="141" y="74" width="20" height="20" rx="3" fill="white" fillOpacity="0.15"/>
            <rect x="141" y="100" width="30" height="10" rx="5" fill="#34d399" fillOpacity="0.8"/>
            <rect x="100" y="140" width="40" height="8" rx="2" fill="white" fillOpacity="0.2"/>
            <rect x="86" y="147" width="68" height="5" rx="2.5" fill="white" fillOpacity="0.1"/>
            <rect x="56" y="164" width="128" height="56" rx="8" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.15" strokeWidth="1"/>
            {[0,1,2].map(row=>[0,1,2,3].map(col=>(
              <rect key={`${row}-${col}`} x={68+col*26} y={174+row*14} width="18" height="8" rx="3" fill="white" fillOpacity={row===2&&col===3?"0.4":"0.12"}/>
            )))}
          </svg>
          <div className="absolute -top-2 -right-4 bg-white/15 backdrop-blur border border-white/20 rounded-xl px-3 py-2 text-left shadow-lg">
            <p className="text-white/60 text-xs">Penjualan Hari Ini</p>
            <p className="text-white font-bold text-sm">Rp 4.250.000</p>
          </div>
          <div className="absolute bottom-4 -left-6 bg-white/15 backdrop-blur border border-white/20 rounded-xl px-3 py-2 text-left shadow-lg">
            <p className="text-white/60 text-xs">Transaksi</p>
            <p className="text-white font-bold text-sm">128 hari ini</p>
          </div>
        </div>
        <h2 className="text-white text-2xl font-bold leading-tight mb-3">
          Kelola Toko Kamu<br />dengan Lebih Cerdas
        </h2>
        <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
          Sistem kasir modern untuk pengelolaan produk, transaksi, dan laporan dalam satu platform.
        </p>
      </div>
      <div className="relative z-10 space-y-3">
        {[
          { icon: <FiZap size={15} />,      text: "Proses transaksi lebih cepat dengan kasir POS" },
          { icon: <FiBarChart2 size={15} />, text: "Laporan penjualan real-time dan akurat" },
          { icon: <FiShield size={15} />,    text: "Data aman dengan enkripsi dan audit trail" },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-white">
              {f.icon}
            </div>
            <p className="text-blue-100 text-sm">{f.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function RegisterContent() {
  const steps = [
    { icon: <FiEdit size={15} />, title: "Isi Data Diri", desc: "Nama, email, dan telepon Anda" },
    { icon: <FiLock size={15} />, title: "Buat Password",  desc: "Password minimal 8 karakter" },
    { icon: <FiStar size={15} />, title: "Mulai Gunakan", desc: "Akses semua fitur POS System" },
  ];
  return (
    <>
      <div className="relative z-10">
        <h2 className="text-white text-2xl font-bold mb-2">Mulai dalam 3 Langkah</h2>
        <p className="text-purple-200 text-sm mb-8">Daftar gratis dan kelola toko lebih efisien</p>
        <div className="space-y-5">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg text-white">{s.icon}</div>
                {i < steps.length - 1 && <div className="w-0.5 h-5 bg-white/20 mt-2" />}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{s.title}</p>
                <p className="text-purple-200 text-xs mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[{ v: "2.4K+", l: "Pengguna" }, { v: "18K+", l: "Transaksi/Hari" }, { v: "99.9%", l: "Uptime" }].map((s, i) => (
            <div key={i} className="bg-white/10 border border-white/20 rounded-xl p-3 text-center">
              <p className="text-white font-bold text-lg leading-tight">{s.v}</p>
              <p className="text-purple-200 text-xs mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function AuthLeftPanel({ variant }: Props) {
  const isLogin = variant === "login";
  const gradient = isLogin
    ? "from-blue-600 via-blue-700 to-indigo-800"
    : "from-blue-600 via-blue-700 to-indigo-800";

  return (
    <div className={`hidden lg:flex lg:w-8/12 relative overflow-hidden bg-linear-to-br ${gradient} flex-col justify-start gap-10 p-12`}>
      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-white/5 rounded-full" />
      </div>

      {/* Brand */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <FiShoppingCart size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">Arukas</span>
        </div>
        <p className={`text-sm ${isLogin ? "text-blue-200" : "text-purple-200"}`}>
          Arukas | Solusi Kasir Modern
        </p>
      </div>

      {isLogin ? <LoginContent /> : <RegisterContent />}
    </div>
  );
}