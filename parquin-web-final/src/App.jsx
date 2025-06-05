import React, { useState, useEffect } from 'react';

const zonasBase = [
  { nombre: "Centro Histórico", tipo: "pago", precio: "2€/hora aprox.", tiempo: 5 },
  { nombre: "Centro Histórico", tipo: "gratis", precio: "Gratis", tiempo: 14 },
  { nombre: "Muelle Uno", tipo: "pago", precio: "1.5€/hora aprox.", tiempo: 4 },
  { nombre: "Muelle Uno", tipo: "gratis", precio: "Gratis", tiempo: 12 },
  { nombre: "La Malagueta", tipo: "pago", precio: "2.5€/hora aprox.", tiempo: 5 },
  { nombre: "La Malagueta", tipo: "gratis", precio: "Gratis", tiempo: 16 },
  { nombre: "Teatinos", tipo: "pago", precio: "2€/hora aprox.", tiempo: 5 },
  { nombre: "Teatinos", tipo: "gratis", precio: "Gratis", tiempo: 11 },
  { nombre: "Pedregalejo", tipo: "pago", precio: "1.8€/hora aprox.", tiempo: 5 },
  { nombre: "Pedregalejo", tipo: "gratis", precio: "Gratis", tiempo: 17 },
  { nombre: "El Palo", tipo: "pago", precio: "1.8€/hora aprox.", tiempo: 4 },
  { nombre: "El Palo", tipo: "gratis", precio: "Gratis", tiempo: 18 }
];

async function obtenerClima() {
  const API_KEY = "9f42b020bf64a9cd802f4ecddccb6d1e";
  const ciudad = "Malaga";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.weather?.[0]?.main || null;
  } catch {
    return null;
  }
}

function obtenerModificadorPorHorario(fecha = new Date()) {
  const hora = fecha.getHours();
  const dia = fecha.getDay();
  let modificador = 0;
  if ((hora >= 7 && hora < 9) || (hora >= 17 && hora < 19)) modificador += 5;
  if ((hora >= 8 && hora < 9) || (hora >= 13 && hora < 14)) modificador += 3;
  if (dia === 0 || dia === 6) modificador -= 4;
  return modificador;
}

function obtenerModificadorPorFestivo(fecha = new Date()) {
  const festivos = ['01-01', '06-01', '28-02', '17-04', '18-04', '01-05', '15-08', '13-10', '01-11', '06-12', '08-12', '25-12', '19-08', '08-09'];
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  return festivos.includes(`${dia}-${mes}`) ? 6 : 0;
}

function ajustarTiempoPorClima(zonas, clima) {
  return zonas.map(z => {
    let mod = 0;
    const esPlaya = ["La Malagueta", "Pedregalejo", "El Palo", "Muelle Uno"].includes(z.nombre);
    if (clima === "Clear" && esPlaya) mod = 5;
    else if (clima === "Thunderstorm") mod = 6;
    else if (clima === "Rain" || clima === "Drizzle") mod = 3;
    return { ...z, tiempo: Math.max(1, z.tiempo + mod) };
  });
}

function ajustarTiempoPorCortes(zonas, cortes = []) {
  return zonas.map(z => {
    const afectada = cortes.some(c => c.zona && c.zona.includes(z.nombre));
    return { ...z, tiempo: afectada ? z.tiempo + 4 : z.tiempo };
  });
}

async function obtenerCortesDeTrafico() {
  try {
    const res = await fetch('https://datosabiertos.malaga.eu/api/3/action/datastore_search?resource_id=c9eb7aea-2f85-46df-8007-c95fe3819a1e&limit=100');
    const data = await res.json();
    return data.result.records || [];
  } catch {
    return [];
  }
}

export default function App() {
  const [busqueda, setBusqueda] = useState("");
  const [zonas, setZonas] = useState(zonasBase);

  useEffect(() => {
    const actualizar = async () => {
      const clima = await obtenerClima();
      const zonasClima = ajustarTiempoPorClima(zonasBase, clima);
      const modHorario = obtenerModificadorPorHorario();
      const modFestivo = obtenerModificadorPorFestivo();

      let zonasConMods = zonasClima.map(z => ({
        ...z,
        tiempo: Math.max(1, z.tiempo + modHorario + modFestivo)
      }));

      const cortes = await obtenerCortesDeTrafico();
      const zonasFinales = ajustarTiempoPorCortes(zonasConMods, cortes);

      const conDescuento = zonasFinales.map(z =>
        z.tipo === "pago" ? { ...z, tiempo: Math.max(1, z.tiempo - 6) } : z
      );

      setZonas(conDescuento);
    };

    actualizar();
    const intervalo = setInterval(actualizar, 5 * 60 * 1000);
    return () => clearInterval(intervalo);
  }, []);

  const zonasAgrupadas = zonas.reduce((acc, z) => {
    if (!acc[z.nombre]) acc[z.nombre] = {};
    acc[z.nombre][z.tipo] = z;
    return acc;
  }, {});

  const zonasFiltradas = Object.entries(zonasAgrupadas).filter(([n]) =>
    n.toLowerCase().includes(busqueda.toLowerCase())
  );

  const obtenerColor = t => (t <= 7 ? "text-green-600" : t <= 15 ? "text-yellow-600" : "text-red-600");
  const obtenerEmoji = t => (t <= 5 ? "😃" : t <= 10 ? "😅" : t <= 15 ? "😐" : t <= 20 ? "😰" : "🥵");

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Parquin logo" className="h-28 w-28 object-contain" />
        </div>

        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Buscar zona..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full max-w-md p-2 rounded-md border border-gray-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zonasFiltradas.length > 0 ? (
            zonasFiltradas.map(([nombre, tipos], i) => (
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
            ))
          ) : (
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
