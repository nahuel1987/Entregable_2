// Función para mostrar/ocultar el carrito
function toggleCart() {
    const cartDropdown = document.getElementById('cart-dropdown');
    cartDropdown.classList.toggle('active');
}


// Lista de productos
const products = [
    { id: 1, name: "Aperol Spritz", price: 25.00, image: "./assets/aperol_spritz.jpg"},
    { id: 2, name: 'Gin Tonic', price: 20.00, image: "./assets/gin_tonic.jpg" },
    { id: 3, name: 'Champagne', price: 15.00, image: "./assets/champagne.webp" }
];

// Carrito de compras (vacío al inicio)
let cart = [];

// Función para renderizar los productos
function renderProducts() {
    const productList = document.getElementById('product-list');
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>Precio: $${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Agregar al carrito</button>
            <img src="${product.image}" alt="Esta es una descripcion alternativa de la imagen para cuando no se pueda mostrar" width="480" height="380">
           
            `;
        productList.appendChild(productDiv);
    });
}

// Función para agregar un producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    const existingProduct = cart.find(item => item.product.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ product, quantity: 1 });
    }
    
    renderCart();
}

// Función para renderizar el carrito
function renderCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';  // Limpiar el contenido anterior
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <img src="${item.product.image}" alt="Esta es una descripcion alternativa de la imagen para cuando no se pueda mostrar" width="50" height="50">
            <p>${item.product.name} (x${item.quantity}) - $${(item.product.price * item.quantity).toFixed(2)}</p>
            <button onclick="removeFromCart(${item.product.id})">Eliminar</button>
        `;
        cartItemsDiv.appendChild(cartItemDiv);
        total += item.product.price * item.quantity;
    });
    
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    renderCart();
}

// Inicializar la tienda al cargar la página
window.onload = () => {
    renderProducts();
};