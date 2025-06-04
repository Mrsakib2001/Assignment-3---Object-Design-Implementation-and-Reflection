function loadProducts(category) {
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.error('Products grid not found');
        return;
    }
    
    const filteredProducts = getProductsByCategory(category);
    
    grid.innerHTML = filteredProducts.map(product => createProductCardHTML(product)).join('');

    filteredProducts.forEach(async (product) => {
        if (product.image) {
            await loadProductImage(product);
        }
    });
}

function createProductCardHTML(product) {
    return `
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
    `;
}

async function loadProductImage(product) {
    const imageContainer = document.querySelector(`[data-product-id="${product.id}"]`);
    if (!imageContainer) return;
    
    const img = await loadImage(product.image, product.icon);
    
    imageContainer.classList.remove('loading');
    
    if (img) {
        const placeholder = imageContainer.querySelector('.placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        img.alt = product.name;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        imageContainer.appendChild(img);
        
        setTimeout(() => {
            img.style.opacity = '1';
        }, 100);
    }
}

function filterProducts(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    const sectionHeader = document.querySelector('.section-header h2');
    if (sectionHeader) {
        sectionHeader.textContent = 'Featured Products';
    }
    
    loadProducts(category);
}

function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) {
        console.error('Search input not found');
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        loadProducts('all');
        resetSectionHeader();
        return;
    }
    
    const filteredProducts = searchProductsData(searchTerm);
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
    
    if (!grid) {
        console.error('Products grid not found');
        return;
    }
    
    if (sectionHeader) {
        sectionHeader.textContent = headerText;
    }
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-light);">
                <h3>No products found</h3>
                <p>Try adjusting your search terms</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredProducts.map(product => createProductCardHTML(product)).join('');

    filteredProducts.forEach(async (product) => {
        if (product.image) {
            await loadProductImage(product);
        }
    });
}

function resetSectionHeader() {
    const sectionHeader = document.querySelector('.section-header h2');
    if (sectionHeader) {
        sectionHeader.textContent = 'Featured Products';
    }
}

function refreshMainProductDisplay() {
    const mainContent = document.getElementById('mainContent');
    const productsGrid = document.getElementById('productsGrid');
    
    if (!mainContent || !productsGrid) return;
    
    if (mainContent.style.display !== 'none') {
        const activeFilter = document.querySelector('.filter-btn.active');
        const currentCategory = activeFilter ? 
            (activeFilter.textContent.toLowerCase() === 'all' ? 'all' : activeFilter.textContent.toLowerCase()) : 'all';
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim() !== '') {
            searchProducts();
        } else {
            loadProducts(currentCategory);
        }
    }
}

function initProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.textContent.toLowerCase();
            const categoryMap = {
                'all': 'all',
                'computers': 'computers',
                'phones': 'phones',
                'audio': 'audio',
                'gaming': 'gaming'
            };
            
            filterProducts(categoryMap[category] || 'all');
        });
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    
    const backgroundColor = type === 'error' ? 'var(--error-color)' : 'var(--success-color)';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
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

function initProductCardEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const observeProductCards = () => {
        const productCards = document.querySelectorAll('.product-card:not(.observed)');
        productCards.forEach(card => {
            card.classList.add('observed');
            observer.observe(card);
        });
    };
    
    observeProductCards();
    
    const originalLoadProducts = window.loadProducts;
    window.loadProducts = function(...args) {
        if (originalLoadProducts) {
            originalLoadProducts.apply(this, args);
        }
        setTimeout(observeProductCards, 100);
    };
}

function initAdvancedSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchProducts();
        }, 300);
    });
    
    searchInput.addEventListener('focus', function() {
    });
    
    const searchContainer = searchInput.parentElement;
    if (searchContainer && !searchContainer.querySelector('.search-clear')) {
        const clearButton = document.createElement('button');
        clearButton.innerHTML = '✕';
        clearButton.className = 'search-clear';
        clearButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0 5px;
            display: none;
        `;
        
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            searchProducts();
            this.style.display = 'none';
        });
        
        searchContainer.appendChild(clearButton);
        
        searchInput.addEventListener('input', function() {
            clearButton.style.display = this.value ? 'block' : 'none';
        });
    }
}

function sortProducts(criteria) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    const productCards = Array.from(grid.querySelectorAll('.product-card'));
    const products = productCards.map(card => {
        const id = parseInt(card.querySelector('[data-product-id]').getAttribute('data-product-id'));
        return getProductById(id);
    }).filter(Boolean);
    
    let sortedProducts;
    
    switch(criteria) {
        case 'price-low':
            sortedProducts = products.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts = products.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts = products.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'stock':
            sortedProducts = products.sort((a, b) => b.stock - a.stock);
            break;
        default:
            sortedProducts = products;
    }
    
    grid.innerHTML = sortedProducts.map(product => createProductCardHTML(product)).join('');
    
    sortedProducts.forEach(async (product) => {
        if (product.image) {
            await loadProductImage(product);
        }
    });
}

function initProductUI() {
    initProductFilters();
    initProductCardEffects();
    initAdvancedSearch();
    loadProducts('all');
}
