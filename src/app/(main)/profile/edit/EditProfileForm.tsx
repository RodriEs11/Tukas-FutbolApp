'use client';

import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Camera, Image as ImageIcon, Save, Mail, Lock } from 'lucide-react';
import type { UserProfile } from '@/lib/types/database';
import { 
  updateProfileBasicInfo, 
  updateEmail, 
  updatePassword, 
  uploadAvatar 
} from '@/lib/actions/profile';
import { useRouter } from 'next/navigation';

interface EditProfileFormProps {
  user: UserProfile & { email?: string };
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function handleUpdateProfile(formData: FormData) {
    setLoading(true);
    setMessage(null);
    const result = await updateProfileBasicInfo(formData);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      router.refresh();
    }
    setLoading(false);
  }

  async function handleUpdateEmail(formData: FormData) {
    setLoading(true);
    setMessage(null);
    const result = await updateEmail(formData);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: result.message || 'Email actualizado. Revisa tu correo.' });
    }
    setLoading(false);
  }

  async function handleUpdatePassword(formData: FormData) {
    setLoading(true);
    setMessage(null);
    const newPassword = formData.get('new_password') as string;
    const confirmPassword = formData.get('confirm_password') as string;
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      setLoading(false);
      return;
    }

    const result = await updatePassword(formData);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
      (document.getElementById('passwordForm') as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  async function handleUploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'La imagen supera el límite de 5MB.' });
      return;
    }

    setLoading(true);
    setMessage(null);
    
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      
      const formData = new FormData();
      formData.append('avatar', new File([compressedFile], file.name, { type: compressedFile.type }));

      const result = await uploadAvatar(formData);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Foto de perfil actualizada' });
        router.refresh();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ocurrió un error al comprimir la imagen.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${
          message.type === 'error' 
            ? 'bg-destructive/10 text-destructive border border-destructive/20' 
            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
        }`}>
          {message.text}
        </div>
      )}

      {/* Avatar Section */}
      <Card>
        <div className="flex flex-col items-center p-6">
          <Avatar player={user} size="lg" className="mb-4 h-24 w-24 text-3xl" />
          
          <div className="flex gap-4 w-full max-w-xs">
            <div className="flex-1">
              <label 
                htmlFor="avatar-upload-gallery" 
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md cursor-pointer transition-colors text-sm font-medium"
              >
                <ImageIcon size={18} />
                Galería
              </label>
              <input 
                id="avatar-upload-gallery" 
                type="file" 
                accept="image/*"
                className="hidden" 
                onChange={handleUploadAvatar}
                disabled={loading}
              />
            </div>
            
            <div className="flex-1">
              <label 
                htmlFor="avatar-upload-camera" 
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md cursor-pointer transition-colors text-sm font-medium"
              >
                <Camera size={18} />
                Cámara
              </label>
              <input 
                id="avatar-upload-camera" 
                type="file" 
                accept="image/*"
                capture="user"
                className="hidden" 
                onChange={handleUploadAvatar}
                disabled={loading}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Sube una imagen de tu galería o toma una foto
          </p>
        </div>
      </Card>

      {/* Basic Info */}
      <Card>
        <div className="p-4 border-b border-border/60">
          <h3 className="font-semibold flex items-center gap-2">
            Información Básica
          </h3>
        </div>
        <form action={handleUpdateProfile} className="p-4 space-y-4">
          <Input 
            name="first_name" 
            label="Nombre" 
            defaultValue={user.first_name} 
            required 
          />
          <Input 
            name="last_name" 
            label="Apellido" 
            defaultValue={user.last_name} 
            required 
          />
          <Input 
            name="nickname" 
            label="Apodo (Opcional)" 
            defaultValue={user.nickname} 
          />
          <Button type="submit" disabled={loading} className="w-full">
            <Save size={16} className="mr-2" />
            Guardar cambios
          </Button>
        </form>
      </Card>

      {/* Email */}
      <Card>
        <div className="p-4 border-b border-border/60">
          <h3 className="font-semibold flex items-center gap-2">
            <Mail size={18} className="text-muted-foreground" />
            Correo Electrónico
          </h3>
        </div>
        <form action={handleUpdateEmail} className="p-4 space-y-4">
          <Input 
            name="email" 
            type="email"
            label="Email actual" 
            defaultValue={user.email} 
            required 
          />
          <Button type="submit" variant="secondary" disabled={loading} className="w-full">
            Actualizar Email
          </Button>
        </form>
      </Card>

      {/* Password */}
      <Card>
        <div className="p-4 border-b border-border/60">
          <h3 className="font-semibold flex items-center gap-2">
            <Lock size={18} className="text-muted-foreground" />
            Contraseña
          </h3>
        </div>
        <form id="passwordForm" action={handleUpdatePassword} className="p-4 space-y-4">
          <Input 
            name="current_password" 
            type="password"
            label="Contraseña Actual" 
            required 
          />
          <Input 
            name="new_password" 
            type="password"
            label="Nueva Contraseña" 
            required 
          />
          <Input 
            name="confirm_password" 
            type="password"
            label="Confirmar Nueva Contraseña" 
            required 
          />
          <Button type="submit" variant="secondary" disabled={loading} className="w-full">
            Cambiar Contraseña
          </Button>
        </form>
      </Card>
    </div>
  );
}
