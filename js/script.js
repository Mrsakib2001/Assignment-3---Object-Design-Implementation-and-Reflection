// Sample product data with placeholder images
const products = [
    {
        id: 1,
        name: 'Gaming Laptop Pro',
        category: 'computers',
        price: 1299.99,
        icon: '💻',
        stock: 15,
        image: 'images/gaminglaptoppro.webp',
        description: 'High-performance gaming laptop with RTX graphics and Intel Core i7 processor.'
    },
    {
        id: 2,
        name: 'Wireless Headphones',
        category: 'audio',
        price: 199.99,
        icon: '🎧',
        stock: 32,
        image: 'images/wirelessheadphones',
        description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.'
    },
    {
        id: 3,
        name: 'Smartphone X',
        category: 'phones',
        price: 899.99,
        icon: '📱',
        stock: 0,
        image: 'images/smartphonex',
        description: 'Latest flagship smartphone with advanced camera system and 5G connectivity.'
    },
    {
        id: 4,
        name: 'Gaming Console',
        category: 'gaming',
        price: 549.99,
        icon: '🎮',
        stock: 8,
        image: 'images/gamingconsole',
        description: 'Next-generation gaming console with 4K gaming and ultra-fast SSD.'
    },
    {
        id: 5,
        name: '4K Monitor',
        category: 'computers',
        price: 449.99,
        icon: '🖥️',
        stock: 12,
        image: 'images/4kmonitor',
        description: '32-inch 4K monitor with HDR support and ergonomic design.'
    },
    {
        id: 6,
        name: 'Bluetooth Speaker',
        category: 'audio',
        price: 79.99,
        icon: '🔊',
        stock: 45,
        image: 'images/bluetoothspeaker',
        description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design.'
    },
    {
        id: 7,
        name: 'Tablet Pro',
        category: 'computers',
        price: 699.99,
        icon: '📱',
        stock: 20,
        image: 'images/tabletpro',
        description: 'Professional tablet with stylus support and all-day battery life.'
    },
    {
        id: 8,
        name: 'Gaming Mouse',
        category: 'gaming',
        price: 89.99,
        icon: '🖱️',
        stock: 50,
        image: 'images/gamingmouse',
        description: 'RGB gaming mouse with customizable buttons and high-precision sensor.'
    },
    {
        id: 9,
        name: 'Smart Watch',
        category: 'phones',
        price: 299.99,
        icon: '⌚',
        stock: 18,
        image: 'images/smartwatch',
        description: 'Advanced smartwatch with health monitoring and GPS tracking.'
    },
    {
        id: 10,
        name: 'Mechanical Keyboard',
        category: 'gaming',
        price: 149.99,
        icon: '⌨️',
        stock: 25,
        image: 'images/mechanicalkeyboard',
        description: 'Mechanical gaming keyboard with RGB backlighting and tactile switches.'
    },
    {
        id: 11,
        name: 'Noise Cancelling Earbuds',
        category: 'audio',
        price: 249.99,
        icon: '🎵',
        stock: 30,
        image: 'images/noisecancellingheadphones',
        description: 'Premium earbuds with active noise cancellation and wireless charging case.'
    },
    {
        id: 12,
        name: 'External SSD 1TB',
        category: 'computers',
        price: 179.99,
        icon: '💾',
        stock: 40,
        image: 'images/externalssd1tb',
        description: 'High-speed external SSD with USB-C connectivity and compact design.'
    }
];

// State management
let cart = [];
let currentUser = null;
let orders = [];
let isRegisterMode = false;

// Admin credentials
const ADMIN_CREDENTIALS = {
    email: 'admin@awe.com',
    password: 'admin123'
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadProducts('all');
    updateCartUI();
    checkLoginStatus();

    // Add backup event listeners for navigation buttons
    addNavigationListeners();

    // Add some sample orders for demonstration
    if (orders.length === 0) {
        orders.push(
            {
                id: 'ORD' + (Date.now() - 86400000), // Yesterday
                date: new Date(Date.now() - 86400000).toLocaleDateString(),
                items: [
                    { ...products[0], quantity: 1 }, // Gaming Laptop
                    { ...products[7], quantity: 2 }  // Gaming Mouse
                ],
                total: products[0].price + (products[7].price * 2),
                status: 'delivered',
                customer: 'john.doe@email.com'
            },
            {
                id: 'ORD' + (Date.now() - 43200000), // 12 hours ago
                date: new Date(Date.now() - 43200000).toLocaleDateString(),
                items: [
                    { ...products[1], quantity: 1 }, // Wireless Headphones
                    { ...products[5], quantity: 1 }  // Bluetooth Speaker
                ],
                total: products[1].price + products[5].price,
                status: 'shipped',
                customer: 'jane.smith@email.com'
            },
            {
                id: 'ORD' + (Date.now() - 3600000), // 1 hour ago
                date: new Date().toLocaleDateString(),
                items: [
                    { ...products[4], quantity: 1 }, // 4K Monitor
                    { ...products[9], quantity: 1 }  // Mechanical Keyboard
                ],
                total: products[4].price + products[9].price,
                status: 'processing',
                customer: 'mike.johnson@email.com'
            }
        );
    }
});

