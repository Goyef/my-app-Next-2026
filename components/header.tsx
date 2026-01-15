"use client"

import { User } from "@deemlol/next-icons";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, isLoading, logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
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
