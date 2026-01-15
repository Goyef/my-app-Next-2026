export default function Features() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Nos Fonctionnalités (se connecter pour en profiter)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-xl font-semibold mb-2 text-foreground">Fonctionnalité 1</h3>
            <p className="text-muted-foreground">Abonnement pour les pauvres</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-xl font-semibold mb-2 text-foreground">Fonctionnalité 2</h3>
            <p className="text-muted-foreground">Abonnement pour les moins pauvres</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-xl font-semibold mb-2 text-foreground">Fonctionnalité 3</h3>
            <p className="text-muted-foreground">Abonnement pour GOAT</p>
          </div>
        </div>
      </div>
    </section>
  );
}
