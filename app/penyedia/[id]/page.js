'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useParams } from 'next/navigation'

export default function ProfilPenyedia() {
  const { id } = useParams()
  const [penyedia, setPenyedia] = useState(null)
  const [ulasan, setUlasan] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ nama_customer: '', bintang: 5, komentar: '' })
  const [submitting, setSubmitting] = useState(false)
  const [sukses, setSukses] = useState(false)

  useEffect(() => {
    if (id) fetchData()
  }, [id])

  async function fetchData() {
    const { data: p } = await supabase.from('penyedia').select('*').eq('id', id).single()
    const { data: u } = await supabase.from('ulasan').select('*').eq('penyedia_id', id).order('created_at', { ascending: false })
    setPenyedia(p)
    setUlasan(u || [])
    setLoading(false)
  }

  async function submitUlasan() {
    if (!form.nama_customer || !form.komentar) return alert('Nama dan komentar wajib diisi!')
    setSubmitting(true)

    await supabase.from('ulasan').insert({
      penyedia_id: id,
      nama_customer: form.nama_customer,
      bintang: form.bintang,
      komentar: form.komentar
    })

    // Update rating & jumlah_ulasan di tabel penyedia
    const { data: semuaUlasan } = await supabase.from('ulasan').select('bintang').eq('penyedia_id', id)
    const total = semuaUlasan.length
    const rataRata = semuaUlasan.reduce((acc, u) => acc + u.bintang, 0) / total

    await supabase.from('penyedia').update({
      rating: Math.round(rataRata * 10) / 10,
      jumlah_ulasan: total
    }).eq('id', id)

    setForm({ nama_customer: '', bintang: 5, komentar: '' })
    setSukses(true)
    setSubmitting(false)
    fetchData()
    setTimeout(() => setSukses(false), 3000)
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Memuat...</div>
  if (!penyedia) return <div className="text-center py-20 text-gray-400">Penyedia tidak ditemukan.</div>

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-xl font-medium">Bangun<span className="text-emerald-600">In</span></a>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Profil */}
        <div className="bg-white rounded-xl p-6 mb-6 border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl">
              {penyedia.nama.split(' ').slice(0,2).map(w => w[0]).join('')}
            </div>
            <div>
              <div className="font-semibold text-lg text-gray-900">{penyedia.nama}</div>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{penyedia.tipe}</span>
              <div className="text-xs text-gray-400 mt-1">📍 {penyedia.kota}</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{penyedia.deskripsi}</p>
          <div className="flex items-center gap-4">
            <div className="text-yellow-500 text-sm">{'★'.repeat(Math.floor(penyedia.rating || 0))}</div>
            <div className="text-xs text-gray-400">{penyedia.jumlah_ulasan || 0} ulasan</div>
            <a href={`https://wa.me/${penyedia.no_wa}`} target="_blank"
              className="ml-auto text-xs px-4 py-2 bg-emerald-600 text-white rounded-lg">
              Hubungi via WhatsApp
            </a>
          </div>
        </div>

        {/* Form Ulasan */}
        <div className="bg-white rounded-xl p-6 mb-6 border">
          <h2 className="font-semibold text-gray-900 mb-4">Tulis Ulasan</h2>
          {sukses && <div className="text-emerald-600 text-sm mb-3">✓ Ulasan berhasil dikirim!</div>}
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
            placeholder="Nama kamu"
            value={form.nama_customer}
            onChange={e => setForm({...form, nama_customer: e.target.value})}
          />
          <div className="flex gap-2 mb-3">
            {[1,2,3,4,5].map(b => (
              <button key={b} onClick={() => setForm({...form, bintang: b})}
                className={`text-2xl ${b <= form.bintang ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
            ))}
          </div>
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
            rows={3}
            placeholder="Ceritakan pengalamanmu..."
            value={form.komentar}
            onChange={e => setForm({...form, komentar: e.target.value})}
          />
          <button onClick={submitUlasan} disabled={submitting}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium">
            {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
          </button>
        </div>

        {/* Daftar Ulasan */}
        <div className="bg-white rounded-xl p-6 border">
          <h2 className="font-semibold text-gray-900 mb-4">Ulasan ({ulasan.length})</h2>
          {ulasan.length === 0 ? (
            <div className="text-sm text-gray-400">Belum ada ulasan. Jadilah yang pertama!</div>
          ) : (
            ulasan.map(u => (
              <div key={u.id} className="border-b last:border-0 py-3">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium text-sm text-gray-800">{u.nama_customer}</div>
                  <div className="text-yellow-400 text-xs">{'★'.repeat(u.bintang)}</div>
                </div>
                <div className="text-xs text-gray-500">{u.komentar}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
