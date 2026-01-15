"use client"; // Important pour les interactions côté client

import { useState } from 'react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: null, text: '' });

    try {
      const response = await fetch('/api/auth/password-forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.error) {
        setMessage({ type: 'error', text: data.message });
      } else {
        setMessage({ type: 'success', text: 'Un email de réinitialisation a été envoyé si ce compte existe.' });
        setEmail('');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm border border-border">
      <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Mot de passe oublié ?</h2>
      <p className="text-center mb-6 text-muted-foreground">
        Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </p>
      {message.type && (
        <div className={`mb-4 p-3 rounded-lg text-center ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-foreground">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="votre@email.com"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-lg font-medium ${isLoading ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
        >
          {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
        </button>
      </form>
    </div>
  );
}
