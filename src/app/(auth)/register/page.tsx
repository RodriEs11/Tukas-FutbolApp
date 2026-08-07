'use client';

import { useState } from 'react';
import { register } from '@/lib/actions/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trophy, Mail, Lock, User, AtSign } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await register(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 shadow-xl shadow-emerald-500/30 mb-4">
          <Trophy size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Tukas
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Creá tu cuenta de jugador
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xl shadow-black/10">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Registro
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-scale-in">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none"
              />
              <Input
                name="first_name"
                placeholder="Nombre"
                required
                className="pl-10"
                autoComplete="given-name"
              />
            </div>
            <Input
              name="last_name"
              placeholder="Apellido"
              required
              autoComplete="family-name"
            />
          </div>

          <div className="relative">
            <AtSign
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none"
            />
            <Input
              name="nickname"
              placeholder="Apodo (opcional)"
              className="pl-10"
            />
          </div>

          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none"
            />
            <Input
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              className="pl-10"
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none"
            />
            <Input
              name="password"
              type="password"
              placeholder="Contraseña (mín. 6 caracteres)"
              required
              className="pl-10"
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <Button type="submit" fullWidth size="lg" isLoading={loading}>
            Crear cuenta
          </Button>
        </form>
      </div>

      {/* Login link */}
      <p className="text-center mt-6 text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{' '}
        <Link
          href="/login"
          className="text-accent hover:text-accent-hover font-medium transition-colors"
        >
          Iniciá sesión
        </Link>
      </p>
    </div>
  );
}
