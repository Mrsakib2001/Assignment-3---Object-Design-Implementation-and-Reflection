// Cart functionality extracted from working project.html

let cart = [];

// Add to cart
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) {
        console.error('Product not found:', productId);
        return false;
    }
    
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        if (cartItem.quantity < product.stock) {
            cartItem.quantity++;
        } else {
            alert('Cannot add more items. Stock limit reached.');
            return false;
        }
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showNotification('Product added to cart!');
    return true;
}

// Add to cart from detail page
function addToCartFromDetail(productId) {
    const quantity = parseInt(document.getElementById('detailQuantity').textContent);
    const product = getProductById(productId);
    
    if (!product) {
        console.error('Product not found:', productId);
        return false;
    }
    
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        if (cartItem.quantity + quantity <= product.stock) {
            cartItem.quantity += quantity;
        } else {
            alert(`Cannot add ${quantity} items. Only ${product.stock - cartItem.quantity} available.`);
            return false;
        }
    } else {
        cart.push({ ...product, quantity });
    }
    
    updateCartUI();
    showNotification(`${quantity} item(s) added to cart!`);
    showHome();
    return true;
}

// Update cart UI with improved image handling
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartCount || !cartItems || !cartTotal) {
        console.error('Cart UI elements not found');
        return;
    }
    
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
    const product = getProductById(productId);
    
    if (item && product) {
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

// Clear cart
function clearCart() {
    cart = [];
    updateCartUI();
}

// Get cart total
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Toggle cart
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    if (!cartSidebar || !overlay) {
        console.error('Cart sidebar elements not found');
        return;
    }
    
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Show checkout modal
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
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.classList.add('active');
    }
}

// Process checkout
function processCheckout(event) {
    event.preventDefault();
    
    if (!currentUser) {
        alert('Please login to complete checkout');
        return;
    }
    
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
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
        const product = getProductById(item.id);
        if (product) {
            product.stock -= item.quantity;
        }
    });
    
    // Clear cart
    clearCart();
    
    // Close modal and show success
    closeModal('checkoutModal');
    showNotification('Order placed successfully! Order ID: ' + order.id);
    
    // Redirect to orders
    setTimeout(() => showOrders(), 2000);
}

// Validate cart
function validateCart() {
    const invalidItems = [];
    
    cart.forEach(item => {
        const product = getProductById(item.id);
        if (!product) {
            invalidItems.push({ item, reason: 'Product no longer available' });
        } else if (product.stock < item.quantity) {
            invalidItems.push({ item, reason: `Only ${product.stock} units available` });
        }
    });
    
    return invalidItems;
}

// Sync cart with stock
function syncCartWithStock() {
    let updated = false;
    
    cart.forEach(item => {
        const product = getProductById(item.id);
        if (product && product.stock < item.quantity) {
            item.quantity = Math.max(0, product.stock);
            updated = true;
        }
    });
    
    cart = cart.filter(item => item.quantity > 0);
    
    if (updated) {
        updateCartUI();
        showNotification('Cart updated due to stock changes');
    }
    
    return updated;
}