// Función para generar dinámicamente el contenido de la tabla
function generarTabla() {
    const container = document.getElementById('container-content');
    container.innerHTML = '';

    // Obtener los favoritos actuales del localStorage, agrupados por fecha
    const favoritosPorFecha = JSON.parse(localStorage.getItem('favoritos')) || {};

    // Recorrer el objeto favoritosPorFecha y generar las filas de la tabla
    Object.keys(favoritosPorFecha).forEach((fecha, index) => {
        const fechaHeader = document.createElement('div');
        fechaHeader.classList.add('fecha-header');
        fechaHeader.textContent = fecha;

        container.appendChild(fechaHeader);

        favoritosPorFecha[fecha].forEach(favorito => {
            const row = document.createElement('div');
            row.classList.add('element');
            row.setAttribute('data-id', `favorito-${favorito.id}`);

            const monedaDiv = document.createElement('div');
            monedaDiv.classList.add('moneda');
            monedaDiv.textContent = favorito.moneda;

            const idDiv = document.createElement('div');
            idDiv.classList.add('id');
            idDiv.textContent = favorito.id;

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

            // Agregar evento click al botón delete
            deleteSpan.addEventListener('click', () => {
                // Eliminar el favorito del localStorage
                eliminarFavorito(fecha, favorito.id);
                // Eliminar la fila de la tabla HTML
                container.removeChild(row);
            });

            accionDiv.appendChild(deleteSpan);

            row.appendChild(monedaDiv);
            row.appendChild(idDiv); // Aquí se añade el ID debajo de la columna de moneda
            row.appendChild(compraDiv);
            row.appendChild(ventaDiv);
            row.appendChild(accionDiv);

            container.appendChild(row);
        });
    });
}

// Función para eliminar un favorito del localStorage
function eliminarFavorito(fecha, id) {
    // Obtener los favoritos actuales del localStorage, agrupados por fecha
    const favoritosPorFecha = JSON.parse(localStorage.getItem('favoritos')) || {};

    // Filtrar los favoritos para eliminar el favorito con el ID especificado de la fecha dada
    if (favoritosPorFecha[fecha]) {
        favoritosPorFecha[fecha] = favoritosPorFecha[fecha].filter(favorito => favorito.id !== id);

        // Si la fecha ya no tiene favoritos, eliminarla del objeto
        if (favoritosPorFecha[fecha].length === 0) {
            delete favoritosPorFecha[fecha];
        }

        // Guardar los nuevos favoritos en el localStorage
        localStorage.setItem('favoritos', JSON.stringify(favoritosPorFecha));
    }
}

// Llamar a la función para generar la tabla al cargar la página
window.onload = generarTabla;