// Add backup navigation event listeners
function addNavigationListeners() {
    // Find all navigation links and add click handlers
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const text = link.textContent.trim().toLowerCase();
        link.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Navigation clicked:', text);

            switch (text) {
                case 'home':
                    showHome();
                    break;
                case 'products':
                    goToProducts();
                    break;
                case 'my orders':
                    showOrders();
                    break;
                case 'admin':
                    showAdmin();
                    break;
            }
        });
    });

    // Shop Now button
    const shopNowBtn = document.querySelector('.hero .btn-primary');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Shop Now clicked');
            goToProducts();
        });
    }
}

// NEW: Go to Products function - This was missing!
function goToProducts() {
    console.log('goToProducts called');

    // Ensure we're showing the home page first
    showHome();

    // Wait a moment for the page to load, then scroll to products
    setTimeout(() => {
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Clear any active search to show all products
            const searchInput = document.getElementById('searchInput');
            if (searchInput && searchInput.value.trim() !== '') {
                searchInput.value = '';
                loadProducts('all');

                // Reset filter buttons
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector('.filter-btn').classList.add('active');

                // Reset section header
                const sectionHeader = document.querySelector('.section-header h2');
                if (sectionHeader) {
                    sectionHeader.textContent = 'Featured Products';
                }
            }

            console.log('Scrolled to products section');
        }
    }, 100);
}

// Search functionality
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        loadProducts('all');
        return;
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );

    displayFilteredProducts(filteredProducts, `Search results for "${searchTerm}"`);
}

function handleSearchEnter(event) {
    if (event.key === 'Enter') {
        searchProducts();
    }
}

