
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

    // Load favorite cards from localStorage
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    // Mark the favorites
    favoritos.forEach(favorito => {
        const estrella = document.querySelector(`.estrella[data-id="${favorito.id}"]`);
        if (estrella) {
            estrella.classList.add('selected');
        }
    });

    estrellas.forEach(estrella => {
        estrella.addEventListener('click', () => {
            const cardId = estrella.getAttribute('data-id');
            const card = document.getElementById(cardId);
            const compra = card.querySelector('.compra h2').textContent;
            const venta = card.querySelector('.venta h2').textContent;
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0!
            const year = today.getFullYear();

            const dia = `${day}/${month}/${year}`;

            let index = favoritos.findIndex(fav => fav.id === cardId);

            if (estrella.classList.contains('selected')) {
                // Remove from favorites
                estrella.classList.remove('selected');
                if (index > -1) {
                    favoritos.splice(index, 1);
                }
            } else {
                // Add to favorites
                estrella.classList.add('selected');
                if (index === -1) {
                    favoritos.push({
                        id: cardId,
                        dia: dia,
                        compra: compra,
                        venta: venta
                    });
                }
            }

            // Update localStorage
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
        });
    });
});