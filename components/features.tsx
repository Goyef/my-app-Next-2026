export default function Features() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Nos Fonctionnalités</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Fonctionnalité 1</h3>
            <p>Description de la fonctionnalité 1.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Fonctionnalité 2</h3>
            <p>Description de la fonctionnalité 2.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Fonctionnalité 3</h3>
            <p>Description de la fonctionnalité 3.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