function displayFilteredProducts(filteredProducts, headerText) {
    const grid = document.getElementById('productsGrid');
    const sectionHeader = document.querySelector('.section-header h2');

    // Update header
    sectionHeader.textContent = headerText;

    if (filteredProducts.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-light);"><h3>No products found</h3><p>Try adjusting your search terms</p></div>';
        return;
    }

    grid.innerHTML = filteredProducts.map(product => `
                <div class="product-card fade-in">
                    <div class="product-image loading" data-product-id="${product.id}">
                        <div class="placeholder">${product.icon}</div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-category">${product.category}</p>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                        <div class="product-actions">
                            ${product.stock > 0
            ? `<button class="btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>`
            : `<button class="btn-add-cart" disabled style="background: #ccc;">Out of Stock</button>`
        }
                            <button class="btn-view" onclick="viewProduct(${product.id})">View</button>
                        </div>
                    </div>
                </div>
            `).join('');

    // Load images for filtered products
    filteredProducts.forEach(async (product) => {
        if (product.image) {
            const imageContainer = document.querySelector(`[data-product-id="${product.id}"]`);
            const img = await loadImage(product.image, product.icon);

            imageContainer.classList.remove('loading');

            if (img) {
                const placeholder = imageContainer.querySelector('.placeholder');
                placeholder.style.display = 'none';

                img.alt = product.name;
                img.style.opacity = '0';
                imageContainer.appendChild(img);

                setTimeout(() => {
                    img.style.opacity = '1';
                }, 100);
            }
        }
    });
}
function loadImage(basePath, fallbackIcon) {
    // Common image formats to try
    const imageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

    return new Promise(async (resolve) => {
        // If basePath already has an extension, try it first
        if (basePath.includes('.')) {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => tryFormats();
            img.src = basePath;

            // Add timeout to avoid hanging
            setTimeout(() => {
                if (!img.complete) {
                    tryFormats();
                }
            }, 3000);
        } else {
            tryFormats();
        }

        async function tryFormats() {
            for (const format of imageFormats) {
                try {
                    const img = await tryLoadImage(basePath + format);
                    if (img) {
                        resolve(img);
                        return;
                    }
                } catch (error) {
                    // Continue to next format
                    continue;
                }
            }
            // If no format worked, resolve with null
            resolve(null);
        }

        function tryLoadImage(src) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null);
                img.src = src;

                // Add timeout for each attempt
                setTimeout(() => {
                    if (!img.complete) {
                        resolve(null);
                    }
                }, 2000);
            });
        }
    });
}

// Load products with improved image handling
function loadProducts(category) {
    const grid = document.getElementById('productsGrid');
    const filteredProducts = category === 'all'
        ? products
        : products.filter(p => p.category === category);

    grid.innerHTML = filteredProducts.map(product => `
                <div class="product-card fade-in">
                    <div class="product-image loading" data-product-id="${product.id}">
                        <div class="placeholder">${product.icon}</div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-category">${product.category}</p>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                        <div class="product-actions">
                            ${product.stock > 0
            ? `<button class="btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>`
            : `<button class="btn-add-cart" disabled style="background: #ccc;">Out of Stock</button>`
        }
                            <button class="btn-view" onclick="viewProduct(${product.id})">View</button>
                        </div>
                    </div>
                </div>
            `).join('');

    // Load images for products that have them
    filteredProducts.forEach(async (product) => {
        if (product.image) {
            const imageContainer = document.querySelector(`[data-product-id="${product.id}"]`);
            const img = await loadImage(product.image, product.icon);

            imageContainer.classList.remove('loading');

            if (img) {
                // Hide placeholder and show image
                const placeholder = imageContainer.querySelector('.placeholder');
                placeholder.style.display = 'none';

                img.alt = product.name;
                img.style.opacity = '0';
                imageContainer.appendChild(img);

                // Fade in the image
                setTimeout(() => {
                    img.style.opacity = '1';
                }, 100);
            }
            // If image fails to load, placeholder remains visible
        }
    });
}

// Filter products
function filterProducts(category) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Clear search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }

    // Reset section header
    const sectionHeader = document.querySelector('.section-header h2');
    sectionHeader.textContent = 'Featured Products';

    loadProducts(category);
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        if (cartItem.quantity < product.stock) {
            cartItem.quantity++;
        } else {
            alert('Cannot add more items. Stock limit reached.');
            return;
        }
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showNotification('Product added to cart!');
}

// Update cart UI with improved image handling
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999;">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => {
            // Create image HTML with flexible format support
            const imageHtml = item.image ?
                `<img src="${item.image}.jpg" alt="${item.name}" 
                         onerror="this.onerror=null; this.src='${item.image}.png'; this.onerror=function(){this.onerror=null; this.src='${item.image}.jpeg'; this.onerror=function(){this.onerror=null; this.src='${item.image}.gif'; this.onerror=function(){this.onerror=null; this.src='${item.image}.webp'; this.onerror=function(){this.style.display='none'; this.nextElementSibling.style.display='flex';}}}};">
                         <div class="placeholder" style="display: none;">${item.icon}</div>` :
                `<div class="placeholder">${item.icon}</div>`;

            return `
                        <div class="cart-item">
                            <div class="cart-item-image">
                                ${imageHtml}
                            </div>
                            <div class="cart-item-info">
                                <div class="cart-item-title">${item.name}</div>
                                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                                <div class="cart-item-quantity">
                                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                    <span>${item.quantity}</span>
                                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                                </div>
                            </div>
                            <button onclick="removeFromCart(${item.id})" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
                        </div>
                    `;
        }).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);

    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0 && newQuantity <= product.stock) {
            item.quantity = newQuantity;
        } else if (newQuantity > product.stock) {
            alert('Cannot add more items. Stock limit reached.');
        } else if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        updateCartUI();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Toggle cart
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');

    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// View product details with better image handling
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    const mainContent = document.getElementById('mainContent');
    const productDetail = document.getElementById('productDetail');
    const productDetailContent = document.getElementById('productDetailContent');

    // Create flexible image HTML that tries multiple formats
    const imageHtml = product.image ?
        `<img src="${product.image}.jpg" alt="${product.name}" 
                 onerror="this.onerror=null; this.src='${product.image}.png'; this.onerror=function(){this.onerror=null; this.src='${product.image}.jpeg'; this.onerror=function(){this.onerror=null; this.src='${product.image}.gif'; this.onerror=function(){this.onerror=null; this.src='${product.image}.webp'; this.onerror=function(){this.style.display='none'; this.nextElementSibling.style.display='flex';}}}};">
                <div class="placeholder" style="display: none;">${product.icon}</div>` :
        `<div class="placeholder">${product.icon}</div>`;

    productDetailContent.innerHTML = `
                <div class="product-detail-image">${imageHtml}</div>
                <div>
                    <h1>${product.name}</h1>
                    <p class="product-detail-category">${product.category}</p>
                    <span class="stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                        ${product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
                    </span>
                    <p class="product-detail-price">$${product.price.toFixed(2)}</p>
                    <p class="product-detail-description">${product.description}</p>
                    <div class="product-detail-actions">
                        ${product.stock > 0 ? `
                            <div class="quantity-selector">
                                <button onclick="updateDetailQuantity(-1)">-</button>
                                <span id="detailQuantity">1</span>
                                <button onclick="updateDetailQuantity(1)">+</button>
                            </div>
                            <button class="btn-primary" onclick="addToCartFromDetail(${product.id})">Add to Cart</button>
                        ` : `
                            <button class="btn-primary" disabled style="background: #ccc;">Out of Stock</button>
                        `}
                    </div>
                </div>
            `;

    mainContent.style.display = 'none';
    productDetail.classList.add('active');
    window.scrollTo(0, 0);
}

// Update detail quantity
function updateDetailQuantity(change) {
    const quantitySpan = document.getElementById('detailQuantity');
    const currentQuantity = parseInt(quantitySpan.textContent);
    const newQuantity = currentQuantity + change;

    if (newQuantity >= 1 && newQuantity <= 10) {
        quantitySpan.textContent = newQuantity;
    }
}

// Add to cart from detail
function addToCartFromDetail(productId) {
    const quantity = parseInt(document.getElementById('detailQuantity').textContent);
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        if (cartItem.quantity + quantity <= product.stock) {
            cartItem.quantity += quantity;
        } else {
            alert(`Cannot add ${quantity} items. Only ${product.stock - cartItem.quantity} available.`);
            return;
        }
    } else {
        cart.push({ ...product, quantity });
    }

    updateCartUI();
    showNotification(`${quantity} item(s) added to cart!`);
    showHome();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--success-color);
                color: white;
                padding: 15px 25px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                z-index: 3000;
                animation: slideIn 0.3s ease-out;
            `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show/hide modals
