'use client';

import { useState } from 'react';
import { login } from '@/lib/actions/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trophy, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden shadow-2xl shadow-emerald-500/20 border-2 border-emerald-500/30">
          <Image src="/Logo.jpeg" alt="Las Tukas Logo" fill className="object-cover" priority />
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Las Tukas
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Gestión de fútbol amateur
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xl shadow-black/10">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Iniciar sesión
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-scale-in">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
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
              placeholder="Contraseña"
              required
              className="pl-10"
              autoComplete="current-password"
              minLength={6}
            />
          </div>

          <Button type="submit" fullWidth size="lg" isLoading={loading}>
            Ingresar
          </Button>
        </form>
      </div>


    </div>
  );
}
