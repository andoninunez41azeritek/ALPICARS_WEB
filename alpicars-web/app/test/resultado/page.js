import QuizResultPage from "../../../components/QuizResultPage";

export const metadata = {
  title: "Tu coche ideal · Resultado del test",
  description: "Resultado del test de AlpiCars: el coche que mejor encaja contigo, cuánto cuesta traerlo desde Suiza o Alemania y cómo lo hacemos.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <QuizResultPage />;
}
