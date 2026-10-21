// PENDIENTE: texto legal definitivo de AlpiCars (obligatorio antes de publicar la web)
export const metadata = { title: "Aviso legal · AlpiCars", robots: { index: false } };

export default function Page() {
  return (
    <main className="section legal">
      <h1>Aviso legal</h1>
      <p className="lead">Texto pendiente de AlpiCars.</p>
      <p style={{ marginTop: 32 }}>
        <a className="btn btn-dark" href="/">Volver a la web</a>
      </p>
    </main>
  );
}
