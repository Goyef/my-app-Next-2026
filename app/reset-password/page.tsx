import ResetPasswordForm from '@/components/resetPasswordForm';
import Link from 'next/link';

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string; email?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token, email } = await searchParams;

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm border border-border text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Lien invalide</h2>
          <p className="text-muted-foreground mb-6">
            Le lien de réinitialisation est invalide ou a expiré.
          </p>
          <Link
            href="/forgotPassword"
            className="inline-block py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <ResetPasswordForm email={email} token={token} />
    </div>
  );
}
