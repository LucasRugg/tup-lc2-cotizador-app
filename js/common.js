
// common.js
const endpoints = {
    "dolar-oficial": "https://dolarapi.com/v1/dolares/oficial",
    "dolar-blue": "https://dolarapi.com/v1/dolares/blue",
    "dolar-mep": "https://dolarapi.com/v1/dolares/bolsa",
    "dolar-ccl": "https://dolarapi.com/v1/dolares/contadoconliqui",
    "dolar-tarjeta": "https://dolarapi.com/v1/dolares/tarjeta",
    "dolar-mayorista": "https://dolarapi.com/v1/dolares/mayorista",
    "dolar-cripto": "https://dolarapi.com/v1/dolares/cripto",
    "euro": "https://dolarapi.com/v1/cotizaciones/eur",
    "real": "https://dolarapi.com/v1/cotizaciones/brl",
    "chileno": "https://dolarapi.com/v1/cotizaciones/clp",
    "uruguayo": "https://dolarapi.com/v1/cotizaciones/uyu"
};

async function obtenerCotizacion(url, elementoId) {
    try {
        console.log(`Solicitando datos de: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Datos recibidos para ${elementoId}:`, data);

        let cotizacion;

        if (Array.isArray(data)) {
            cotizacion = data.find(item => item.nombre.toLowerCase().includes(elementoId.split('-')[1]));
        } else if (typeof data === 'object') {
            cotizacion = data;
        } else {
            throw new Error(`Formato de datos incorrecto o datos vacíos para ${elementoId}`);
        }

        if (cotizacion && cotizacion.compra && cotizacion.venta) {
            const compraElemento = document.querySelector(`#${elementoId} .compra h2`);
            const ventaElemento = document.querySelector(`#${elementoId} .venta h2`);

            if (compraElemento && ventaElemento) {
                compraElemento.textContent = `$${cotizacion.compra}`;
                ventaElemento.textContent = `$${cotizacion.venta}`;
            } else {
                throw new Error(`Elementos de compra/venta no encontrados para ${elementoId}`);
            }
        } else {
            throw new Error(`Datos insuficientes para mostrar la cotización de ${elementoId}`);
        }
    } catch (error) {
        console.error('Error al obtener la cotización:', error);
        const errorElemento = document.getElementById(elementoId);
        if (errorElemento) {
            errorElemento.textContent = 'Error';
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const selector = document.getElementById("monedas");

    // Función para mostrar todas las cards y cargar sus cotizaciones
    function mostrarTodasLasCards() {
        document.querySelectorAll('.card').forEach(card => {
            card.style.display = 'block';
            const cardId = card.id;
            obtenerCotizacion(endpoints[cardId], cardId);
        });
    }

    // Mostrar todas las cards por defecto y cargar sus cotizaciones
    mostrarTodasLasCards();

    selector.addEventListener("change", (event) => {
        const selectedValue = event.target.value;
        const idMapping = {
            dolarOficial: "dolar-oficial",
            dolarBlue: "dolar-blue",
            dolarBolsa: "dolar-mep",
            dolarLiqui: "dolar-ccl",
            dolarTarjeta: "dolar-tarjeta",
            dolarMayorista: "dolar-mayorista",
            dolarCripto: "dolar-cripto",
            euro: "euro",
            real: "real",
            chileno: "chileno",
            uruguayo: "uruguayo"
        };

        if (selectedValue === "todas") {
            mostrarTodasLasCards();
        } else {
            const elementoId = idMapping[selectedValue];
            
            // Ocultar todas las cards
            document.querySelectorAll('.card').forEach(card => {
                card.style.display = 'none';
            });

            // Mostrar la card seleccionada
            const selectedCard = document.getElementById(elementoId);
            if (selectedCard) {
                selectedCard.style.display = 'block';
                obtenerCotizacion(endpoints[elementoId], elementoId);
            }
        }
    });
});


// Localstorage de favoritos
document.addEventListener('DOMContentLoaded', () => {
    const estrellas = document.querySelectorAll('.estrella');

    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    favoritos.forEach(id => {
        const estrella = document.querySelector(`.estrella[data-id="${id}"]`);
        if (estrella) {
            estrella.classList.add('selected');
        }
    });

    estrellas.forEach(estrella => {
        estrella.addEventListener('click', () => {
            const cardId = estrella.getAttribute('data-id');

            if (estrella.classList.contains('selected')) {
                // saco de fav
                estrella.classList.remove('selected');
                const index = favoritos.indexOf(cardId);
                if (index > -1) {
                    favoritos.splice(index, 1);
                }
            } else {
                // agrego a fav
                estrella.classList.add('selected');
                if (!favoritos.includes(cardId)) {
                    favoritos.push(cardId);
                }
            }

            // actualizo
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
        });
    });
});
