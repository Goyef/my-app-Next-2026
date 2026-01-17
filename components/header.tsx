"use client"

import { User } from "@deemlol/next-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserData {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (!data.error && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Accueil</h1>
        <nav>
          <ul className="flex space-x-4 items-center">
            {isLoading ? (
              <li className="text-muted-foreground">Chargement...</li>
            ) : user ? (
              <>
                <li className="flex items-center gap-2">
                  <User size={24} color="#FFFFFF" />
                  <span className="text-foreground font-medium">
                    {user.firstname} {user.lastname}
                  </span>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:text-primary transition-colors text-muted-foreground"
                  >
                    Se déconnecter
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    <User size={24} color="#FFFFFF" />
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:text-primary transition-colors">
                    Se connecter
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
