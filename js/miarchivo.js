// Función para generar dinámicamente el contenido de la tabla
function generarTabla() {
  const container = document.getElementById("container-content");
  container.innerHTML = "";

  // Obtener los favoritos actuales del localStorage, agrupados por fecha
  const favoritosPorFecha = JSON.parse(localStorage.getItem("favoritos")) || {};

  // Recorrer el objeto favoritosPorFecha y generar las filas de la tabla
  Object.keys(favoritosPorFecha).forEach((fecha, index) => {
    const fechaHeader = document.createElement("div");
    fechaHeader.classList.add("fecha-header");
    fechaHeader.textContent = fecha;

    container.appendChild(fechaHeader);

    favoritosPorFecha[fecha].forEach((favorito) => {
      const row = document.createElement("div");
      row.classList.add("element");
      row.setAttribute("data-id", `favorito-${favorito.id}`);

      const monedaDiv = document.createElement("div");
      monedaDiv.classList.add("moneda");
      monedaDiv.textContent = favorito.moneda;

      const idDiv = document.createElement("div");
      idDiv.classList.add("id");
      idDiv.textContent = favorito.id;

      const compraDiv = document.createElement("div");
      compraDiv.classList.add("compra");
      compraDiv.textContent = `${favorito.compra}`;

      const ventaDiv = document.createElement("div");
      ventaDiv.classList.add("venta");
      ventaDiv.textContent = `${favorito.venta}`;

      const accionDiv = document.createElement("div");
      accionDiv.classList.add("accion");
      const deleteSpan = document.createElement("span");
      deleteSpan.classList.add("material-symbols-outlined");
      deleteSpan.textContent = "delete";

      // Agregar evento click al botón delete
      deleteSpan.addEventListener("click", () => {
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
  const favoritosPorFecha = JSON.parse(localStorage.getItem("favoritos")) || {};

  // Filtrar los favoritos para eliminar el favorito con el ID especificado de la fecha dada
  if (favoritosPorFecha[fecha]) {
    favoritosPorFecha[fecha] = favoritosPorFecha[fecha].filter(
      (favorito) => favorito.id !== id
    );

    // Si la fecha ya no tiene favoritos, eliminarla del objeto
    if (favoritosPorFecha[fecha].length === 0) {
      delete favoritosPorFecha[fecha];
    }

    // Guardar los nuevos favoritos en el localStorage
    localStorage.setItem("favoritos", JSON.stringify(favoritosPorFecha));
  }
}

function printTable() {
  // Abre una nueva ventana donde se va a ir a cargando dinamicamente la tabla, al estar cargada en divs, es necesario darle un formato de tabla
  var printWindow = window.open("", "", "height=600,width=800");

  // encabezado de la tabla
  var content = `
        <table>
            <thead>
                <tr>
                    <th>FECHA</th>
                    <th>MONEDA</th>
                   
                    <th>COMPRA</th>
                    <th>VENTA</th>
                </tr>
            </thead>
            <tbody>
    `;

  // Agregar las filas de datos dinámicamente
  document
    .querySelectorAll("#container-content .fecha-header") //selecciona todos los elementos con la clase fecha-header dentro del contenedor container-content
    .forEach((fechaHeader) => {
      const fecha = fechaHeader.textContent;
      content += `<tr><td colspan="5" style="font-weight:bold;">${fecha}</td></tr>`; //añade la fila

      let nextSibling = fechaHeader.nextElementSibling; //obtiene el siguiente elemento
      while (nextSibling && !nextSibling.classList.contains("fecha-header")) {
        //Continúa iterando mientras el siguiente hermano exista y no sea otro fecha-header
        if (nextSibling.classList.contains("element")) {
          //si tiene la clase element es una fila de datos nueva
          content += "<tr>";
          nextSibling.querySelectorAll("div:not(.accion)").forEach((cell) => {
            //excluye la clase accion para que no aparezca delete en la tabla
            content += `<td>${cell.innerHTML}</td>`;
          });
          content += "</tr>";
        }
        nextSibling = nextSibling.nextElementSibling;
      }
    });

  content += `
            </tbody>
        </table>
    `;

  // Se crea una nueva ventana donde se va a insertar el contenido creado arriba y que luego sera mandado a imprimir
  printWindow.document.write("<html><head><title>Cotizacion</title>");
  printWindow.document.write("<style>");
  printWindow.document.write(
    "table { width: 100%; border-collapse: collapse; }"
  );
  printWindow.document.write(
    "th, td { border: 1px solid black; padding: 8px; text-align: left; }"
  );
  printWindow.document.write("</style>");
  printWindow.document.write("</head><body>");
  printWindow.document.write(content);
  printWindow.document.write("</body></html>");

  // Cerrar el documento para que se procese el contenido
  printWindow.document.close();

  // Esperar a que todo se cargue y luego imprimir
  printWindow.onload = function () {
    printWindow.print();
    printWindow.close();
  };
}

// Llamar a la función para generar la tabla al cargar la página
window.onload = generarTabla;
