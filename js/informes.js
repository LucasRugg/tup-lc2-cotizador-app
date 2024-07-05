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
        let datosCCL = [];
        let datosTarjeta = [];
        let datosMayorista = [];
        let datosCripto = [];
        let datosEuro = [];
        let datosReal = [];
        let datosChileno = [];
        let datosUruguayo = [];

        // Recorrer las fechas para obtener los datos de cada moneda
        fechas.forEach(fecha => {
            const favoritos = favoritosPorFecha[fecha];

            // Inicializar variables de control para cada tipo de moneda
            let tieneOficial = false;
            let tieneBlue = false;
            let tieneMEP = false;
            let tieneCCL = false;
            let tieneTarjeta = false;
            let tieneMayorista = false;
            let tieneCripto = false;
            let tieneEuro = false;
            let tieneReal = false;
            let tieneChileno = false;
            let tieneUruguayo = false;

            favoritos.forEach(favorito => {
                console.log("Procesando favorito:", favorito);
                switch (favorito.id) {
                    case "OFICIAL":
                        datosOficial.push(favorito.compra.slice(1));
                        tieneOficial = true;
                        break;
                    case "BLUE":
                        datosBlue.push(favorito.compra.slice(1));
                        tieneBlue = true;
                        break;
                    case "MEP":
                        datosMEP.push(favorito.compra.slice(1));
                        tieneMEP = true;
                        break;
                    case "CCL":
                        datosCCL.push(favorito.compra.slice(1));
                        tieneCCL = true;
                        break;
                    case "TARJETA":
                        datosTarjeta.push(favorito.compra.slice(1));
                        tieneTarjeta = true;
                        break;
                    case "MAYORISTA":
                        datosMayorista.push(favorito.compra.slice(1));
                        tieneMayorista = true;
                        break;
                    case "CRIPTO":
                        datosCripto.push(favorito.compra.slice(1));
                        tieneCripto = true;
                        break;
                    case "EURO":
                        datosEuro.push(favorito.compra.slice(1));
                        tieneEuro = true;
                        break;
                    case "REAL":
                        datosReal.push(favorito.compra.slice(1));
                        tieneReal = true;
                        break;
                    case "CHILENO":
                        datosChileno.push(favorito.compra.slice(1));
                        tieneChileno = true;
                        break;
                    case "URUGUAYO":
                        datosUruguayo.push(favorito.compra.slice(1));
                        tieneUruguayo = true;
                        break;
                    default:
                        console.log("ID desconocido:", favorito.id);
                        break;
                }
            });

            // Agregar espacios en blanco si falta alguna cotización
            if (!tieneOficial) datosOficial.push('');
            if (!tieneBlue) datosBlue.push('');
            if (!tieneMEP) datosMEP.push('');
            if (!tieneTarjeta) datosTarjeta.push('');
            if (!tieneCCL) datosCCL.push('');
            if (!tieneTarjeta) datosTarjeta.push('');
            if (!tieneMayorista) datosMayorista.push('');
            if (!tieneCripto) datosCripto.push('');
            if (!tieneEuro) datosEuro.push('');
            if (!tieneReal) datosReal.push('');
            if (!tieneChileno) datosChileno.push('');
            if (!tieneUruguayo) datosUruguayo.push('');

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
            label: 'USD CCL',
            data: datosCCL,
            borderColor: "coral",
            backgroundColor: "lightcoral",
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

        datosLinea.push({
            label: 'USD MAYORISTA',
            data: datosMayorista,
            borderColor: "black",
            backgroundColor: "lightblack",
            borderWidth: 1,
            fill: false
        });

        datosLinea.push({
            label: 'USD CRIPTO',
            data: datosCripto,
            borderColor: "orange",
            backgroundColor: "lightorange",
            borderWidth: 1,
            fill: false
        });

        datosLinea.push({
            label: 'EURO',
            data: datosEuro,
            borderColor: "purple",
            backgroundColor: "lightpurple",
            borderWidth: 1,
            fill: false
        });

        datosLinea.push({
            label: 'REAL',
            data: datosReal,
            borderColor: "pink",
            backgroundColor: "lightpink",
            borderWidth: 1,
            fill: false
        });

        datosLinea.push({
            label: 'CHILENO',
            data: datosChileno,
            borderColor: "gray",
            backgroundColor: "lightgray",
            borderWidth: 1,
            fill: false
        });

        datosLinea.push({
            label: 'URUGUAYO',
            data: datosUruguayo,
            borderColor: "navy",
            backgroundColor: "lightnavy",
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
                        max: 1500,  // Valor máximo
                        ticks: {
                            stepSize: 10,  // Tamaño del paso entre los valores
                            callback: function (value) {
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
