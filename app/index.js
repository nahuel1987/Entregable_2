let cart = {};

// Función para obtener los cócteles desde The Cocktail DB
async function fetchCocktails() {
    try {
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita');
        if (!response.ok) {
            throw new Error('Error en la solicitud de cócteles');
        }
        const data = await response.json();
        const cocktails = data.drinks;

        if (!cocktails) {
            throw new Error('No se encontraron cócteles');
        }

        displayProducts(cocktails);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
        });
    }
}

// Función para mostrar los productos (cócteles) en el HTML
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Limpiamos la lista antes de cargar los productos

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';

        const productTitle = document.createElement('h2');
        productTitle.textContent = product.strDrink;

        // Añadimos evento para mostrar alerta con detalles al hacer clic en el título
        productTitle.addEventListener('click', () => {
            Swal.fire({
                title: product.strDrink,
                text: `Categoría: ${product.strCategory}\nInstrucciones: ${product.strInstructions}`,
                imageUrl: product.strDrinkThumb,
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: 'Imagen del cóctel',
            });
        });

        const productImage = document.createElement('img');
        productImage.src = product.strDrinkThumb;
        productImage.alt = product.strDrink;
        productImage.className = 'cocktail-img';

        const productPrice = document.createElement('p');
        // Simulamos un precio aleatorio para los cócteles
        const price = (Math.random() * 10 + 5).toFixed(2);
        productPrice.textContent = `Precio: $${price}`;

        const addButton = document.createElement('button');
        addButton.textContent = 'Agregar al carrito';
        addButton.onclick = () => addToCart(product.strDrink, parseFloat(price));

        productDiv.appendChild(productTitle);
        productDiv.appendChild(productImage);
        productDiv.appendChild(productPrice);
        productDiv.appendChild(addButton);

        productList.appendChild(productDiv);
    });
}

// Función para agregar productos al carrito
function addToCart(product, price) {
    if (cart[product]) {
        cart[product].quantity++;
    } else {
        cart[product] = { price: price, quantity: 1 };
    }
    saveCartToLocalStorage();
    updateCart();
}

// Función para actualizar la vista del carrito
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    cartItems.innerHTML = '';
    let totalPrice = 0;

    // Si el carrito está vacío, mostramos un mensaje
    if (Object.keys(cart).length === 0) {
        const emptyMessage = document.createElement('tr');
        emptyMessage.innerHTML = '<td colspan="4">El carrito está vacío</td>';
        cartItems.appendChild(emptyMessage);
    } else {
        for (const product in cart) {
            const item = cart[product];
            const row = document.createElement('tr');

            const productCell = document.createElement('td');
            productCell.textContent = product;

            const quantityCell = document.createElement('td');
            quantityCell.textContent = item.quantity;

            const priceCell = document.createElement('td');
            priceCell.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

            // Celda de acción con el botón de eliminar
            const actionCell = document.createElement('td');
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Eliminar';
            removeButton.onclick = () => removeFromCart(product);

            actionCell.appendChild(removeButton);

            row.appendChild(productCell);
            row.appendChild(quantityCell);
            row.appendChild(priceCell);
            row.appendChild(actionCell);

            cartItems.appendChild(row);

            totalPrice += item.price * item.quantity;
        }
    }

    totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Función para eliminar productos individuales del carrito
function removeFromCart(product) {
    delete cart[product];
    saveCartToLocalStorage();
    updateCart();
}

// Función para vaciar todo el carrito
function clearCart() {
    cart = {};
    saveCartToLocalStorage();
    updateCart();
}

// Evento para vaciar el carrito
document.getElementById('clear-cart').addEventListener('click', () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Vas a vaciar todo el carrito.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            clearCart();
            Swal.fire(
                'Carrito vacío',
                'Tu carrito ha sido vaciado.',
                'success'
            );
        }
    });
});

// Función para guardar el carrito en LocalStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para cargar el carrito desde LocalStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCart();
    }
}

// Evento para procesar la compra al hacer clic en el botón "Comprar"
document.getElementById('purchase-button').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (!name || !email) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingresa tu nombre y correo electrónico antes de proceder.',
        });
    } else if (Object.keys(cart).length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Carrito vacío',
            text: 'No puedes realizar una compra con el carrito vacío.',
        });
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Compra realizada',
            text: `Gracias, ${name}. Tu compra ha sido procesada correctamente.`,
        });

        // Limpiar carrito después de la compra
        clearCart();
    }
});

// Cargar el carrito y los productos al cargar la página
window.addEventListener('load', () => {
    loadCartFromLocalStorage();
    fetchCocktails();
});
