export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-medium">
          Bangun<span className="text-emerald-600">In</span>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm border rounded-lg">Daftar jasa</button>
          <button className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg">Masuk</button>
        </div>
      </nav>
      <div className="text-center py-16 px-6">
        <h1 className="text-3xl font-medium text-gray-900 mb-3">
          Temukan jasa konstruksi terpercaya di sekitarmu
        </h1>
        <p className="text-gray-500 mb-8">Tukang, kontraktor, dan toko bahan bangunan</p>
        <div className="flex max-w-lg mx-auto gap-2">
          <input type="text" placeholder="Cari nama atau layanan..." className="flex-1 px-4 py-2 border rounded-lg text-sm" />
          <button className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm">Cari</button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { nama: "Pak Hendra Jaya", tipe: "Tukang", kota: "Makassar", desc: "Spesialis perbaikan atap, keramik, dan pengecatan rumah.", rating: 4.8, ulasan: 34 },
            { nama: "CV Karya Maju", tipe: "Kontraktor", kota: "Makassar", desc: "Kontraktor bangun rumah type 36 hingga type 120.", rating: 4.9, ulasan: 21 },
            { nama: "Toko Bangunan Sejahtera", tipe: "Toko Bahan", kota: "Makassar", desc: "Jual semen, besi, cat, keramik, dan material lengkap.", rating: 4.7, ulasan: 58 },
            { nama: "Pak Syamsul", tipe: "Tukang", kota: "Gowa", desc: "Tukang besi dan kayu, instalasi pintu dan pagar.", rating: 4.6, ulasan: 19 },
            { nama: "PT Graha Konstruksi", tipe: "Kontraktor", kota: "Gowa", desc: "Pembangunan rumah dan renovasi total.", rating: 4.8, ulasan: 15 },
            { nama: "Toko Mitra Bangunan", tipe: "Toko Bahan", kota: "Maros", desc: "Distributor cat Dulux resmi, harga grosir.", rating: 4.5, ulasan: 42 },
          ].map((p) => (
            <div key={p.nama} className="bg-white border rounded-xl p-4 hover:border-emerald-500 cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium text-sm">
                  {p.nama.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">{p.nama}</div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{p.tipe}</span>
                </div>
              </div>
              <div className="text-xs text-gray-400 mb-2">📍 {p.kota}</div>
              <div className="text-xs text-gray-500 mb-3">{p.desc}</div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-yellow-500 text-xs">{"★".repeat(Math.floor(p.rating))}</div>
                  <div className="text-xs text-gray-400">{p.ulasan} ulasan</div>
                </div>
                <button className="text-xs px-3 py-1.5 border border-emerald-600 text-emerald-600 rounded-lg">Hubungi</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}