//variables
let totalMonto = 0;
let totalCapital = 0;
//formulario
document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const dni = document.getElementById("dni").value;
  const numCuenta = document.getElementById("numCuenta").value;
  const tipoCuenta = document.getElementById("tipoCuenta").value;
  const monto = parseFloat(document.getElementById("monto").value);
  const diasDeposito = parseInt(document.getElementById("diaDep").value);

  clearErrors();

  let hasError = false;

  if (nombre.length < 3) {
    setError("nombre", "El nombre debe tener al menos 3 caracteres.");
    hasError = true;
  }

  if (dni.length < 7) {
    setError("dni", "El DNI debe tener al menos 7 caracteres.");
    hasError = true;
  }

  if (numCuenta.length < 3) {
    setError(
      "numCuenta",
      "El número de cuenta debe tener al menos 3 caracteres."
    );
    hasError = true;
  }

  if (isNaN(monto) || monto <= 0) {
    setError("monto", "Ingrese un monto válido.");
    hasError = true;
  }

  if (parseInt(numCuenta) < 0) {
    setError("numCuenta", "El número de cuenta no puede ser negativo.");
    hasError = true;
  }

  if (isNaN(diasDeposito) || diasDeposito <= 0) {
    setError("diaDep", "Ingrese un número de días válido.");
    hasError = true;
  }

  if (tipoCuenta === "") {
    setError("tipoCuenta", "Seleccione un tipo de cuenta.");
    hasError = true;
  }

  if (hasError) {
    return;
  }

  let interes = 0;
  if (tipoCuenta === "fondo inversion") {
    if (diasDeposito < 90) {
      setError(
        "diaDep",
        "Los días de depósito para Fondos de Inversión deben ser al menos 90."
      );
      return;
    }
    interes = 0.09;
  } else {
    if (monto >= 100000) {
      interes = 0.08;
    } else if (monto >= 10000) {
      interes = 0.07;
    } else if (monto >= 1000) {
      interes = 0.06;
    }
  }

  const capitalFinal = monto + ((monto * interes) / 30) * diasDeposito;

  const cliente = {
    nombre,
    dni,
    numCuenta,
    tipoCuenta,
    monto,
    diasDeposito,
    capitalFinal,
  };
  localStorage.setItem(dni, JSON.stringify(cliente));

  if (hasError === false) {
    document.getElementById("successRegister").innerText =
      capitalFinal.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      });
    document.getElementById("successResult").style.display = "block";
  }
  // Clear form inputs
  document.getElementById("form");
});

document
  .getElementById("numCuenta")
  .addEventListener("keydown", function (event) {
    if (event.keyCode === 38 || event.keyCode === 40) {
      event.preventDefault();
    }
  });
document.getElementById("dni").addEventListener("keydown", function (event) {
  if (event.keyCode === 38 || event.keyCode === 40) {
    event.preventDefault();
  }
});
document.getElementById("monto").addEventListener("keydown", function (event) {
  if (event.keyCode === 38 || event.keyCode === 40) {
    event.preventDefault();
  }
});
document.getElementById("diaDep").addEventListener("keydown", function (event) {
  if (event.keyCode === 38 || event.keyCode === 40) {
    event.preventDefault();
  }
});

function setError(id, message) {
  const element = document.getElementById(id);
  element.classList.add("is-invalid");
  document.getElementById(`error${capitalize(id)}`).innerText = message;
}

function clearErrors() {
  const inputs = document.querySelectorAll(".form-control, .form-select");
  inputs.forEach((input) => {
    input.classList.remove("is-invalid");
  });

  const errorMessages = document.querySelectorAll(".invalid-feedback");
  errorMessages.forEach((errorMessage) => {
    errorMessage.innerText = "";
  });
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

document.getElementById("btnNuevo").addEventListener("click", function () {
  document.getElementById("form").reset();
  document.getElementById("successRegister").innerText = "";
  document.getElementById("successResult").style.display = "none";
});

//Listado Tabla
function cargarDatos() {
  totalMonto = 0; // Reiniciar el totalMonto
  totalCapital = 0; // Reiniciar el totalCapital

  const tablaClientes = document.getElementById("tablaClientes");
  tablaClientes.innerHTML = "";

  for (let i = 0; i < localStorage.length; i++) {
    const dni = localStorage.key(i);
    const cliente = JSON.parse(localStorage.getItem(dni));

    totalMonto += cliente.monto;
    totalCapital += cliente.capitalFinal;

    const fila = document.createElement("tr");
    fila.innerHTML = `
            <td class="text-center">${cliente.nombre}</td>
            <td class="text-center">${cliente.dni}</td>
            <td class="text-center">${cliente.numCuenta}</td>
            <td class="text-center">${cliente.tipoCuenta}</td>
            <td class="text-center">${cliente.monto.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}</td>
            <td class="text-center">${cliente.diasDeposito}</td>
            <td class="text-center">${cliente.capitalFinal.toLocaleString(
              "es-AR",
              {
                style: "currency",
                currency: "ARS",
              }
            )}</td>
            <td class="text-center">
                <button class="btn btn-warning btn-sm" onclick="editarCliente('${dni}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarCliente('${dni}')">Eliminar</button>
            </td>
        `;
    tablaClientes.appendChild(fila);
  }
  // Actualizar los totales en el DOM
  document.getElementById("totalMonto").innerText = totalMonto.toLocaleString(
    "es-AR",
    {
      style: "currency",
      currency: "ARS",
    }
  );

  document.getElementById("totalCapital").innerText =
    totalCapital.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });
}

function editarCliente(dni) {
  window.location.href = `ClienteBanco.html?dni=${dni}`;
}

function eliminarCliente(dni) {
  const cliente = JSON.parse(localStorage.getItem(dni));

  totalMonto -= cliente.monto;
  totalCapital -= cliente.capitalFinal;

  localStorage.removeItem(dni);
  cargarDatos();
  console.log("Eliminar cliente:", dni);
}

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const dniCliente = params.get("dni");

  if (dniCliente) {
    const cliente = JSON.parse(localStorage.getItem(dniCliente));

    if (cliente) {
      document.getElementById("nombre").value = cliente.nombre;
      document.getElementById("dni").value = cliente.dni;
      document.getElementById("numCuenta").value = cliente.numCuenta;
      document.getElementById("tipoCuenta").value = cliente.tipoCuenta;
      document.getElementById("monto").value = cliente.monto;
      document.getElementById("diaDep").value = cliente.diasDeposito;
    }
  }

  const formulario = document.getElementById("form");

  formulario.addEventListener("submit", (event) => {
    cargarDatos();
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const dni = document.getElementById("dni").value;
    const numCuenta = document.getElementById("numCuenta").value;
    const tipoCuenta = document.getElementById("tipoCuenta").value;
    const monto = parseFloat(document.getElementById("monto").value);
    const diasDeposito = parseInt(document.getElementById("diaDep").value);

    const cliente = {
      nombre,
      dni,
      numCuenta,
      tipoCuenta,
      monto,
      diasDeposito,
    };

    localStorage.setItem(dni, JSON.stringify(cliente));
    document.getElementById("successRegister").innerText =
      cliente.monto.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      });
    document.getElementById("successResult").style.display = "block";
    formulario.reset();
  });
});
