document.getElementById('compartir-link').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('compartir').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('compartir').style.display = 'none';
});

window.addEventListener('click', function (event) {
    if (event.target === document.getElementById('compartir')) {
        document.getElementById('compartir').style.display = 'none';
    }
});

document.getElementById('compartirFormulario').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    showAlert('Datos enviados con éxito.', 'success');
    document.getElementById('compartir').style.display = 'none';
});

const etiquetas = [];
const datosLinea = [];
let objDatos = {};

async function obtenerCotizaciones() {
    try {
        // Obtener las fechas del localStorage
        const favoritosPorFecha = JSON.parse(localStorage.getItem('favoritos')) || {};
        const fechas = Object.keys(favoritosPorFecha);

        // Llenar el array etiquetas con las fechas
        etiquetas.push(...fechas);
        console.log("Fechas obtenidas:", etiquetas);

        // Variables para almacenar los datos de cada tipo de moneda
        let datosOficial = [];
        let datosBlue = [];
        let datosMEP = [];
        let datosTarjeta = [];

        // Recorrer las fechas para obtener los datos de cada moneda
        fechas.forEach(fecha => {
            const favoritos = favoritosPorFecha[fecha];

            favoritos.forEach(favorito => {
                console.log("Procesando favorito:", favorito);
                switch (favorito.id) {
                    case "OFICIAL":
                        datosOficial.push(favorito.compra);
                        break;
                    case "BLUE":
                        datosBlue.push(favorito.compra);
                        break;
                    case "MEP":
                        datosMEP.push(favorito.compra);
                        break;
                    case "TARJETA":
                        datosTarjeta.push(favorito.compra);
                        break;
                    default:
                        console.log("ID desconocido:", favorito.id);
                        break;
                }
            });
        });

        // Crear los objetos de datos para la gráfica
        datosLinea.push({
            label: 'USD OFICIAL',
            data: datosOficial,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 1,
            fill: false
        });

        datosLinea.push({
            label: 'USD BLUE',
            data: datosBlue,
            borderColor: "red",
            backgroundColor: "lightred",
            borderWidth: 1,
            fill: false
        });

        datosLinea.push({
            label: 'USD MEP',
            data: datosMEP,
            borderColor: "yellow",
            backgroundColor: "lightyellow",
            borderWidth: 1,
            fill: false
        });

        datosLinea.push({
            label: 'USD TARJETA',
            data: datosTarjeta,
            borderColor: "green",
            backgroundColor: "lightgreen",
            borderWidth: 1,
            fill: false
        });

        console.log('Datos de Línea:', datosLinea);

        // Crear la gráfica
        const ctx = document.getElementById("miGrafica").getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                labels: etiquetas,
                datasets: datosLinea
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,  // Valor mínimo
                        max: 2000,  // Valor máximo
                        ticks: {
                            stepSize: 100,  // Tamaño del paso entre los valores
                            callback: function(value) {
                                return value;  // Puedes personalizar la etiqueta aquí si lo deseas
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
}

// Llamar a la función para obtener las cotizaciones al cargar la página
window.onload = obtenerCotizaciones();
