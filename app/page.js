'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [penyedia, setPenyedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [kategori, setKategori] = useState('semua')

  useEffect(() => {
    fetchPenyedia()
  }, [])

  async function fetchPenyedia() {
    const { data } = await supabase.from('penyedia').select('*')
    setPenyedia(data || [])
    setLoading(false)
  }

  const filtered = penyedia.filter(p => {
    const matchKat = kategori === 'semua' || p.tipe === kategori
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase())
    return matchKat && matchSearch
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-medium">Bangun<span className="text-emerald-600">In</span></div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm border rounded-lg">Daftar jasa</button>
          <button className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg">Masuk</button>
        </div>
      </nav>

      <div className="text-center py-16 px-6">
        <h1 className="text-3xl font-medium text-gray-900 mb-3">Temukan jasa konstruksi terpercaya di sekitarmu</h1>
        <p className="text-gray-500 mb-8">Tukang, kontraktor, dan toko bahan bangunan</p>
        <div className="flex max-w-lg mx-auto gap-2">
          <input type="text" placeholder="Cari nama atau layanan..." className="flex-1 px-4 py-2 border rounded-lg text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          <button className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm">Cari</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="flex gap-3 mb-6 flex-wrap">
          {[['semua','Semua'],['tukang','Tukang'],['kontraktor','Kontraktor'],['toko','Toko Bahan']].map(([val, label]) => (
            <button key={val} onClick={() => setKategori(val)} className={`px-4 py-2 text-sm border rounded-full ${kategori === val ? 'bg-emerald-600 text-white border-emerald-600' : 'hover:border-emerald-600'}`}>{label}</button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Belum ada penyedia jasa. Jadilah yang pertama daftar!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white border rounded-xl p-4 hover:border-emerald-500 cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium text-sm">
                    {p.nama.split(' ').slice(0,2).map(w => w[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">{p.nama}</div>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{p.tipe}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mb-2">📍 {p.kota}</div>
                <div className="text-xs text-gray-500 mb-3">{p.deskripsi}</div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-yellow-500 text-xs">{'★'.repeat(Math.floor(p.rating || 0))}</div>
                    <div className="text-xs text-gray-400">{p.jumlah_ulasan || 0} ulasan</div>
                  </div>
                  <a href={`https://wa.me/${p.no_wa}`} target="_blank" className="text-xs px-3 py-1.5 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50">Hubungi</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}