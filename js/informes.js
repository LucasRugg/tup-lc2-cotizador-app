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

let chart = null;

document.getElementById('monedas').addEventListener('change', function () {
    actualizarGrafica(this.value);
});

async function obtenerCotizaciones() {
    try {
        const favoritosPorFecha = JSON.parse(localStorage.getItem('favoritos')) || {};
        const fechas = Object.keys(favoritosPorFecha);
        const etiquetas = [...fechas];
        const datos = {
            dolarOficial: [],
            dolarBlue: [],
            dolarBolsa: [],
            dolarLiqui: [],
            dolarTarjeta: [],
            dolarMayorista: [],
            dolarCripto: [],
            EURO: [],
            REAL: [],
            CHILENO: [],
            URUGUAYO: []
        };

        fechas.forEach(fecha => {
            const favoritos = favoritosPorFecha[fecha];

            favoritos.forEach(favorito => {
                const valorCompra = parseFloat(favorito.compra.slice(1)) || 0;

                switch (favorito.id) {
                    case "OFICIAL":
                        datos.dolarOficial.push(valorCompra);
                        break;
                    case "BLUE":
                        datos.dolarBlue.push(valorCompra);
                        break;
                    case "MEP":
                        datos.dolarBolsa.push(valorCompra);
                        break;
                    case "CCL":
                        datos.dolarLiqui.push(valorCompra);
                        break;
                    case "TARJETA":
                        datos.dolarTarjeta.push(valorCompra);
                        break;
                    case "MAYORISTA":
                        datos.dolarMayorista.push(valorCompra);
                        break;
                    case "CRIPTO":
                        datos.dolarCripto.push(valorCompra);
                        break;
                    case "EURO":
                        datos.EURO.push(valorCompra);
                        break;
                    case "REAL":
                        datos.REAL.push(valorCompra);
                        break;
                    case "CHILENO":
                        datos.CHILENO.push(valorCompra);
                        break;
                    case "URUGUAYO":
                        datos.URUGUAYO.push(valorCompra);
                        break;
                    default:
                        console.log("ID desconocido:", favorito.id);
                        break;
                }
            });

            // Rellenar los datos que no están presentes para la fecha con un valor nulo (opcional)
            Object.keys(datos).forEach(key => {
                if (datos[key].length < etiquetas.length) {
                    datos[key].push(null);
                }
            });
        });

        return { etiquetas, datos };
    } catch (error) {
        console.log(error);
        return { etiquetas: [], datos: {} };
    }
}

function crearGrafica(labels, datasets) {
    const ctx = document.getElementById("miGrafica").getContext("2d");
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            spanGaps: true, // Esta opción unirá los puntos con líneas incluso si hay datos faltantes
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 1500, // Ajustar según los datos
                    ticks: {
                        stepSize: 10,
                        callback: function (value) { return value; }
                    }
                }
            }
        }
    });
}

async function actualizarGrafica(moneda) {
    const { etiquetas, datos } = await obtenerCotizaciones();

    if (moneda === 'todas') {
        const datasets = Object.keys(datos).map(key => ({
            label: key.toUpperCase(),
            data: datos[key],
            borderColor: getColorForKey(key),
            backgroundColor: getColorForKey(key, 0.2),
            borderWidth: 1,
            fill: false,
            spanGaps: true // Unir puntos con líneas para cada dataset
        }));
        crearGrafica(etiquetas, datasets);
    } else {
        crearGrafica(etiquetas, [{
            label: moneda.toUpperCase(),
            data: datos[moneda],
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 1,
            fill: false,
            spanGaps: true // Unir puntos con líneas
        }]);
    }
}

function getColorForKey(key, opacity = 1) {
    const colors = {
        dolarOficial: `rgba(54, 162, 235, ${opacity})`,
        dolarBlue: `rgba(255, 99, 132, ${opacity})`,
        dolarBolsa: `rgba(255, 206, 86, ${opacity})`,
        dolarLiqui: `rgba(75, 192, 192, ${opacity})`,
        dolarTarjeta: `rgba(153, 102, 255, ${opacity})`,
        dolarMayorista: `rgba(255, 159, 64, ${opacity})`,
        dolarCripto: `rgba(255, 159, 132, ${opacity})`,
        EURO: `rgba(201, 203, 207, ${opacity})`,
        REAL: `rgba(63, 103, 126, ${opacity})`,
        CHILENO: `rgba(70, 191, 189, ${opacity})`,
        URUGUAYO: `rgba(77, 83, 96, ${opacity})`
    };
    return colors[key] || `rgba(0, 0, 0, ${opacity})`;
}

window.onload = async function () {
    const { etiquetas, datos } = await obtenerCotizaciones();
    const datasets = Object.keys(datos).map(key => ({
        label: key.toUpperCase(),
        data: datos[key],
        borderColor: getColorForKey(key),
        backgroundColor: getColorForKey(key, 0.2),
        borderWidth: 1,
        fill: false,
        spanGaps: true // Unir puntos con líneas
    }));
    crearGrafica(etiquetas, datasets);
};
