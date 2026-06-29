'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

const CLOUD_NAME = 'dtcwn76pk'
const UPLOAD_PRESET = 'bangunin_docs'

async function uploadGambar(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST', body: formData
  })
  const data = await res.json()
  return data.secure_url
}

export default function DaftarJasa() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [sukses, setSukses] = useState(false)
  const [form, setForm] = useState({
    nama: '', tipe: 'tukang', kota: '', deskripsi: '', no_wa: '', email: ''
  })
  const [ktpFile, setKtpFile] = useState(null)
  const [npwpFile, setNpwpFile] = useState(null)

  const kota = ['Makassar', 'Gowa', 'Maros', 'Takalar', 'Bone', 'Pare-Pare', 'Palopo', 'Sinjai', 'Bulukumba', 'Bantaeng']

  async function handleSubmit() {
    if (!ktpFile || !npwpFile) { alert('Mohon upload KTP dan NPWP!'); return }
    setLoading(true)
    try {
      const [ktp_url, npwp_url] = await Promise.all([
        uploadGambar(ktpFile), uploadGambar(npwpFile)
      ])
      const { error } = await supabase.from('penyedia').insert([{
        ...form, ktp_url, npwp_url, status: 'pending'
      }])
      if (error) throw error
      setSukses(true)
    } catch (e) {
      alert('Gagal daftar: ' + e.message)
    }
    setLoading(false)
  }

  if (sukses) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
        <p className="text-gray-500 text-sm mb-2">Dokumen kamu sedang kami verifikasi.</p>
        <p className="text-gray-500 text-sm mb-6">Kami akan menghubungi kamu via WhatsApp setelah verifikasi selesai (1-2 hari kerja).</p>
        <button onClick={() => router.push('/')} className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-sm">Kembali ke halaman utama</button>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4">
        <a href="/" className="text-xl font-medium">Bangun<span className="text-emerald-600">In</span></a>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          {[1,2,3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
              {s < 3 && <div className={`h-0.5 w-16 ${step > s ? 'bg-emerald-600' : 'bg-gray-200'}`}/>}
            </div>
          ))}
          <span className="text-sm text-gray-500 ml-2">{step === 1 ? 'Data Usaha' : step === 2 ? 'Kontak' : 'Dokumen'}</span>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h2 className="font-medium text-gray-900">Data Usaha</h2>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nama / Nama Usaha</label>
                <input type="text" placeholder="Contoh: Pak Hendra atau CV Karya Maju" className="w-full px-4 py-2.5 border rounded-lg text-sm" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Kategori</label>
                <select className="w-full px-4 py-2.5 border rounded-lg text-sm" value={form.tipe} onChange={e => setForm({...form, tipe: e.target.value})}>
                  <option value="tukang">Tukang / Jasa Perbaikan</option>
                  <option value="kontraktor">Kontraktor Bangun Rumah</option>
                  <option value="toko">Toko Bahan Bangunan</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Kota</label>
                <select className="w-full px-4 py-2.5 border rounded-lg text-sm" value={form.kota} onChange={e => setForm({...form, kota: e.target.value})}>
                  <option value="">Pilih kota...</option>
                  {kota.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Deskripsi Layanan</label>
                <textarea rows={3} placeholder="Jelaskan layanan kamu secara singkat..." className="w-full px-4 py-2.5 border rounded-lg text-sm resize-none" value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} />
              </div>
              <button onClick={() => { if (!form.nama || !form.kota || !form.deskripsi) { alert('Mohon isi semua field!'); return } setStep(2) }} className="w-full py-3 bg-emerald-600 text-white rounded-lg text-sm font-medium">Lanjut →</button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="font-medium text-gray-900">Informasi Kontak</h2>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email Aktif</label>
                <input type="email" placeholder="email@gmail.com" className="w-full px-4 py-2.5 border rounded-lg text-sm" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <p className="text-xs text-gray-400 mt-1">Untuk notifikasi status verifikasi akun kamu</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nomor WhatsApp</label>
                <input type="text" placeholder="Contoh: 081234567890" className="w-full px-4 py-2.5 border rounded-lg text-sm" value={form.no_wa} onChange={e => setForm({...form, no_wa: e.target.value})} />
                <p className="text-xs text-gray-400 mt-1">Nomor ini yang akan dihubungi customer</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border rounded-lg text-sm">← Kembali</button>
                <button onClick={() => { if (!form.email || !form.no_wa) { alert('Mohon isi semua field!'); return } setStep(3) }} className="flex-1 py-3 bg-emerald-600 text-white rounded-lg text-sm font-medium">Lanjut →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h2 className="font-medium text-gray-900">Upload Dokumen</h2>
              <p className="text-xs text-gray-500">Dokumen diperlukan untuk verifikasi identitas dan mencegah akun palsu. Data kamu aman dan tidak disebarkan.</p>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Foto KTP <span className="text-red-500">*</span></label>
                <div className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-emerald-400 ${ktpFile ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'}`} onClick={() => document.getElementById('ktp-input').click()}>
                  {ktpFile ? <p className="text-sm text-emerald-700">✓ {ktpFile.name}</p> : <p className="text-sm text-gray-400">Klik untuk upload foto KTP</p>}
                </div>
                <input id="ktp-input" type="file" accept="image/*" className="hidden" onChange={e => setKtpFile(e.target.files[0])} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Foto NPWP <span className="text-red-500">*</span></label>
                <div className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-emerald-400 ${npwpFile ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'}`} onClick={() => document.getElementById('npwp-input').click()}>
                  {npwpFile ? <p className="text-sm text-emerald-700">✓ {npwpFile.name}</p> : <p className="text-sm text-gray-400">Klik untuk upload foto NPWP</p>}
                </div>
                <input id="npwp-input" type="file" accept="image/*" className="hidden" onChange={e => setNpwpFile(e.target.files[0])} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 border rounded-lg text-sm">← Kembali</button>
                <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 bg-emerald-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  {loading ? 'Mengirim...' : 'Daftar Sekarang'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}