function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showCheckoutModal() {
    if (!currentUser) {
        alert('Please login to checkout');
        showLoginModal();
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    toggleCart();
    document.getElementById('checkoutModal').classList.add('active');
}

// Toggle between login and register
function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    const modalTitle = document.getElementById('modalTitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const authToggleText = document.getElementById('authToggleText');
    const authToggleLink = document.getElementById('authToggleLink');
    const nameGroup = document.getElementById('nameGroup');
    const phoneGroup = document.getElementById('phoneGroup');
    const adminHint = document.getElementById('adminHint');

    if (isRegisterMode) {
        modalTitle.textContent = 'Register';
        authSubmitBtn.textContent = 'Register';
        authToggleText.textContent = 'Already have an account?';
        authToggleLink.textContent = 'Login';
        nameGroup.style.display = 'block';
        phoneGroup.style.display = 'block';
        adminHint.style.display = 'none'; // Hide admin hint during registration
    } else {
        modalTitle.textContent = 'Login';
        authSubmitBtn.textContent = 'Login';
        authToggleText.textContent = "Don't have an account?";
        authToggleLink.textContent = 'Register';
        nameGroup.style.display = 'none';
        phoneGroup.style.display = 'none';
        adminHint.style.display = 'block'; // Show admin hint during login
    }
}

// Handle authentication with enhanced admin login
function handleAuth(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (isRegisterMode) {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;

        // Prevent admin email registration by regular users
        if (email === ADMIN_CREDENTIALS.email) {
            alert('This email is reserved for admin use.');
            return;
        }

        // Simulate registration
        currentUser = { email, name, phone, isAdmin: false };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showNotification('Registration successful!');
    } else {
        // Enhanced login with admin validation
        if (email === ADMIN_CREDENTIALS.email) {
            if (password === ADMIN_CREDENTIALS.password) {
                currentUser = { email, name: 'Administrator', isAdmin: true };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                showNotification('Admin login successful!');
                setTimeout(() => showAdmin(), 1000); // Auto-redirect to admin dashboard
            } else {
                alert('Invalid admin password. Please try again.');
                return;
            }
        } else {
            // Regular user login (simplified for demo)
            currentUser = { email, name: 'Customer', isAdmin: false };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showNotification('Login successful!');
        }
    }

    updateUserUI();
    closeModal('loginModal');
    document.getElementById('authForm').reset();
}

// Check login status
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserUI();
    }
}

// Update user UI
function updateUserUI() {
    const welcomeUser = document.getElementById('welcomeUser');
    const loginBtn = document.getElementById('loginBtn');

    if (currentUser) {
        welcomeUser.textContent = `Welcome, ${currentUser.name}!`;
        loginBtn.textContent = 'Logout';
        loginBtn.onclick = logout;
    } else {
        welcomeUser.textContent = 'Welcome to AWE Electronics!';
        loginBtn.textContent = 'Login';
        loginBtn.onclick = showLoginModal;
    }
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserUI();
    showNotification('Logged out successfully');
    showHome();
}

// Process checkout
function processCheckout(event) {
    event.preventDefault();

    // Create order
    const order = {
        id: 'ORD' + Date.now(),
        date: new Date().toLocaleDateString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'processing',
        customer: currentUser.email
    };

    orders.push(order);

    // Update inventory
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            product.stock -= item.quantity;
        }
    });

    // Clear cart
    cart = [];
    updateCartUI();

    // Close modal and show success
    closeModal('checkoutModal');
    showNotification('Order placed successfully! Order ID: ' + order.id);

    // Redirect to orders
    setTimeout(() => showOrders(), 2000);
}

