import React, { useState, useEffect } from 'react';

const zonasBase = [
  { nombre: "Centro Histórico", tipo: "pago", precio: "2€/hora aprox.", tiempo: 10 },
  { nombre: "Centro Histórico", tipo: "gratis", precio: "Gratis", tiempo: 14 },
  { nombre: "Muelle Uno", tipo: "pago", precio: "1.5€/hora aprox.", tiempo: 8 },
  { nombre: "Muelle Uno", tipo: "gratis", precio: "Gratis", tiempo: 12 },
  { nombre: "La Malagueta", tipo: "pago", precio: "2.5€/hora aprox.", tiempo: 9 },
  { nombre: "La Malagueta", tipo: "gratis", precio: "Gratis", tiempo: 16 },
  { nombre: "Teatinos", tipo: "pago", precio: "2€/hora aprox.", tiempo: 6 },
  { nombre: "Teatinos", tipo: "gratis", precio: "Gratis", tiempo: 11 },
  { nombre: "Pedregalejo", tipo: "pago", precio: "1.8€/hora aprox.", tiempo: 10 },
  { nombre: "Pedregalejo", tipo: "gratis", precio: "Gratis", tiempo: 17 },
  { nombre: "El Palo", tipo: "pago", precio: "1.8€/hora aprox.", tiempo: 9 },
  { nombre: "El Palo", tipo: "gratis", precio: "Gratis", tiempo: 18 },
  { nombre: "Huelin", tipo: "pago", precio: "1.8€/hora aprox.", tiempo: 7 },
  { nombre: "Huelin", tipo: "gratis", precio: "Gratis", tiempo: 13 },
  { nombre: "Carretera de Cádiz", tipo: "pago", precio: "1.7€/hora aprox.", tiempo: 6 },
  { nombre: "Carretera de Cádiz", tipo: "gratis", precio: "Gratis", tiempo: 12 },
  { nombre: "Málaga Este", tipo: "pago", precio: "2€/hora aprox.", tiempo: 8 },
  { nombre: "Málaga Este", tipo: "gratis", precio: "Gratis", tiempo: 15 },
  { nombre: "Ciudad Jardín", tipo: "pago", precio: "1.5€/hora aprox.", tiempo: 5 },
  { nombre: "Ciudad Jardín", tipo: "gratis", precio: "Gratis", tiempo: 11 },
  { nombre: "Torremolinos", tipo: "pago", precio: "2€/hora aprox.", tiempo: 7 },
  { nombre: "Torremolinos", tipo: "gratis", precio: "Gratis", tiempo: 16 },
  { nombre: "El Limonar", tipo: "pago", precio: "2€/hora aprox.", tiempo: 10 },
  { nombre: "El Limonar", tipo: "gratis", precio: "Gratis", tiempo: 15 },
  { nombre: "Portada Alta", tipo: "pago", precio: "1.5€/hora aprox.", tiempo: 6 },
  { nombre: "Portada Alta", tipo: "gratis", precio: "Gratis", tiempo: 12 },
  { nombre: "La Luz", tipo: "pago", precio: "1.6€/hora aprox.", tiempo: 7 },
  { nombre: "La Luz", tipo: "gratis", precio: "Gratis", tiempo: 13 },
  { nombre: "Bailén-Miraflores", tipo: "pago", precio: "1.4€/hora aprox.", tiempo: 9 },
  { nombre: "Bailén-Miraflores", tipo: "gratis", precio: "Gratis", tiempo: 14 },
  { nombre: "Puerto de la Torre", tipo: "pago", precio: "1.3€/hora aprox.", tiempo: 5 },
  { nombre: "Puerto de la Torre", tipo: "gratis", precio: "Gratis", tiempo: 10 },
  { nombre: "La Trinidad", tipo: "pago", precio: "1.6€/hora aprox.", tiempo: 7 },
  { nombre: "La Trinidad", tipo: "gratis", precio: "Gratis", tiempo: 13 },
  { nombre: "Cerrado de Calderón", tipo: "pago", precio: "2€/hora aprox.", tiempo: 10 },
  { nombre: "Cerrado de Calderón", tipo: "gratis", precio: "Gratis", tiempo: 16 }
];


async function obtenerClima() {
  const API_KEY = "9f42b020bf64a9cd802f4ecddccb6d1e";
  const ciudad = "Malaga";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const clima = data.weather?.[0]?.main;
    console.log("Clima actual:", clima);
    return clima || null;
  } catch (error) {
    console.error("Error al obtener el clima:", error);
    return null;
  }
}


