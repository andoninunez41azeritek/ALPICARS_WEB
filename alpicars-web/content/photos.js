// Fotografías de la web. Están guardadas en /public/img y se publican con licencia libre (Wikimedia Commons).
// Cada foto lleva su crédito, que aparece en el pie de página. Si cambias una foto, cambia también su crédito.
// PENDIENTE: cuando AlpiCars tenga fotos propias (coches revisados, entregas, equipo), sustitúyelas aquí.
// Las fotos de modelos muestran el modelo en general, nunca un coche concreto de AlpiCars.

import golf from "../public/img/golf.jpg";
import bmwX5 from "../public/img/bmw-x5.jpg";
import audiA6 from "../public/img/audi-a6.jpg";
import mercedesC from "../public/img/mercedes-c.jpg";
import porsche911 from "../public/img/porsche-911.jpg";
import audiRs6 from "../public/img/audi-rs6.jpg";
import rangeRover from "../public/img/range-rover.jpg";
import basilea from "../public/img/basilea.jpg";
import autobahn from "../public/img/autobahn-suiza.jpg";
import detalle from "../public/img/detalle.jpg";

const BY_SA_4 = { license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0" };

const photos = {
  basilea: {
    src: basilea,
    alt: "El Rin a su paso por Basilea, con el casco antiguo en la orilla",
    by: "WikiEuropian",
    page: "https://commons.wikimedia.org/wiki/File:Der_Rhein_in_Basel.jpg",
    ...BY_SA_4,
  },
  autobahn: {
    src: autobahn,
    alt: "Autopista en Suiza entre montañas, con un camión en el carril derecho",
    by: "Gabriel Rinaldi",
    page: "https://commons.wikimedia.org/wiki/File:Die_Autobahn_in_der_Schweiz.JPG",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  detalle: {
    src: detalle,
    alt: "Piloto trasero de un Mercedes-Benz Clase C Cabrio negro recién pulido",
    by: "Dietmar Rabich",
    page: "https://commons.wikimedia.org/wiki/File:M%C3%BCnster,_Beresa,_Mercedes-Benz_C-Klasse_Cabrio_--_2018_--_1757.jpg",
    ...BY_SA_4,
  },
  golf: {
    src: golf,
    alt: "Volkswagen Golf R blanco en el salón Auto Zürich",
    by: "Alexander-93",
    page: "https://commons.wikimedia.org/wiki/File:Volkswagen_Golf_VIII_R_20_Years_Auto_Zuerich_2023_1X7A1358.jpg",
    ...BY_SA_4,
  },
  bmw: {
    src: bmwX5,
    alt: "BMW X5 gris visto desde atrás",
    by: "Alexander-93",
    page: "https://commons.wikimedia.org/wiki/File:BMW_X5_M_(G05)_1X7A7047.jpg",
    ...BY_SA_4,
  },
  audi: {
    src: audiA6,
    alt: "Audi A6 Avant azul aparcado",
    by: "Alexander-93",
    page: "https://commons.wikimedia.org/wiki/File:2024_Audi_A6_Avant_C8_IMG_0135.jpg",
    ...BY_SA_4,
  },
  mercedes: {
    src: mercedesC,
    alt: "Mercedes-Benz Clase C blanco circulando",
    by: "Charles from Port Chester, New York",
    page: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_C-Klasse_(W206)_C_300_(2023)_(53491181737).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
  },
  porsche: {
    src: porsche911,
    alt: "Porsche 911 Carrera S blanco",
    by: "Alexander Migl",
    page: "https://commons.wikimedia.org/wiki/File:Porsche_992_Carrera_S_coupe_IMG_5838.jpg",
    ...BY_SA_4,
  },
  rs: {
    src: audiRs6,
    alt: "Audi RS6 Avant gris",
    by: "Alexander Migl",
    page: "https://commons.wikimedia.org/wiki/File:Audi_RS6_Avant_C8_1X7A0305.jpg",
    ...BY_SA_4,
  },
  rangeRover: {
    src: rangeRover,
    alt: "Range Rover Sport azul en una calle con nieve",
    by: "Damian B Oh",
    page: "https://commons.wikimedia.org/wiki/File:Land_Rover_Range_Rover_Sport_L461_Varesine_Blue_(10).jpg",
    ...BY_SA_4,
  },
};

export default photos;