// Show orders
function showOrders() {
    if (!currentUser) {
        alert('Please login to view your orders');
        showLoginModal();
        return;
    }

    const mainContent = document.getElementById('mainContent');
    const orderHistory = document.getElementById('orderHistory');
    const productDetail = document.getElementById('productDetail');
    const adminSection = document.getElementById('adminSection');
    const orderList = document.getElementById('orderList');

    const userOrders = orders.filter(order => order.customer === currentUser.email);

    if (userOrders.length === 0) {
        orderList.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No orders found</p>';
    } else {
        orderList.innerHTML = userOrders.map(order => `
                    <div class="order-item">
                        <div>
                            <div class="order-id">Order #${order.id}</div>
                            <div class="order-date">${order.date}</div>
                        </div>
                        <div>
                            ${order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}
                        </div>
                        <div style="text-align: right;">
                            <div class="order-status ${order.status}">${order.status}</div>
                            <div class="order-total">$${order.total.toFixed(2)}</div>
                        </div>
                    </div>
                `).join('');
    }

    mainContent.style.display = 'none';
    productDetail.classList.remove('active');
    adminSection.classList.remove('active');
    orderHistory.classList.add('active');
    window.scrollTo(0, 0);
}

// Show home
function showHome() {
    console.log('showHome called'); // Debug log

    const mainContent = document.getElementById('mainContent');
    const orderHistory = document.getElementById('orderHistory');
    const productDetail = document.getElementById('productDetail');
    const adminSection = document.getElementById('adminSection');

    // Show main content and hide others
    mainContent.style.display = 'block';
    orderHistory.classList.remove('active');
    productDetail.classList.remove('active');
    adminSection.classList.remove('active');

    // Scroll to top when showing home
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 100);

    console.log('Main content displayed'); // Debug log
}

// Show admin
function showAdmin() {
    if (!currentUser || !currentUser.isAdmin) {
        alert('Admin access required');
        return;
    }

    const mainContent = document.getElementById('mainContent');
    const orderHistory = document.getElementById('orderHistory');
    const productDetail = document.getElementById('productDetail');
    const adminSection = document.getElementById('adminSection');

    mainContent.style.display = 'none';
    orderHistory.classList.remove('active');
    productDetail.classList.remove('active');
    adminSection.classList.add('active');

    showAdminTab('overview');
    window.scrollTo(0, 0);
}

