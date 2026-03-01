/**
 * Premium Amazon Clone Script
 * Handles dynamic product loading, filtering, and cart logic.
 */

const products = [
    // Groceries
    {
        id: 'g1',
        title: 'Premium Organic Fresh Apples (1 kg)',
        price: 4.99,
        shipping: 2.50,
        category: 'groceries',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?q=80&w=600&auto=format&fit=crop',
        rating: 4.5,
        reviews: 342,
        badge: 'Best Seller'
    },
    {
        id: 'g2',
        title: 'Whole Wheat Artisan Bread, Freshly Baked',
        price: 3.49,
        shipping: 0,
        category: 'groceries',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
        rating: 4.8,
        reviews: 890,
        badge: 'Amazon\'s Choice'
    },
    {
        id: 'g3',
        title: 'Organic Extra Virgin Olive Oil, 500ml',
        price: 12.99,
        shipping: 1.50,
        category: 'groceries',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600&auto=format&fit=crop',
        rating: 4.7,
        reviews: 215,
        badge: null
    },
    // Furniture
    {
        id: 'f1',
        title: 'Modern Ergonomic Office Chair with Lumbar Support',
        price: 149.99,
        shipping: 15.00,
        category: 'furniture',
        image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=600&auto=format&fit=crop',
        rating: 4.6,
        reviews: 1240,
        badge: 'Top Rated'
    },
    {
        id: 'f2',
        title: 'Minimalist Wooden Dining Table (Seats 6)',
        price: 399.00,
        shipping: 45.00,
        category: 'furniture',
        image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=600&auto=format&fit=crop',
        rating: 4.4,
        reviews: 89,
        badge: null
    },
    {
        id: 'f3',
        title: 'Cozy Mid-Century Modern Sofa, Grey',
        price: 599.50,
        shipping: 50.00,
        category: 'furniture',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop',
        rating: 4.9,
        reviews: 56,
        badge: 'New Arrival'
    },
    // Things (Electronics / General)
    {
        id: 't1',
        title: 'Noise Cancelling Wireless Over-Ear Headphones',
        price: 299.99,
        shipping: 0,
        category: 'things',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
        rating: 4.8,
        reviews: 4500,
        badge: 'Amazon\'s Choice'
    },
    {
        id: 't2',
        title: 'Smart Fitness Watch with Heart Rate Monitor',
        price: 199.95,
        shipping: 5.00,
        category: 'things',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
        rating: 4.3,
        reviews: 2100,
        badge: null
    },
    {
        id: 't3',
        title: 'Premium Ceramic Coffee Mug',
        price: 15.00,
        shipping: 2.00,
        category: 'things',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop',
        rating: 4.6,
        reviews: 400,
        badge: null
    }
];

// Cart State
let cart = [];

// DOM Elements
const productsContainer = document.getElementById('products-container');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartCountDisplay = document.getElementById('cart-count');
const itemsTotalDisplay = document.getElementById('items-total');
const shippingTotalDisplay = document.getElementById('shipping-total');
const grandTotalDisplay = document.getElementById('grand-total');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Render initial all products
    renderProducts('all');

    // Add event listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            e.target.classList.add('active');
            // Render filtered
            renderProducts(e.target.dataset.filter);
        });
    });

    // Cart Sidebar Toggle
    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
});

// Render Products function
function renderProducts(filter) {
    productsContainer.innerHTML = '';

    let filteredProducts = products;
    if (filter !== 'all') {
        filteredProducts = products.filter(p => p.category === filter);
    }

    filteredProducts.forEach(product => {
        // Parse price into dollars and cents for Amazon UI styling
        const [dollars, cents] = product.price.toFixed(2).split('.');

        // Generate stars based on rating
        const fullStars = Math.floor(product.rating);
        const halfStar = product.rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fa-solid fa-star"></i>';
        if (halfStar) starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
        for (let i = 0; i < emptyStars; i++) starsHTML += '<i class="fa-regular fa-star"></i>';

        const shippingHtml = product.shipping === 0
            ? '<span class="free">FREE delivery</span>'
            : `+ $${product.shipping.toFixed(2)} delivery`;

        const badgeHtml = product.badge
            ? `<div class="product-badge">${product.badge}</div>`
            : '';

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${badgeHtml}
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image">
            </div>
            <h3 class="product-title">${product.title}</h3>
            <div class="product-rating">
                ${starsHTML} <span class="rating-count">(${product.reviews})</span>
            </div>
            <div class="product-price-block">
                <div class="product-price">
                    <span class="price-symbol">$</span>
                    <span class="price-dollars">${dollars}</span>
                    <span class="price-fraction">${cents}</span>
                </div>
                <div class="product-shipping">
                    ${shippingHtml}
                </div>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">Add to Cart</button>
        `;
        productsContainer.appendChild(card);
    });
}

// Add to Cart Function
window.addToCart = function (productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();

    // Quick visual feedback on the button could go here

    // Automatically open cart sidebar to show user it was added
    if (!cartSidebar.classList.contains('active')) {
        toggleCart();
    }
};

// Update Cart Quantity
window.updateQuantity = function (productId, change) {
    const item = cart.find(p => p.id === productId);
    if (!item) return;

    item.quantity += change;

    // If quantity goes to 0 or below, remove item
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
    }
};

// Remove from Cart
window.removeFromCart = function (productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
};

// Toggle Cart Sidebar
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

// Update DOM elements related to cart
function updateCartUI() {
    // Top nav count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountDisplay.textContent = totalItems;

    // Inside sidebar rendering
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your Amazon Cart is empty.</p>';
        itemsTotalDisplay.textContent = '$0.00';
        shippingTotalDisplay.textContent = '$0.00';
        grandTotalDisplay.textContent = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = '';

    let itemsSubtotal = 0;
    let shippingSubtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const itemShipping = item.shipping * item.quantity;

        itemsSubtotal += itemTotal;
        shippingSubtotal += itemShipping;

        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="product-shipping" style="margin-bottom: 8px;">
                    ${item.shipping === 0 ? '<span class="free">Free shipping</span>' : '+$' + item.shipping.toFixed(2) + ' shipping'}
                </div>
                <div class="cart-item-actions">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                    <span style="color:#ddd">|</span>
                    <button class="remove-item-btn" onclick="removeFromCart('${item.id}')">Delete</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });

    // Update totals
    const grandTotal = itemsSubtotal + shippingSubtotal;

    itemsTotalDisplay.textContent = `$${itemsSubtotal.toFixed(2)}`;
    shippingTotalDisplay.textContent = `$${shippingSubtotal.toFixed(2)}`;
    grandTotalDisplay.textContent = `$${grandTotal.toFixed(2)}`;
}
