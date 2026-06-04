document.addEventListener('DOMContentLoaded', () => {

    const products = [
        { id: 1, name: "product1", price: 5.99 },
        { id: 2, name: "product2", price: 5 },
        { id: 3, name: "product3", price: 2.50 },
    ];

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const productsDisplay = document.getElementById('product-list');
    const cartItemsDisplay = document.getElementById('cart-items');
    const emptyMessage = document.getElementById('empty-cart');
    const cartTotal = document.getElementById('cart-total');
    const totalPriceDisplay = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-btn');

    // Display products
    products.forEach((product) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add("product");
        productDiv.innerHTML = `
            <span>${product.name} - Price: $${product.price.toFixed(2)}</span>
            <button data-id="${product.id}">Add to cart</button>
        `;
        productsDisplay.appendChild(productDiv);
    });

    // Add to cart button click
    productsDisplay.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const productId = parseInt(e.target.getAttribute("data-id"));
            const product = products.find(prod => prod.id === productId);
            if (product) {
                addToCart(product);
            }
        }
    });

    function addToCart(product) {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;         // already in cart, increase quantity
        } else {
            cart.push({ ...product, quantity: 1 }); // new item, start at 1
        }
        saveCart();
        renderCart();
    }

    function renderCart() {
        cartItemsDisplay.innerHTML = "";
        let totalPrice = 0;

        if (cart.length > 0) {
            emptyMessage.classList.add('hidden');
            cartTotal.classList.remove('hidden');

            cart.forEach((item) => {
                const cartDiv = document.createElement("div");
                cartDiv.classList.add("cartProduct");

                totalPrice += item.price * item.quantity;

                cartDiv.innerHTML = `
                    <span>${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</span>
                    <button data-id="${item.id}">Remove</button>
                `;
                cartItemsDisplay.appendChild(cartDiv);
            });

            totalPriceDisplay.textContent = totalPrice.toFixed(2); // updated once after loop

        } else {
            emptyMessage.classList.remove('hidden');
            cartTotal.classList.add('hidden');
        }
    }

    // Remove button click
    cartItemsDisplay.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const cartItemId = parseInt(e.target.getAttribute("data-id"));
            const product = products.find(prod => prod.id === cartItemId);
            if (product) {
                removeItem(product);
            }
        }
    });

    function removeItem(prod) {
        const index = cart.findIndex(item => item.id === prod.id);
        if (index !== -1) {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;  // reduce quantity by 1
            } else {
                cart.splice(index, 1);      // remove item completely
            }
            saveCart();
            renderCart();
        }
    }

    // Checkout
    checkoutButton.addEventListener('click', () => {
        alert("Checkout Completed");
        cart.length = 0;
        saveCart();
        renderCart();
    });

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    renderCart(); // render cart on page load (from localStorage)

});