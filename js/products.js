const products = [
    { 
        id: 1, 
        name: 'Gaming Laptop Pro', 
        category: 'computers', 
        price: 1299.99, 
        icon: '💻', 
        stock: 15,
        image: 'images/gaminglaptoppro',
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
        stock: 30,
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


function loadImage(imagePath, fallbackIcon) {
    return new Promise((resolve) => {
        
        if (imagePath && (imagePath.startsWith('http') || imagePath.startsWith('https'))) {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = imagePath;
            
            
            setTimeout(() => {
                if (!img.complete) {
                    resolve(null);
                }
            }, 5000);
        } else {
            
            tryLocalFormats();
        }
        
        function tryLocalFormats() {
            const imageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            let formatIndex = 0;
            
            function tryNextFormat() {
                if (formatIndex >= imageFormats.length) {
                    resolve(null);
                    return;
                }
                
                const img = new Image();
                const testSrc = imagePath + imageFormats[formatIndex];
                
                img.onload = () => resolve(img);
                img.onerror = () => {
                    formatIndex++;
                    tryNextFormat();
                };
                
                img.src = testSrc;
                
                setTimeout(() => {
                    if (!img.complete) {
                        formatIndex++;
                        tryNextFormat();
                    }
                }, 2000);
            }
            
            tryNextFormat();
        }
    });
}


function getProductById(id) {
    return products.find(product => product.id === id);
}


function getProductsByCategory(category) {
    if (category === 'all') {
        return products;
    }
    return products.filter(product => product.category === category);
}


function searchProductsData(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    if (term === '') {
        return products;
    }
    
    return products.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    );
}


function updateProductStock(productId, newStock) {
    const product = getProductById(productId);
    if (product) {
        product.stock = newStock;
        return true;
    }
    return false;
}


function addProductStock(productId, additionalStock) {
    const product = getProductById(productId);
    if (product && additionalStock > 0) {
        product.stock += additionalStock;
        return true;
    }
    return false;
}


function reduceProductStock(productId, quantity) {
    const product = getProductById(productId);
    if (product && product.stock >= quantity) {
        product.stock -= quantity;
        return true;
    }
    return false;
}


function isProductInStock(productId, quantity = 1) {
    const product = getProductById(productId);
    return product && product.stock >= quantity;
}


function getLowStockProducts() {
    return products.filter(product => product.stock < 10);
}


function getOutOfStockProducts() {
    return products.filter(product => product.stock === 0);
}