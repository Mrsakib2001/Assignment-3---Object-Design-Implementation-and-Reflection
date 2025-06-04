// Navigation functions extracted from working project.html

// Add backup navigation event listeners
function addNavigationListeners() {
    // Find all navigation links and add click handlers
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const text = link.textContent.trim().toLowerCase();
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Navigation clicked:', text);
            
            switch(text) {
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
        shopNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Shop Now clicked');
            goToProducts();
        });
    }
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

// Go to products section - THIS WAS MISSING!
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
                if (typeof loadProducts === 'function') {
                    loadProducts('all');
                }
                
                // Reset filter buttons
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                const firstFilter = document.querySelector('.filter-btn');
                if (firstFilter) firstFilter.classList.add('active');
                
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
        orderList.innerHTML = `
            <div style="text-align: center; padding: 80px 20px; color: var(--text-light);">
                <div style="font-size: 64px; margin-bottom: 24px; opacity: 0.5;">📦</div>
                <h3 style="margin-bottom: 16px; color: var(--text-dark); font-size: 24px;">No Orders Yet</h3>
                <p style="margin-bottom: 32px; font-size: 16px; max-width: 400px; margin-left: auto; margin-right: auto; line-height: 1.5;">
                    You haven't placed any orders yet. Start shopping to see your order history here!
                </p>
                <button onclick="goToProducts()" style="padding: 14px 32px; background: var(--secondary-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; transition: background 0.3s ease;">
                    Start Shopping
                </button>
            </div>
        `;
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

// Show admin - FIXED VERSION
function showAdmin() {
    console.log('showAdmin called');
    
    if (!currentUser || !currentUser.isAdmin) {
        alert('Admin access required. Please login with admin credentials:\n\nEmail: admin@awe.com\nPassword: admin123');
        showLoginModal();
        return;
    }
    
    console.log('Admin access granted, showing admin section');
    
    const mainContent = document.getElementById('mainContent');
    const orderHistory = document.getElementById('orderHistory');
    const productDetail = document.getElementById('productDetail');
    const adminSection = document.getElementById('adminSection');
    
    mainContent.style.display = 'none';
    orderHistory.classList.remove('active');
    productDetail.classList.remove('active');
    adminSection.classList.add('active');
    
    if (typeof showAdminTab === 'function') {
        showAdminTab('overview');
    }
    window.scrollTo(0, 0);
    
    console.log('Admin section should now be visible');
}

// View product details
function viewProduct(productId) {
    const product = getProductById(productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    const mainContent = document.getElementById('mainContent');
    const orderHistory = document.getElementById('orderHistory');
    const productDetail = document.getElementById('productDetail');
    const adminSection = document.getElementById('adminSection');
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
    orderHistory.classList.remove('active');
    adminSection.classList.remove('active');
    productDetail.classList.add('active');
    window.scrollTo(0, 0);
}

// Update detail quantity
function updateDetailQuantity(change) {
    const quantitySpan = document.getElementById('detailQuantity');
    if (!quantitySpan) return;
    
    const currentQuantity = parseInt(quantitySpan.textContent);
    const newQuantity = currentQuantity + change;
    
    if (newQuantity >= 1 && newQuantity <= 10) {
        quantitySpan.textContent = newQuantity;
    }
}