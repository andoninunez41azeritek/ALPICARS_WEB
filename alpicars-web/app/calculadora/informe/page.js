import CalcReportPage from "../../../components/CalcReportPage";

export const metadata = {
  title: "Informe de costes de importación",
  description: "Cuánto cuesta importar un coche desde Suiza o Alemania con AlpiCars frente a comprarlo en España, con todos los gastos desglosados.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CalcReportPage />;
}