// Enhanced admin tab functionality
function showAdminTab(tab) {
    // Update active tab
    document.querySelectorAll('.admin-nav-item').forEach(btn => {
        btn.classList.remove('active');
    });

    // Find the clicked tab and make it active
    const clickedTab = Array.from(document.querySelectorAll('.admin-nav-item')).find(btn => btn.textContent.toLowerCase().includes(tab));
    if (clickedTab) clickedTab.classList.add('active');

    const adminContent = document.getElementById('adminContent');

    switch (tab) {
        case 'overview':
            const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
            const totalOrders = orders.length;
            const totalProducts = products.length;
            const lowStock = products.filter(p => p.stock < 10).length;
            const pendingOrders = orders.filter(o => o.status === 'processing').length;

            adminContent.innerHTML = `
                        <h3>Dashboard Overview</h3>
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-number">$${totalRevenue.toFixed(2)}</div>
                                <div class="stat-label">Total Revenue</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">${totalOrders}</div>
                                <div class="stat-label">Total Orders</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">${pendingOrders}</div>
                                <div class="stat-label">Pending Orders</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">${lowStock}</div>
                                <div class="stat-label">Low Stock Alert</div>
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px;">
                            <div>
                                <h3>Recent Orders</h3>
                                <div style="margin-top: 15px; max-height: 300px; overflow-y: auto;">
                                    ${orders.slice(-5).reverse().map(order => `
                                        <div style="padding: 15px; border: 1px solid var(--border-color); border-radius: 5px; margin-bottom: 10px; background: white;">
                                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                                <div>
                                                    <strong>Order #${order.id}</strong><br>
                                                    <small style="color: var(--text-light);">${order.customer} • ${order.date}</small>
                                                </div>
                                                <div style="text-align: right;">
                                                    <div style="font-weight: bold; color: var(--secondary-color);">$${order.total.toFixed(2)}</div>
                                                    <span class="order-status ${order.status}" style="font-size: 12px;">${order.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('') || '<p style="color: var(--text-light); text-align: center; padding: 20px;">No orders yet</p>'}
                                </div>
                            </div>
                            
                            <div>
                                <h3>Stock Alerts</h3>
                                <div style="margin-top: 15px; max-height: 300px; overflow-y: auto;">
                                    ${products.filter(p => p.stock < 10).map(product => `
                                        <div style="padding: 15px; border: 1px solid var(--error-color); background: #fee2e2; border-radius: 5px; margin-bottom: 10px;">
                                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                                <div>
                                                    <strong>${product.icon} ${product.name}</strong><br>
                                                    <small style="color: var(--error-color);">Only ${product.stock} units left!</small>
                                                </div>
                                                <button onclick="restockProduct(${product.id})" style="padding: 5px 15px; background: var(--success-color); color: white; border: none; border-radius: 3px; cursor: pointer;">
                                                    Restock
                                                </button>
                                            </div>
                                        </div>
                                    `).join('') || '<p style="color: var(--text-light); text-align: center; padding: 20px;">All products are well stocked</p>'}
                                </div>
                            </div>
                        </div>
                    `;
            break;

        case 'orders':
            adminContent.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h3>Order Management</h3>
                            <div>
                                <select id="orderStatusFilter" onchange="filterOrdersByStatus()" style="padding: 8px; border: 1px solid var(--border-color); border-radius: 5px;">
                                    <option value="all">All Orders</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                </select>
                            </div>
                        </div>
                        
                        <div id="adminOrdersList" style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                            ${orders.length === 0 ?
                    '<p style="text-align: center; padding: 40px; color: var(--text-light);">No orders found</p>' :
                    orders.slice().reverse().map(order => `
                                    <div class="admin-order-item" style="padding: 20px; border-bottom: 1px solid var(--border-color); ${orders.indexOf(order) === orders.length - 1 ? 'border-bottom: none;' : ''}">
                                        <div style="display: grid; grid-template-columns: auto 1fr auto auto; gap: 20px; align-items: center;">
                                            <div>
                                                <div style="font-weight: bold; font-size: 16px;">Order #${order.id}</div>
                                                <div style="color: var(--text-light); font-size: 14px;">${order.date}</div>
                                                <div style="color: var(--text-light); font-size: 14px;">Customer: ${order.customer}</div>
                                            </div>
                                            <div>
                                                <div style="font-size: 14px; margin-bottom: 5px;"><strong>Items:</strong></div>
                                                ${order.items.map(item => `
                                                    <div style="font-size: 13px; color: var(--text-light);">
                                                        ${item.name} × ${item.quantity} ($${(item.price * item.quantity).toFixed(2)})
                                                    </div>
                                                `).join('')}
                                            </div>
                                            <div style="text-align: center;">
                                                <select onchange="updateOrderStatus('${order.id}', this.value)" style="padding: 5px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 12px;">
                                                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                                                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                                                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                                </select>
                                            </div>
                                            <div style="text-align: right;">
                                                <div style="font-size: 20px; font-weight: bold; color: var(--secondary-color);">$${order.total.toFixed(2)}</div>
                                                <div class="order-status ${order.status}" style="margin-top: 5px;">${order.status}</div>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')
                }
                        </div>
                    `;
            break;

        case 'inventory':
            adminContent.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h3>Inventory Management</h3>
                            <button onclick="bulkRestockProducts()" style="padding: 10px 20px; background: var(--secondary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">
                                Bulk Restock
                            </button>
                        </div>
                        
                        <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background: var(--bg-light);">
                                        <th style="padding: 15px; text-align: left; font-weight: 600;">Product</th>
                                        <th style="padding: 15px; text-align: left; font-weight: 600;">Category</th>
                                        <th style="padding: 15px; text-align: left; font-weight: 600;">Price</th>
                                        <th style="padding: 15px; text-align: left; font-weight: 600;">Current Stock</th>
                                        <th style="padding: 15px; text-align: left; font-weight: 600;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${products.map(product => `
                                        <tr style="border-bottom: 1px solid var(--border-color);">
                                            <td style="padding: 15px;">
                                                <div style="display: flex; align-items: center; gap: 10px;">
                                                    <span style="font-size: 24px;">${product.icon}</span>
                                                    <div>
                                                        <div style="font-weight: 600;">${product.name}</div>
                                                        ${product.stock < 10 ? '<div style="color: var(--error-color); font-size: 12px;">⚠️ Low Stock</div>' : ''}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style="padding: 15px; text-transform: capitalize;">${product.category}</td>
                                            <td style="padding: 15px; font-weight: 600;">${product.price.toFixed(2)}</td>
                                            <td style="padding: 15px;">
                                                <div style="display: flex; align-items: center; gap: 10px;">
                                                    <span style="font-weight: 600; color: ${product.stock < 10 ? 'var(--error-color)' : 'var(--success-color)'};">
                                                        ${product.stock} units
                                                    </span>
                                                </div>
                                            </td>
                                            <td style="padding: 15px;">
                                                <div style="display: flex; align-items: center; gap: 10px;">
                                                    <input type="number" id="stock-${product.id}" min="0" max="1000" value="50" 
                                                           style="width: 80px; padding: 5px; border: 1px solid var(--border-color); border-radius: 3px;" placeholder="Qty">
                                                    <button onclick="updateStock(${product.id})" 
                                                            style="padding: 8px 15px; background: var(--success-color); color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">
                                                        Add Stock
                                                    </button>
                                                    <button onclick="setStock(${product.id})" 
                                                            style="padding: 8px 15px; background: var(--secondary-color); color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">
                                                        Set Stock
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
            break;

        case 'reports':
            const monthlyRevenue = orders.reduce((sum, order) => sum + order.total, 0);
            const avgOrderValue = orders.length > 0 ? monthlyRevenue / orders.length : 0;
            const totalCustomers = [...new Set(orders.map(order => order.customer))].length;

            adminContent.innerHTML = `
                        <h3>Sales Reports & Analytics</h3>
                        <div class="stats-grid" style="margin-bottom: 30px;">
                            <div class="stat-card">
                                <div class="stat-number">${monthlyRevenue.toFixed(2)}</div>
                                <div class="stat-label">Total Revenue</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">${avgOrderValue.toFixed(2)}</div>
                                <div class="stat-label">Average Order Value</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">${totalCustomers}</div>
                                <div class="stat-label">Unique Customers</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">${orders.length}</div>
                                <div class="stat-label">Total Orders</div>
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                            <div>
                                <h4>Sales by Category</h4>
                                <div style="margin-top: 20px;">
                                    ${['computers', 'phones', 'audio', 'gaming'].map(category => {
                const categoryProducts = products.filter(p => p.category === category);
                const categorySales = orders.reduce((sum, order) => {
                    return sum + order.items
                        .filter(item => categoryProducts.find(p => p.id === item.id))
                        .reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
                }, 0);
                const categoryOrders = orders.filter(order =>
                    order.items.some(item => categoryProducts.find(p => p.id === item.id))
                ).length;

                return `
                                            <div style="padding: 15px; border: 1px solid var(--border-color); border-radius: 5px; margin-bottom: 10px; background: white;">
                                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                                    <div>
                                                        <strong style="text-transform: capitalize;">${category}</strong>
                                                        <div style="font-size: 12px; color: var(--text-light);">${categoryOrders} orders</div>
                                                    </div>
                                                    <div style="text-align: right;">
                                                        <div style="font-weight: bold; color: var(--secondary-color);">${categorySales.toFixed(2)}</div>
                                                        <div style="font-size: 12px; color: var(--text-light);">
                                                            ${monthlyRevenue > 0 ? ((categorySales / monthlyRevenue) * 100).toFixed(1) : 0}% of total
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        `;
            }).join('')}
                                </div>
                            </div>
                            
                            <div>
                                <h4>Top Customers</h4>
                                <div style="margin-top: 20px;">
                                    ${[...new Set(orders.map(order => order.customer))]
                    .map(customer => {
                        const customerOrders = orders.filter(order => order.customer === customer);
                        const customerTotal = customerOrders.reduce((sum, order) => sum + order.total, 0);
                        return { customer, orders: customerOrders.length, total: customerTotal };
                    })
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 5)
                    .map(customer => `
                                            <div style="padding: 15px; border: 1px solid var(--border-color); border-radius: 5px; margin-bottom: 10px; background: white;">
                                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                                    <div>
                                                        <strong>${customer.customer}</strong>
                                                        <div style="font-size: 12px; color: var(--text-light);">${customer.orders} orders</div>
                                                    </div>
                                                    <div style="font-weight: bold; color: var(--secondary-color);">${customer.total.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        `).join('') || '<p style="color: var(--text-light);">No customer data available</p>'
                }
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 30px; text-align: center;">
                            <button onclick="exportReportToCSV()" style="padding: 12px 25px; background: var(--secondary-color); color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                                📊 Export Sales Report (CSV)
                            </button>
                            <button onclick="exportInventoryToCSV()" style="padding: 12px 25px; background: var(--success-color); color: white; border: none; border-radius: 5px; cursor: pointer;">
                                📦 Export Inventory (CSV)
                            </button>
                        </div>
                    `;
            break;
    }
}

