// Arrays de productos
const productos = [
    { 
        titulo: "Zapatilla Topper", 
        descripcion: "Zapatillas para Trail Running Terrex Agravic Speed", 
        imagen: "./assets/Zapatilla_azul.jpg", 
        precio: "180.000" 
    },
    { 
        titulo: "Zapatilla Adidas", 
        descripcion: "Zapatillas Own the Game 3", 
        imagen: "./assets/Zapatilla_marron.jpg", 
        precio: "200.000" 
    },
    { 
        titulo: "Zapatilla Armour", 
        descripcion: "Zapatillas de Running Supernova Rise", 
        imagen: "./assets/Zapatilla_negra.jpg", 
        precio: "250.000" 
    }
    
];

// Selecciona el contenedor donde se agregarán las tarjetas
const container = document.querySelector('.container');
const cartItemsList = document.querySelector('.cart-items');
const totalPriceElement = document.querySelector('.total-price');
const btnFinalizarCompra = document.getElementById('finalizar-compra');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('close-popup');

// Arrays para almacenar los productos en el carrito
let carrito = [];

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
        producto.cantidad = 1; // Agregar la cantidad por defecto
        carrito.push(producto);
    }

   
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
    guardarCarrito();
    actualizarCarrito(); // Actualizar la vista del carrito
    
}

// Función para actualizar la vista del carrito
function actualizarCarrito() {
    // Limpiar la lista actual del carrito
    cartItemsList.innerHTML = '';

    // Agregar los productos del carrito a la lista
    let total = 0;
    carrito.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = `${producto.titulo} - $${(parseFloat(producto.precio) * producto.cantidad).toFixed(3)} (Cantidad: ${producto.cantidad})`;
        
        // Crear el botón "menos" para reducir la cantidad
        const btnMenos = document.createElement('button');
        btnMenos.textContent = '-';
        btnMenos.addEventListener('click', () => reducirCantidad(producto));

        // Crear el botón "más" para agregar más cantidad
        const btnMas = document.createElement('button');
        btnMas.textContent = '+';
        btnMas.addEventListener('click', () => agregarAlCarrito(producto));

         // Añadir los botones a la lista de carrito
         li.appendChild(btnMenos);
         li.appendChild(btnMas);
         cartItemsList.appendChild(li);
         total += parseFloat(producto.precio) * producto.cantidad;  // Sumar el total de cada producto según su cantidad
     });

    // Actualizar el precio total
    totalPriceElement.textContent = `Total: $${total.toFixed(3)}`;
}


// Crear y agregar cada tarjeta a partir del Array de productos
productos.forEach(producto => crearTarjeta(producto));


// Mostrar el popup al finalizar compra
btnFinalizarCompra.addEventListener('click', function() {
    carrito = [];  // Vaciar el carrito
    localStorage.removeItem('carrito');  // Eliminar el carrito de localStorage
    actualizarCarrito();  // Actualizar la vista del carrito
    popup.style.display = 'flex';  // Mostrar el popup
});

// Cerrar el popup cuando se hace clic en el botón de cerrar
closePopup.addEventListener('click', function() {
    popup.style.display = 'none';  // Ocultar el popup
         setTimeout(function() {
        location.reload();  // Recarga la página
    }, 800);  // Espera segundos antes de recargar
});
// Cargar el carrito cuando la página se carga
cargarCarrito();

