'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../lib/supabase'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) router.push('/')
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-2xl font-medium mb-2">
            Bangun<span className="text-emerald-600">In</span>
          </div>
          <p className="text-gray-500 text-sm">Masuk atau daftar akun baru</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Masuk',
                link_text: 'Sudah punya akun? Masuk',
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Daftar',
                link_text: 'Belum punya akun? Daftar',
              },
            },
          }}
        />
      </div>
    </div>
  )
}