// Add smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced Admin Functions

// Update order status
function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        showNotification(`Order #${orderId} status updated to ${newStatus}`);
        // Refresh the orders tab
        showAdminTab('orders');
    }
}

// Filter orders by status
function filterOrdersByStatus() {
    const filter = document.getElementById('orderStatusFilter').value;
    const ordersList = document.getElementById('adminOrdersList');

    const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.status === filter);

    if (filteredOrders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-light);">No orders found for this status</p>';
        return;
    }

    ordersList.innerHTML = filteredOrders.slice().reverse().map(order => `
                <div class="admin-order-item" style="padding: 20px; border-bottom: 1px solid var(--border-color);">
                    <div style="display: grid; grid-template-columns: auto 1fr auto auto; gap: 20px; align-items: center;">
                        <div>
                            <div style="font-weight: bold; font-size: 16px;">Order #${order.id}</div>
                            <div style="color: var(--text-light); font-size: 14px;">${order.date}</div>
                            <div style="color: var(--text-light); font-size: 14px;">Customer: ${order.customer}</div>
                        </div>
                        <div>
                            <div style="font-size: 14px; margin-bottom: 5px;"><strong>Items:</strong></div>
                            ${order.items.map(item => `
                                <div style="font-size: 13px; color: var(--text-light);">
                                    ${item.name} × ${item.quantity} (${(item.price * item.quantity).toFixed(2)})
                                </div>
                            `).join('')}
                        </div>
                        <div style="text-align: center;">
                            <select onchange="updateOrderStatus('${order.id}', this.value)" style="padding: 5px; border: 1px solid var(--border-color); border-radius: 3px; font-size: 12px;">
                                <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                                <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                            </select>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 20px; font-weight: bold; color: var(--secondary-color);">${order.total.toFixed(2)}</div>
                            <div class="order-status ${order.status}" style="margin-top: 5px;">${order.status}</div>
                        </div>
                    </div>
                </div>
            `).join('');
}

