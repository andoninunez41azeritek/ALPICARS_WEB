// Fotos de ambiente (Unsplash, servidas por Lorem Picsum).
// PENDIENTE: sustituirlas por fotos propias de AlpiCars (coches, equipo, entregas) en /public/img
// y cambiar aquí la ruta, por ejemplo: src: "/img/entrega-madrid.jpg".

const pic = (id, w, h) => `https://picsum.photos/id/${id}/${w}/${h}`;

const photos = {
  hero: { src: pic(1018, 1600, 1200), alt: "Carretera de montaña con curvas bajo la niebla", by: "Andrew Ridley" },
  about: { src: pic(450, 1600, 1000), alt: "Lago turquesa en un valle entre montañas nevadas", by: "Tanvi Malik" },
  shop: { src: pic(133, 900, 600), alt: "Dos coches clásicos aparcados ante puertas de garaje amarillas", by: "Dietmar Becker" },
  road: { src: pic(964, 900, 900), alt: "Carretera vacía entre paisaje nevado", by: "Jon Ottosson" },
  peaks: { src: pic(296, 1600, 1000), alt: "Cordillera nevada bajo un cielo azul intenso", by: "Greg Shield" },
};

export default photos;
