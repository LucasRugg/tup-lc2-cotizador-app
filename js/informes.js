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


function generarTabla() {
    const container = document.getElementById("container-content");
    container.innerHTML = "";

    // Obtener los favoritos actuales del localStorage, agrupados por fecha
    const favoritosPorFecha = JSON.parse(localStorage.getItem("favoritos")) || {};

    // Recolectar todos los favoritos en un solo array y agrupar por ID
    let todosLosFavoritos = {};
    Object.keys(favoritosPorFecha).forEach(fecha => {
        favoritosPorFecha[fecha].forEach(favorito => {
            if (!todosLosFavoritos[favorito.id]) {
                todosLosFavoritos[favorito.id] = [];
            }
            todosLosFavoritos[favorito.id].push({ ...favorito, fecha });
        });
    });

    // Generar la tabla por grupos de ID
    Object.keys(todosLosFavoritos).forEach(id => {
        // Crear un header para cada grupo
        const idHeader = document.createElement("div");
        idHeader.classList.add("id-header");
        idHeader.textContent = id.toUpperCase();
        container.appendChild(idHeader);

        let previousVenta = null; // Variable para almacenar el valor de venta anterior

        // Crear filas para cada favorito dentro del grupo
        todosLosFavoritos[id].forEach(favorito => {
            const row = document.createElement("div");
            row.classList.add("element");
            row.setAttribute("data-id", `favorito-${favorito.id}`);

            const monedaDiv = document.createElement("div");
            monedaDiv.classList.add("moneda");
            monedaDiv.textContent = favorito.moneda;

            const fechaDiv = document.createElement("div");
            fechaDiv.classList.add("fecha");
            fechaDiv.textContent = favorito.fecha;

            const compraDiv = document.createElement("div");
            compraDiv.classList.add("compra");
            compraDiv.textContent = `${favorito.compra}`;

            const ventaDiv = document.createElement("div");
            ventaDiv.classList.add("venta");
            ventaDiv.textContent = `${favorito.venta}`;

            const accionDiv = document.createElement("div");
            accionDiv.classList.add("accion");
            const upSpan = document.createElement("span");
            upSpan.classList.add("material-symbols-outlined");
            upSpan.textContent = "keyboard_double_arrow_up";

            const downSpan = document.createElement("span");
            downSpan.classList.add("material-symbols-outlined");
            downSpan.textContent = "keyboard_double_arrow_down";

            const equalSpan = document.createElement("span");
            equalSpan.classList.add("material-symbols-outlined");
            equalSpan.textContent = "equal"

            if (previousVenta !== null) {
                if (favorito.venta > previousVenta) {
                    accionDiv.appendChild(upSpan);
                } else if (favorito.venta < previousVenta) {
                    accionDiv.appendChild(downSpan);
                }  
            }
            else {
                accionDiv.appendChild(equalSpan);
            }

            // Actualizar el valor de venta anterior
            previousVenta = favorito.venta;


            row.appendChild(monedaDiv);
            row.appendChild(fechaDiv);
            row.appendChild(compraDiv);
            row.appendChild(ventaDiv);
            row.appendChild(accionDiv);

            container.appendChild(row);
        });
    });
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

    // Llamar a la función para generar la tabla al cargar la página
    generarTabla();
};


