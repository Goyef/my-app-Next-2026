import { User } from "@deemlol/next-icons";

export default function Header() {
  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Accueil</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:text-primary transition-colors"><User size={24} color="#FFFFFF" /></a></li>
            <li><a href="/login" className="hover:text-primary transition-colors">Se connecter</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
