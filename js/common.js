// common.js
const endpoints = {
    "OFICIAL": "https://dolarapi.com/v1/dolares/oficial",
    "BLUE": "https://dolarapi.com/v1/dolares/blue",
    "MEP": "https://dolarapi.com/v1/dolares/bolsa",
    "CCL": "https://dolarapi.com/v1/dolares/contadoconliqui",
    "TARJETA": "https://dolarapi.com/v1/dolares/tarjeta",
    "MAYORISTA": "https://dolarapi.com/v1/dolares/mayorista",
    "CRIPTO": "https://dolarapi.com/v1/dolares/cripto",
    "EURO": "https://dolarapi.com/v1/cotizaciones/eur",
    "REAL": "https://dolarapi.com/v1/cotizaciones/brl",
    "CHILENO": "https://dolarapi.com/v1/cotizaciones/clp",
    "URUGUAYO": "https://dolarapi.com/v1/cotizaciones/uyu"
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
            dolarOficial: "DOLAR OFICIAL",
            dolarBlue: "DOLAR BLUE",
            dolarBolsa: "MEP",
            dolarLiqui: "CCL",
            dolarTarjeta: "TARJETA",
            dolarMayorista: "MAYORISTA",
            dolarCripto: "CRIPTO",
            EURO: "EURO",
            REAL: "REAL",
            CHILENO: "CHILENO",
            URUGUAYO: "URUGUAYO"
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

    // Obtener la fecha actual
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0!
    const year = today.getFullYear();
    const currentDate = `${day}/${month}/${year}`;

    // Cargar favoritos del localStorage
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || {};

    // Marcar los favoritos del día actual
    if (favoritos[currentDate]) {
        favoritos[currentDate].forEach(favorito => {
            const estrella = document.querySelector(`.estrella[data-id="${favorito.id}"]`);
            if (estrella) {
                estrella.classList.add('selected');
            }
        });
    } else {
        favoritos[currentDate] = [];
    }

    estrellas.forEach(estrella => {
        estrella.addEventListener('click', () => {
            const cardId = estrella.getAttribute('data-id');
            const card = document.getElementById(cardId);
            const compra = card.querySelector('.compra h2').textContent;
            const venta = card.querySelector('.venta h2').textContent;

            let index = favoritos[currentDate].findIndex(fav => fav.id === cardId);

            if (estrella.classList.contains('selected')) {
                // Eliminar de los favoritos
                estrella.classList.remove('selected');
                if (index > -1) {
                    favoritos[currentDate].splice(index, 1);
                }
            } else {
                // Agregar a los favoritos
                estrella.classList.add('selected');
                if (index === -1) {
                    favoritos[currentDate].push({
                        id: cardId,
                        dia: currentDate,
                        compra: compra,
                        venta: venta
                    });
                }
            }

            // Actualizar localStorage
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
        });
    });
});