// Arrays para almacenar
let productos = [];
let carrito = [];

// Función para cargar los productos desde un archivo JSON
async function cargarProductos() {
    try {
        const response = await fetch('./productos.json'); // Ruta del archivo JSON
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        productos = await response.json(); // Asignar datos a la variable productos
        productos.forEach(producto => crearTarjeta(producto)); // Crear las tarjetas
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}


// Llamar a la función para crear el carrito al cargar la página
function crearCarrito() {
    // Crear el contenedor principal del carrito
    const cart = document.createElement('div');
    cart.classList.add('cart');

    // Crear el título del carrito
    const titulo = document.createElement('h2');
    titulo.textContent = 'Carrito de Compras';

    // Crear la lista de items del carrito
    const cartItems = document.createElement('ul');
    cartItems.classList.add('cart-items');

    // Crear el elemento del precio total
    const totalPrice = document.createElement('p');
    totalPrice.classList.add('total-price');
    totalPrice.textContent = 'Total: $0.00';

    // Crear el botón de finalizar compra
    const checkoutButton = document.createElement('button');
    checkoutButton.classList.add('checkout-button');
    checkoutButton.id = 'finalizar-compra';
    checkoutButton.textContent = 'Finalizar Compra';

    // Añadir los elementos al contenedor del carrito
    cart.appendChild(titulo);
    cart.appendChild(cartItems);
    cart.appendChild(totalPrice);
    cart.appendChild(checkoutButton);

    // Agregar el carrito al cuerpo del documento o a un contenedor específico
    document.body.appendChild(cart);

        // Agregar el evento al botón de finalizar compra
        checkoutButton.addEventListener('click', function() {
            // Aquí puedes colocar la lógica que quieras al hacer clic en finalizar compra
            // Ejemplo: Vaciar el carrito, mostrar un mensaje o redirigir a una página
    
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Compra finalizada con éxito!",
                showConfirmButton: false,
                timer: 1500
            });
    
            // Lógica para vaciar el carrito y actualizar la interfaz
            carrito = [];  // Vaciar el carrito
            localStorage.removeItem('carrito');  // Eliminar el carrito de localStorage
            actualizarCarrito();  // Actualizar la vista del carrito
        });
    }

// Llamar a la función para crear el carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    crearCarrito();  // Crear el carrito de compras
});


// Selecciona el contenedor donde se agregarán las tarjetas
const container = document.querySelector('.container');

// Función para crear una tarjeta
function crearTarjeta(producto) {
    // Crear el elemento de la tarjeta
    const card = document.createElement('div');
    card.classList.add('card');

    // Crear la imagen de la tarjeta
    const img = document.createElement('img');
    img.src = producto.imagen;
    img.alt = producto.titulo;

    // Crear el contenedor de contenido
    const content = document.createElement('div');
    content.classList.add('card-content');

    // Crear el título
    const title = document.createElement('h2');
    title.textContent = producto.titulo;

    // Crear la descripción
    const description = document.createElement('p');
    description.textContent = producto.descripcion;

    // Crear el precio
    const price = document.createElement('p');
    price.classList.add('price');
    //price.textContent = producto.precio;
    price.textContent = `$${parseFloat(producto.precio).toFixed(3)}`;

     // Crear el botón
    const button = document.createElement('button');
    button.classList.add('card-button');
    button.textContent = "Comprar ahora";

    // Añadir evento de click al botón
    button.addEventListener('click', () => agregarAlCarrito(producto));

    // Agregar los elementos al contenedor de contenido
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(price);
    content.appendChild(button); 

    // Agregar la imagen y el contenido a la tarjeta
    card.appendChild(img);
    card.appendChild(content);

    // Agregar la tarjeta al contenedor principal
    container.appendChild(card);
}
// Función para cargar el carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    actualizarCarrito();
}
// Función para guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}
function agregarAlCarrito(producto) {
    // Buscar si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.titulo === producto.titulo);

    if (productoExistente) {
        // Si el producto ya existe, incrementar la cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si el producto no existe, agregarlo al carrito con cantidad 1
        producto.cantidad = 1; 
        carrito.push(producto);
    }
 
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Nuevo producto en el Carrito",
        showConfirmButton: false,
        timer: 1500
      });
    guardarCarrito();  // Guardar el carrito actualizado en localStorage
    actualizarCarrito(); // Actualizar la vista del carrito

}
// Función para reducir la cantidad de un producto en el carrito
function reducirCantidad(producto) {
    const productoExistente = carrito.find(item => item.titulo === producto.titulo);

    if (productoExistente) {
        // Reducir la cantidad si es mayor a 1
        if (productoExistente.cantidad > 1) {
            productoExistente.cantidad -= 1;
        } else {
            // Si la cantidad es 1, eliminar el producto
            carrito = carrito.filter(item => item.titulo !== producto.titulo);
        }
    }
    Swal.fire({
        icon: "error",
        title: "Producto eliminado",
        text: "Usted a eliminado un producto del carrito",
        
      });
    guardarCarrito();
    actualizarCarrito(); // Actualizar la vista del carrito
    
}

// Función para actualizar la vista del carrito
function actualizarCarrito() {
  // Limpiar la lista actual del carrito
  const cartItemsList = document.querySelector('.cart-items');
  if (!cartItemsList) return; // Si no existe la lista, no hacemos nada

  cartItemsList.innerHTML = '';  // Limpiar los elementos actuales

  let total = 0;

  carrito.forEach(producto => {
      const li = document.createElement('li');
      li.textContent = `${producto.titulo} - $${(parseFloat(producto.precio)).toFixed(3)} (Cantidad: ${producto.cantidad})`;

      // Crear el botón "menos" para reducir la cantidad
      const btnMenos = document.createElement('button');
      btnMenos.textContent = '-';
      btnMenos.classList.add('btn-menos');
      btnMenos.addEventListener('click', () => reducirCantidad(producto));

      // Crear el botón "más" para agregar más cantidad
      const btnMas = document.createElement('button');
      btnMas.textContent = '+';
      btnMas.classList.add('btn-mas');
      btnMas.addEventListener('click', () => agregarAlCarrito(producto));

      li.prepend(btnMenos); // Agregar el botón "menos" al inicio
      li.appendChild(btnMas); // Agregar el botón "más" al final

      cartItemsList.appendChild(li); // Agregar el producto a la lista

      total += parseFloat(producto.precio) * producto.cantidad; // Calcular el total
  });

  // Actualizar el precio total
  const totalPriceElement = document.querySelector('.total-price');
  if (totalPriceElement) {
      totalPriceElement.textContent = `Total: $${total.toFixed(3)}`;
  }
}

// Llamar a cargarProductos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarCarrito();
});




