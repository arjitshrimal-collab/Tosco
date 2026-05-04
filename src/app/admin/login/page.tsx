'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setAuthError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setAuthError('Invalid email or password. Please try again.')
      } else if (result?.ok) {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setAuthError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#FAF7F2' }}
    >
      {/* Background texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(184,147,90,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 70%, rgba(184,147,90,0.04) 0%, transparent 60%)',
        }}
      />

      <div className="relative w-full max-w-[400px]">
        {/* Card */}
        <div
          className="bg-white rounded-[8px] overflow-hidden"
          style={{
            boxShadow:
              '0 2px 8px rgba(26,26,26,0.06), 0 8px 32px rgba(184,147,90,0.10), 0 24px 64px rgba(26,26,26,0.08)',
          }}
        >
          {/* Gold accent bar */}
          <div className="h-1 w-full bg-[#B8935A]" />

          <div className="px-8 py-10">
            {/* Logo / heading */}
            <div className="text-center mb-8">
              <h1
                className="text-3xl font-semibold tracking-[0.12em] text-[#1A1A1A] mb-1"
                style={{
                  fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
                }}
              >
                TOSCO
              </h1>
              <p className="text-[11px] tracking-[0.22em] uppercase text-[#9C9080]">
                Admin Portal
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-px bg-[#E8E2D5]" />
              <span className="text-[11px] tracking-[0.12em] uppercase text-[#9C9080]">
                Sign in
              </span>
              <div className="flex-1 h-px bg-[#E8E2D5]" />
            </div>

            {/* Error message */}
            {authError && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-[4px] bg-red-50 border border-red-200">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{authError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium tracking-[0.08em] uppercase text-[#2D2D2D] mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className={`
                    w-full px-4 py-2.5 rounded-[4px] text-sm text-[#1A1A1A]
                    border bg-white
                    placeholder:text-[#9C9080]
                    transition-colors duration-150
                    focus:outline-none focus:ring-0
                    ${
                      errors.email
                        ? 'border-red-400 focus:border-red-400'
                        : 'border-[#E8E2D5] focus:border-[#B8935A]'
                    }
                  `}
                  placeholder="admin@toscointernational.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium tracking-[0.08em] uppercase text-[#2D2D2D] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password')}
                    className={`
                      w-full px-4 py-2.5 pr-11 rounded-[4px] text-sm text-[#1A1A1A]
                      border bg-white
                      placeholder:text-[#9C9080]
                      transition-colors duration-150
                      focus:outline-none focus:ring-0
                      ${
                        errors.password
                          ? 'border-red-400 focus:border-red-400'
                          : 'border-[#E8E2D5] focus:border-[#B8935A]'
                      }
                    `}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute right-3.5 top-1/2 -translate-y-1/2
                      text-[#9C9080] hover:text-[#1A1A1A]
                      transition-colors duration-150
                      focus-visible:outline-2 focus-visible:outline-[#B8935A]
                    "
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  w-full mt-2 py-3 px-6 rounded-[4px]
                  bg-[#B8935A] text-white text-sm font-medium tracking-[0.08em]
                  hover:bg-[#D4AC72] active:bg-[#8B6E3E]
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition-colors duration-150
                  focus-visible:outline-2 focus-visible:outline-[#B8935A] focus-visible:outline-offset-2
                "
                style={{
                  boxShadow: isLoading
                    ? 'none'
                    : '0 1px 4px rgba(184,147,90,0.30), 0 4px 16px rgba(184,147,90,0.20)',
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-[#9C9080] tracking-[0.06em]">
          Tosco International Inc. — Secure Admin Access
        </p>
      </div>
    </div>
  )
}
