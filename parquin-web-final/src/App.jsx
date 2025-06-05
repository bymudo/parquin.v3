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
  { nombre: "El Palo", tipo: "gratis", precio: "Gratis", tiempo: 18 },
  { nombre: "Huelin", tipo: "pago", precio: "1.8€/hora aprox.", tiempo: 4 },
  { nombre: "Huelin", tipo: "gratis", precio: "Gratis", tiempo: 13 },
  { nombre: "Carretera de Cádiz", tipo: "pago", precio: "1.7€/hora aprox.", tiempo: 5 },
  { nombre: "Carretera de Cádiz", tipo: "gratis", precio: "Gratis", tiempo: 12 },
  { nombre: "Málaga Este", tipo: "pago", precio: "2€/hora aprox.", tiempo: 4 },
  { nombre: "Málaga Este", tipo: "gratis", precio: "Gratis", tiempo: 15 },
  { nombre: "Ciudad Jardín", tipo: "pago", precio: "1.5€/hora aprox.", tiempo: 3 },
  { nombre: "Ciudad Jardín", tipo: "gratis", precio: "Gratis", tiempo: 11 },
  { nombre: "Torremolinos", tipo: "pago", precio: "2€/hora aprox.", tiempo: 4 },
  { nombre: "Torremolinos", tipo: "gratis", precio: "Gratis", tiempo: 16 },
  { nombre: "El Limonar", tipo: "pago", precio: "2€/hora aprox.", tiempo: 5 },
  { nombre: "El Limonar", tipo: "gratis", precio: "Gratis", tiempo: 15 },
  { nombre: "Portada Alta", tipo: "pago", precio: "1.5€/hora aprox.", tiempo: 5 },
  { nombre: "Portada Alta", tipo: "gratis", precio: "Gratis", tiempo: 12 },
  { nombre: "La Luz", tipo: "pago", precio: "1.6€/hora aprox.", tiempo: 5 },
  { nombre: "La Luz", tipo: "gratis", precio: "Gratis", tiempo: 13 },
  { nombre: "Bailén-Miraflores", tipo: "pago", precio: "1.4€/hora aprox.", tiempo: 5 },
  { nombre: "Bailén-Miraflores", tipo: "gratis", precio: "Gratis", tiempo: 14 },
  { nombre: "Puerto de la Torre", tipo: "pago", precio: "1.3€/hora aprox.", tiempo: 5 },
  { nombre: "Puerto de la Torre", tipo: "gratis", precio: "Gratis", tiempo: 10 },
  { nombre: "La Trinidad", tipo: "pago", precio: "1.6€/hora aprox.", tiempo: 5 },
  { nombre: "La Trinidad", tipo: "gratis", precio: "Gratis", tiempo: 13 },
  { nombre: "Cerrado de Calderón", tipo: "pago", precio: "2€/hora aprox.", tiempo: 5 },
  { nombre: "Cerrado de Calderón", tipo: "gratis", precio: "Gratis", tiempo: 16 },
  { nombre: "Capuchinos", tipo: "pago", precio: "1.6€/hora aprox.", tiempo: 5 },
  { nombre: "Capuchinos", tipo: "gratis", precio: "Gratis", tiempo: 14 },
  { nombre: "El Perchel", tipo: "pago", precio: "1.8€/hora aprox.", tiempo: 6 },
  { nombre: "El Perchel", tipo: "gratis", precio: "Gratis", tiempo: 13 },
  { nombre: "La Victoria", tipo: "pago", precio: "1.7€/hora aprox.", tiempo: 6 },
  { nombre: "La Victoria", tipo: "gratis", precio: "Gratis", tiempo: 12 },
  { nombre: "El Ejido", tipo: "pago", precio: "1.5€/hora aprox.", tiempo: 5 },
  { nombre: "El Ejido", tipo: "gratis", precio: "Gratis", tiempo: 14 },
  { nombre: "La Goleta", tipo: "pago", precio: "1.6€/hora aprox.", tiempo: 5 },
  { nombre: "La Goleta", tipo: "gratis", precio: "Gratis", tiempo: 15 },
  { nombre: "Segalerva", tipo: "pago", precio: "1.5€/hora aprox.", tiempo: 4 },
  { nombre: "Segalerva", tipo: "gratis", precio: "Gratis", tiempo: 14 },
  { nombre: "Olletas", tipo: "pago", precio: "1.7€/hora aprox.", tiempo: 5 },
  { nombre: "Olletas", tipo: "gratis", precio: "Gratis", tiempo: 13 }
];

async function obtenerClima() {
  // Implementación
}

function obtenerModificadorPorHorario() {
  // Implementación
}

function obtenerModificadorPorFestivo() {
  // Implementación
}

function ajustarTiempoPorClima(zonas, clima) {
  // Implementación
}

async function obtenerCortesDeTrafico() {
  return [];
}

function ajustarTiempoPorCortes(zonas, cortes) {
  return zonas;
}

export default function App() {
  const [busqueda, setBusqueda] = useState("");
  const [zonas, setZonas] = useState(zonasBase);

  useEffect(() => {
    const actualizar = async () => {
      const clima = await obtenerClima();
      const modHorario = obtenerModificadorPorHorario();
      const modFestivo = obtenerModificadorPorFestivo();
      let zonasMod = ajustarTiempoPorClima(zonasBase, clima).map(z => ({
        ...z,
        tiempo: Math.max(1, z.tiempo + modHorario + modFestivo)
      }));
      const cortes = await obtenerCortesDeTrafico();
      zonasMod = ajustarTiempoPorCortes(zonasMod, cortes);
      zonasMod = zonasMod.map(z => z.tipo === "pago" ? { ...z, tiempo: Math.max(1, z.tiempo - 7) } : z);
      setZonas(zonasMod);
    };
    actualizar();
    const intervalo = setInterval(actualizar, 5 * 60 * 5 * 60 * 1000);
    return () => clearInterval(intervalo);
  }, []);

  const zonasAgrupadas = zonas.reduce((acc, zona) => {
    const key = zona.nombre;
    if (!acc[key]) acc[key] = {};
    acc[key][zona.tipo] = zona;
    return acc;
  }, {});

  const zonasFiltradas = Object.entries(zonasAgrupadas).filter(([nombre]) =>
    nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

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
          <img src="/logo.png" alt="Parquin logo" className="h-28 w-28 object-contain" />
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
        <div className="flex justify-center mb-6">
  <button
    onClick={() => window.open('https://www.google.com/maps/search/parking+de+pago+Málaga', '_blank')}
    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow"
  >
    Ver parkings pagos en mapa
  </button>
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