// Stock management functions
function updateStock(productId) {
    const product = products.find(p => p.id === productId);
    const stockInput = document.getElementById(`stock-${productId}`);
    const additionalStock = parseInt(stockInput.value) || 0;

    if (additionalStock <= 0) {
        alert('Please enter a valid quantity to add');
        return;
    }

    product.stock += additionalStock;
    showNotification(`Added ${additionalStock} units to ${product.name}. New stock: ${product.stock}`);

    // Refresh inventory tab
    showAdminTab('inventory');

    // Update main product display if visible
    refreshMainProductDisplay();
}

function setStock(productId) {
    const product = products.find(p => p.id === productId);
    const stockInput = document.getElementById(`stock-${productId}`);
    const newStock = parseInt(stockInput.value) || 0;

    if (newStock < 0) {
        alert('Stock cannot be negative');
        return;
    }

    const oldStock = product.stock;
    product.stock = newStock;
    showNotification(`${product.name} stock updated from ${oldStock} to ${newStock} units`);

    // Refresh inventory tab
    showAdminTab('inventory');

    // Update main product display if visible
    refreshMainProductDisplay();
}

function restockProduct(productId) {
    const product = products.find(p => p.id === productId);
    const restockAmount = prompt(`How many units would you like to add to ${product.name}?`, '50');

    if (restockAmount === null) return; // User cancelled

    const amount = parseInt(restockAmount);
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid number');
        return;
    }

    product.stock += amount;
    showNotification(`Added ${amount} units to ${product.name}. New stock: ${product.stock}`);

    // Refresh current admin tab
    if (document.getElementById('adminSection').classList.contains('active')) {
        showAdminTab('overview');
    }

    // Update main product display if visible
    refreshMainProductDisplay();
}

function bulkRestockProducts() {
    const restockAmount = prompt('Enter the number of units to add to ALL products:', '25');

    if (restockAmount === null) return; // User cancelled

    const amount = parseInt(restockAmount);
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid number');
        return;
    }

    products.forEach(product => {
        product.stock += amount;
    });

    showNotification(`Added ${amount} units to all products successfully!`);
    showAdminTab('inventory');

    // Update main product display if visible
    refreshMainProductDisplay();
}

function refreshMainProductDisplay() {
    // Only refresh if main content is visible (not in admin or other sections)
    const mainContent = document.getElementById('mainContent');
    const productsGrid = document.getElementById('productsGrid');

    if (mainContent.style.display !== 'none' && productsGrid) {
        // Check if we have an active filter
        const activeFilter = document.querySelector('.filter-btn.active');
        const currentCategory = activeFilter ?
            (activeFilter.textContent.toLowerCase() === 'all' ? 'all' : activeFilter.textContent.toLowerCase()) : 'all';

        // Check if there's a search active
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim() !== '') {
            searchProducts(); // Refresh search results
        } else {
            loadProducts(currentCategory); // Refresh filtered products
        }
    }
}

// Export functions
function exportReportToCSV() {
    const csvData = [];
    csvData.push(['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Status']);

    orders.forEach(order => {
        const itemsStr = order.items.map(item => `${item.name} x${item.quantity}`).join('; ');
        csvData.push([
            order.id,
            order.date,
            order.customer,
            itemsStr,
            order.total.toFixed(2),
            order.status
        ]);
    });

    downloadCSV(csvData, 'sales-report.csv');
}

function exportInventoryToCSV() {
    const csvData = [];
    csvData.push(['Product Name', 'Category', 'Price', 'Stock', 'Status']);

    products.forEach(product => {
        csvData.push([
            product.name,
            product.category,
            product.price.toFixed(2),
            product.stock,
            product.stock < 10 ? 'Low Stock' : 'In Stock'
        ]);
    });

    downloadCSV(csvData, 'inventory-report.csv');
}

function downloadCSV(data, filename) {
    const csvContent = data.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification(`${filename} downloaded successfully!`);
    }
}