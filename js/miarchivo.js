// Datos de cotizaciones favoritas almacenadas en localStorage
const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

// Función para generar dinámicamente el contenido de la tabla
function generarTabla() {
    const container = document.getElementById('container-content');
    container.innerHTML = '';

    favoritos.forEach((favorito, index) => {
        const row = document.createElement('div');
        row.classList.add('element');
        row.setAttribute('data-id', `favorito-${index}`);

        const fechaDiv = document.createElement('div');
        fechaDiv.classList.add('dia');
        fechaDiv.textContent = favorito.dia;

        const monedaDiv = document.createElement('div');
        monedaDiv.classList.add('id');
        monedaDiv.textContent = favorito.id;

        const compraDiv = document.createElement('div');
        compraDiv.classList.add('compra');
        compraDiv.textContent = `${favorito.compra}`;

        const ventaDiv = document.createElement('div');
        ventaDiv.classList.add('venta');
        ventaDiv.textContent = `${favorito.venta}`;

        const accionDiv = document.createElement('div');
        accionDiv.classList.add('accion');
        const deleteSpan = document.createElement('span');
        deleteSpan.classList.add('material-symbols-outlined');
        deleteSpan.textContent = 'delete';
        accionDiv.appendChild(deleteSpan);

        row.appendChild(fechaDiv);
        row.appendChild(monedaDiv);
        row.appendChild(compraDiv);
        row.appendChild(ventaDiv);
        row.appendChild(accionDiv);

        container.appendChild(row);
    });
}

// Llamar a la función para generar la tabla al cargar la página
window.onload = generarTabla;