function obtenerModificadorPorHorario(fecha = new Date()) {
  const hora = fecha.getHours();
  const dia = fecha.getDay(); // 0 = domingo, 6 = sábado
  let modificador = 0;

  if ((hora >= 7 && hora < 9) || (hora >= 17 && hora < 19)) {
    modificador += 5;
  }

  if ((hora >= 8 && hora < 9) || (hora >= 13 && hora < 14)) {
    modificador += 3;
  }

  if (dia === 0 || dia === 6) {
    modificador -= 4;
  }

  return modificador;
}



function obtenerModificadorPorFestivo(fecha = new Date()) {
  const festivos = [
    '01-01', '06-01', '28-02', '17-04', '18-04', '01-05',
    '15-08', '13-10', '01-11', '06-12', '08-12', '25-12',
    '19-08', '08-09'
  ];
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const fechaActual = `${dia}-${mes}`;
  return festivos.includes(fechaActual) ? 6 : 0;
}


function ajustarTiempoPorClima(zonas, clima) {
  return zonas.map((zona) => {
    let modificador = 0;
    const esPlaya = ["La Malagueta", "Pedregalejo", "El Palo", "Muelle Uno"].includes(zona.nombre);

    if (clima === "Clear" && esPlaya) modificador = 5;
    else if (clima === "Thunderstorm") modificador = 6;
    else if (clima === "Rain" || clima === "Drizzle") modificador = 3;

    return {
      ...zona,
      tiempo: Math.max(1, zona.tiempo + modificador),
    };
  });
}

export default function App() {
  const [busqueda, setBusqueda] = useState("");
  const [zonas, setZonas] = useState(zonasBase);

  
  useEffect(() => {
    const actualizarPorClimaYHorario = async () => {
      const clima = await obtenerClima();
      const zonasConClima = ajustarTiempoPorClima(zonasBase, clima);

      const modificadorHorario = obtenerModificadorPorHorario();
      const modificadorFestivo = obtenerModificadorPorFestivo();

      let zonasIntermedias = zonasConClima.map((zona) => {
        return {
          ...zona,
          tiempo: Math.max(1, zona.tiempo + modificadorHorario + modificadorFestivo),
        };
      });

      const cortes = await obtenerCortesDeTrafico();
      const zonasFinales = ajustarTiempoPorCortes(zonasIntermedias, cortes);

      setZonas(zonasFinales);
    };

    actualizarPorClimaYHorario();

    const intervalo = setInterval(actualizarPorClimaYHorario, 5 * 60 * 1000);
    return () => clearInterval(intervalo);
  }, []);

      
  const zonasAgrupadas = zonas.reduce((acc, zona) => {
    const key = zona.nombre;
    if (!acc[key]) acc[key] = {};
    acc[key][zona.tipo] = zona;
    return acc;
  }, {});

  const zonasFiltradas = Object.entries(zonasAgrupadas)
    .filter(([nombre]) => nombre.toLowerCase().includes(busqueda.toLowerCase()));

  const obtenerColor = (tiempo) => {
    if (tiempo <= 7) return "text-green-600";
    if (tiempo <= 15) return "text-yellow-600";
    return "text-red-600";
  };

  const obtenerEmoji = (tiempo) => {
    if (tiempo <= 5) return "😃";
    if (tiempo <= 10) return "😅";
    if (tiempo <= 15) return "😐";
    if (tiempo <= 20) return "😰";
    return "🥵";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-center mb-6">
  <img src="/logo" alt="Parquin logo" className="h-16 object-contain" />
</div>

        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Buscar zona..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full max-w-md p-2 rounded-md border border-gray-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zonasFiltradas.length > 0 ? zonasFiltradas.map(([nombre, tipos], i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md p-4">
              <h2 className="text-xl font-semibold mb-2">{nombre}</h2>
              {tipos.gratis && (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl mb-2">
                  <span className="font-semibold w-1/4 text-left">Gratis</span>
                  <span className={`font-semibold w-1/4 text-center ${obtenerColor(tipos.gratis.tiempo)}`}>{tipos.gratis.tiempo} min</span>
                  <span className="w-1/4 text-right text-xl">{obtenerEmoji(tipos.gratis.tiempo)}</span>
                </div>
              )}
              {tipos.pago && (
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl">
                  <span className="font-semibold w-1/4 text-left">Pago</span>
                  <span className={`font-semibold w-1/4 text-center ${obtenerColor(tipos.pago.tiempo)}`}>{tipos.pago.tiempo} min</span>
                  <span className="w-1/4 text-right text-xs text-gray-400">{tipos.pago.precio}</span>
                </div>
              )}
            </div>
          )) : (
            <p className="text-center col-span-2 text-gray-500">No se encontraron zonas.</p>
          )}
        </div>
      </div>

      <footer className="mt-10 text-center text-xs text-gray-400 font-sans">
        <a href="https://linktr.ee/madebymudo" target="_blank" rel="noopener noreferrer">
          @madebymudo
        </a>
      </footer>
    </div>
  );
}
