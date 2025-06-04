// Main application functionality extracted from working project.html

// Initialize orders data - STARTS EMPTY but add some sample data for demo
let orders = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('AWE Electronics - Initializing application...');
    
    // Initialize all modules in correct order
    if (typeof initAuth === 'function') initAuth();
    if (typeof loadProducts === 'function') loadProducts('all');
    if (typeof updateCartUI === 'function') updateCartUI();
    if (typeof checkLoginStatus === 'function') checkLoginStatus();
    
    // Add backup event listeners for navigation buttons
    if (typeof addNavigationListeners === 'function') addNavigationListeners();
    
    // Add some sample orders for demonstration
    if (orders.length === 0 && typeof products !== 'undefined') {
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
    
    console.log('Orders array initialized with sample data:', orders.length);
    console.log('Application initialized successfully');
});

// Search functionality
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) {
        console.error('Search input not found');
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        if (typeof loadProducts === 'function') {
            loadProducts('all');
        }
        resetSectionHeader();
        return;
    }
    
    if (typeof products !== 'undefined') {
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        
        displayFilteredProducts(filteredProducts, `Search results for "${searchTerm}"`);
    }
}

function handleSearchEnter(event) {
    if (event.key === 'Enter') {
        searchProducts();
    }
}

function displayFilteredProducts(filteredProducts, headerText) {
    const grid = document.getElementById('productsGrid');
    const sectionHeader = document.querySelector('.section-header h2');
    
    if (!grid) {
        console.error('Products grid not found');
        return;
    }
    
    // Update header
    if (sectionHeader) {
        sectionHeader.textContent = headerText;
    }
    
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
        if (product.image && typeof loadImage === 'function') {
            const imageContainer = document.querySelector(`[data-product-id="${product.id}"]`);
            if (imageContainer) {
                const img = await loadImage(product.image, product.icon);
                
                imageContainer.classList.remove('loading');
                
                if (img) {
                    const placeholder = imageContainer.querySelector('.placeholder');
                    if (placeholder) {
                        placeholder.style.display = 'none';
                    }
                    
                    img.alt = product.name;
                    img.style.opacity = '0';
                    imageContainer.appendChild(img);
                    
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);
                }
            }
        }
    });
}

function resetSectionHeader() {
    const sectionHeader = document.querySelector('.section-header h2');
    if (sectionHeader) {
        sectionHeader.textContent = 'Featured Products';
    }
}

// Filter products
function filterProducts(category) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Clear search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reset section header
    resetSectionHeader();
    
    if (typeof loadProducts === 'function') {
        loadProducts(category);
    }
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
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Refresh main product display
function refreshMainProductDisplay() {
    // Only refresh if main content is visible (not in admin or other sections)
    const mainContent = document.getElementById('mainContent');
    const productsGrid = document.getElementById('productsGrid');
    
    if (!mainContent || !productsGrid) return;
    
    if (mainContent.style.display !== 'none') {
        // Check if we have an active filter
        const activeFilter = document.querySelector('.filter-btn.active');
        const currentCategory = activeFilter ? 
            (activeFilter.textContent.toLowerCase() === 'all' ? 'all' : activeFilter.textContent.toLowerCase()) : 'all';
        
        // Check if there's a search active
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim() !== '') {
            searchProducts(); // Refresh search results
        } else if (typeof loadProducts === 'function') {
            loadProducts(currentCategory); // Refresh filtered products
        }
    }
}

// Add smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
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
});

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        searchProducts,
        filterProducts,
        showNotification,
        refreshMainProductDisplay
    };
}