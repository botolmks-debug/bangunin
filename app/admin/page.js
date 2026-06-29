'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const ADMIN_PASSWORD = 'bangunin2024'

export default function Admin() {
  const [masuk, setMasuk] = useState(false)
  const [password, setPassword] = useState('')
  const [penyedia, setPenyedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  useEffect(() => { if (masuk) fetchData() }, [masuk, filter])

  async function fetchData() {
    setLoading(true)
    const { data } = await supabase.from('penyedia').select('*').eq('status', filter).order('created_at', { ascending: false })
    setPenyedia(data || [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    await supabase.from('penyedia').update({ status }).eq('id', id)
    fetchData()
  }

  if (!masuk) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-lg font-medium mb-4">Admin BangunIn</h1>
        <input type="password" placeholder="Password admin" className="w-full px-4 py-2.5 border rounded-lg text-sm mb-3" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={() => { if (password === ADMIN_PASSWORD) setMasuk(true); else alert('Password salah!') }} className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-sm">Masuk</button>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="text-lg font-medium">Admin <span className="text-emerald-600">BangunIn</span></div>
        <div className="flex gap-2">
          {['pending','aktif','ditolak'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 text-sm rounded-full border ${filter === s ? 'bg-emerald-600 text-white border-emerald-600' : ''}`}>
              {s === 'pending' ? 'Menunggu' : s === 'aktif' ? 'Aktif' : 'Ditolak'}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-lg font-medium mb-4">
          {filter === 'pending' ? '⏳ Menunggu Verifikasi' : filter === 'aktif' ? '✅ Penyedia Aktif' : '❌ Ditolak'} ({penyedia.length})
        </h2>

        {loading ? <div className="text-center py-20 text-gray-400">Memuat...</div> :
        penyedia.length === 0 ? <div className="text-center py-20 text-gray-400">Tidak ada data</div> :
        <div className="flex flex-col gap-4">
          {penyedia.map(p => (
            <div key={p.id} className="bg-white border rounded-xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium text-gray-900">{p.nama}</div>
                  <div className="text-sm text-gray-500">{p.tipe} · {p.kota}</div>
                </div>
                <div className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString('id-ID')}</div>
              </div>
              <div className="text-sm text-gray-600 mb-3">{p.deskripsi}</div>
              <div className="text-sm text-gray-500 mb-3">
                <span>📧 {p.email}</span> · <span>📱 {p.no_wa}</span>
              </div>
              <div className="flex gap-3 mb-4">
                {p.ktp_url && <a href={p.ktp_url} target="_blank" className="text-xs px-3 py-1.5 border rounded-lg text-emerald-700 border-emerald-300 hover:bg-emerald-50">📄 Lihat KTP</a>}
                {p.npwp_url && <a href={p.npwp_url} target="_blank" className="text-xs px-3 py-1.5 border rounded-lg text-emerald-700 border-emerald-300 hover:bg-emerald-50">📄 Lihat NPWP</a>}
              </div>
              {filter === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(p.id, 'aktif')} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm">✅ Approve</button>
                  <button onClick={() => updateStatus(p.id, 'ditolak')} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm">❌ Tolak</button>
                </div>
              )}
              {filter === 'ditolak' && (
                <button onClick={() => updateStatus(p.id, 'aktif')} className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm">✅ Approve sekarang</button>
              )}
            </div>
          ))}
        </div>}
      </div>
    </main>
  )
}