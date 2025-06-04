let orders = [];

function showAdmin() {
    console.log('showAdmin called');
    console.log('Current user:', currentUser);
    console.log('Is admin?', isAdmin());
    
    // Check if user is logged in first
    if (!currentUser) {
        alert('Please log in to access admin features');
        showLoginModal();
        return;
    }
    
    // Check if user is admin
    if (!isAdmin()) {
        alert('Admin access required. Please login with admin credentials:\n\nEmail: admin@awe.com\nPassword: admin123');
        showLoginModal();
        return;
    }
    
    const mainContent = document.getElementById('mainContent');
    const orderHistory = document.getElementById('orderHistory');
    const productDetail = document.getElementById('productDetail');
    const adminSection = document.getElementById('adminSection');
    
    if (!adminSection) {
        console.error('Admin section not found');
        return;
    }
    
    // Hide other sections
    if (mainContent) mainContent.style.display = 'none';
    if (orderHistory) orderHistory.classList.remove('active');
    if (productDetail) productDetail.classList.remove('active');
    
    // Show admin section
    adminSection.classList.add('active');
    adminSection.style.display = 'block';
    
    showAdminTab('overview');
    window.scrollTo(0, 0);
    
    console.log('Admin section should now be visible');
}

// Enhanced admin tab functionality from working project.html
function showAdminTab(tab) {
    console.log('showAdminTab called with:', tab);
    
    if (!isAdmin()) {
        alert('Admin access required');
        return;
    }
    
    // Update active tab
    document.querySelectorAll('.admin-nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find the clicked tab and make it active
    const clickedTab = Array.from(document.querySelectorAll('.admin-nav-item')).find(btn => btn.textContent.toLowerCase().includes(tab));
    if (clickedTab) clickedTab.classList.add('active');
    
    const adminContent = document.getElementById('adminContent');
    if (!adminContent) {
        console.error('Admin content container not found');
        return;
    }
    
    switch(tab) {
        case 'overview':
            const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
            const totalOrders = orders.length;
            const totalProducts = typeof products !== 'undefined' ? products.length : 0;
            const lowStock = typeof products !== 'undefined' ? products.filter(p => p.stock < 10).length : 0;
            const pendingOrders = orders.filter(o => o.status === 'processing').length;
            
            adminContent.innerHTML = `
                <h3>Dashboard Overview</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${totalRevenue.toFixed(2)}</div>
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
                                            <div style="font-weight: bold; color: var(--secondary-color);">${order.total.toFixed(2)}</div>
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
                            ${typeof products !== 'undefined' ? products.filter(p => p.stock < 10).map(product => `
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
                            `).join('') : ''} 
                            ${typeof products === 'undefined' || products.filter(p => p.stock < 10).length === 0 ? '<p style="color: var(--text-light); text-align: center; padding: 20px;">All products are well stocked</p>' : ''}
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
                    ${generateOrdersList(orders)}
                </div>
            `;
            break;
            
        case 'inventory':
            if (typeof products === 'undefined') {
                adminContent.innerHTML = `
                    <h3>Inventory Management</h3>
                    <div style="background: #fee2e2; color: #991b1b; padding: 20px; border-radius: 5px;">
                        ⚠️ Products data not loaded. Please ensure products.js is loaded properly.
                    </div>
                `;
                return;
            }

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

function showOverviewTab(adminContent) {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalProducts = typeof products !== 'undefined' ? products.length : 0;
    const lowStock = typeof getLowStockProducts === 'function' ? getLowStockProducts().length : 0;
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
        
        <div style="margin-top: 30px;">
            <h4>System Status</h4>
            <div style="background: white; padding: 20px; border-radius: 5px; margin-top: 10px;">
                <p><strong>Current User:</strong> ${currentUser ? currentUser.email : 'Not logged in'}</p>
                <p><strong>Admin Status:</strong> ${isAdmin() ? '✅ Verified Admin' : '❌ Not Admin'}</p>
                <p><strong>Products Loaded:</strong> ${totalProducts} items</p>
                <p><strong>Orders System:</strong> ${typeof orders !== 'undefined' ? '✅ Active' : '❌ Not loaded'}</p>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px;">
            <div>
                <h3>Recent Orders</h3>
                <div style="margin-top: 15px; max-height: 300px; overflow-y: auto;">
                    ${orders.length > 0 ? orders.slice(-5).reverse().map(order => `
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
                    `).join('') : '<p style="color: var(--text-light); text-align: center; padding: 20px;">No orders yet</p>'}
                </div>
            </div>
            
            <div>
                <h3>Quick Actions</h3>
                <div style="margin-top: 15px;">
                    <button onclick="testAdminFunction()" style="width: 100%; padding: 10px; margin-bottom: 10px; background: var(--secondary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Test Admin Function
                    </button>
                    <button onclick="showAdminTab('inventory')" style="width: 100%; padding: 10px; margin-bottom: 10px; background: var(--success-color); color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Manage Inventory
                    </button>
                    <button onclick="showAdminTab('orders')" style="width: 100%; padding: 10px; background: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">
                        View All Orders
                    </button>
                </div>
            </div>
        </div>
    `;
}

function showOrdersTab(adminContent) {
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
            ${generateOrdersList(orders)}
        </div>
    `;
}

function showInventoryTab(adminContent) {
    if (typeof products === 'undefined') {
        adminContent.innerHTML = `
            <h3>Inventory Management</h3>
            <div style="background: #fee2e2; color: #991b1b; padding: 20px; border-radius: 5px;">
                ⚠️ Products data not loaded. Please ensure products.js is loaded properly.
            </div>
        `;
        return;
    }

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
                            <td style="padding: 15px; font-weight: 600;">$${product.price.toFixed(2)}</td>
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
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function showReportsTab(adminContent) {
    const monthlyRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = orders.length > 0 ? monthlyRevenue / orders.length : 0;
    const totalCustomers = [...new Set(orders.map(order => order.customer))].length;
    
    adminContent.innerHTML = `
        <h3>Sales Reports & Analytics</h3>
        <div class="stats-grid" style="margin-bottom: 30px;">
            <div class="stat-card">
                <div class="stat-number">$${monthlyRevenue.toFixed(2)}</div>
                <div class="stat-label">Total Revenue</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">$${avgOrderValue.toFixed(2)}</div>
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
    `;
}

// Helper functions
function generateOrdersList(ordersList) {
    if (ordersList.length === 0) {
        return '<p style="text-align: center; padding: 40px; color: var(--text-light);">No orders found</p>';
    }
    
    return ordersList.slice().reverse().map(order => `
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
                            ${item.name} × ${item.quantity} ($${(item.price * item.quantity).toFixed(2)})
                        </div>
                    `).join('')}
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 20px; font-weight: bold; color: var(--secondary-color);">$${order.total.toFixed(2)}</div>
                    <div class="order-status ${order.status}" style="margin-top: 5px;">${order.status}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Test function
function testAdminFunction() {
    alert('Admin function is working! ✅\n\nAll admin features are properly loaded and accessible.');
    console.log('Admin test successful');
}

// Stock management functions
function updateStock(productId) {
    if (typeof getProductById !== 'function') {
        alert('Product management functions not loaded');
        return;
    }
    
    const stockInput = document.getElementById(`stock-${productId}`);
    if (!stockInput) {
        console.error('Stock input not found for product:', productId);
        return;
    }
    
    const additionalStock = parseInt(stockInput.value) || 0;
    
    if (additionalStock <= 0) {
        alert('Please enter a valid quantity to add');
        return;
    }
    
    const product = getProductById(productId);
    if (product) {
        product.stock += additionalStock;
        if (typeof showNotification === 'function') {
            showNotification(`Added ${additionalStock} units to ${product.name}. New stock: ${product.stock}`);
        }
        showAdminTab('inventory');
    }
}

function bulkRestockProducts() {
    if (typeof products === 'undefined') {
        alert('Products data not loaded');
        return;
    }
    
    const restockAmount = prompt('Enter the number of units to add to ALL products:', '25');
    
    if (restockAmount === null) return;
    
    const amount = parseInt(restockAmount);
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid number');
        return;
    }
    
    products.forEach(product => {
        product.stock += amount;
    });
    
    if (typeof showNotification === 'function') {
        showNotification(`Added ${amount} units to all products successfully!`);
    }
    showAdminTab('inventory');
}

function filterOrdersByStatus() {
    const filter = document.getElementById('orderStatusFilter').value;
    const ordersList = document.getElementById('adminOrdersList');
    
    if (!ordersList) {
        console.error('Admin orders list not found');
        return;
    }
    
    const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.status === filter);
    ordersList.innerHTML = generateOrdersList(filteredOrders);
}

// Add these functions to your admin.js file

// Export Sales Report to CSV
function exportReportToCSV() {
    if (!isAdmin()) {
        alert('Admin access required');
        return;
    }
    
    if (orders.length === 0) {
        alert('No orders to export');
        return;
    }
    
    // Create CSV headers
    const headers = ['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Status'];
    
    // Create CSV rows
    const csvRows = [headers.join(',')];
    
    orders.forEach(order => {
        const itemsText = order.items.map(item => `${item.name} x${item.quantity}`).join('; ');
        const row = [
            order.id,
            order.date,
            order.customer,
            `"${itemsText}"`, // Wrap in quotes to handle commas
            order.total.toFixed(2),
            order.status
        ];
        csvRows.push(row.join(','));
    });
    
    // Create and download CSV
    const csvContent = csvRows.join('\n');
    downloadCSV(csvContent, 'sales-report.csv');
    
    showNotification('Sales report exported successfully!');
}

// Export Inventory to CSV
function exportInventoryToCSV() {
    if (!isAdmin()) {
        alert('Admin access required');
        return;
    }
    
    if (typeof products === 'undefined' || products.length === 0) {
        alert('No products to export');
        return;
    }
    
    // Create CSV headers
    const headers = ['Product ID', 'Name', 'Category', 'Price', 'Stock', 'Status'];
    
    // Create CSV rows
    const csvRows = [headers.join(',')];
    
    products.forEach(product => {
        const status = product.stock === 0 ? 'Out of Stock' : 
                      product.stock < 10 ? 'Low Stock' : 'In Stock';
        
        const row = [
            product.id,
            `"${product.name}"`, // Wrap in quotes to handle commas
            product.category,
            product.price.toFixed(2),
            product.stock,
            status
        ];
        csvRows.push(row.join(','));
    });
    
    // Create and download CSV
    const csvContent = csvRows.join('\n');
    downloadCSV(csvContent, 'inventory-report.csv');
    
    showNotification('Inventory report exported successfully!');
}

// Helper function to download CSV
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        // Modern browsers
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(url), 100);
    } else {
        // Fallback for older browsers
        const csvData = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
        const link = document.createElement('a');
        link.href = csvData;
        link.download = filename;
        link.click();
    }
}

// Enhanced export with date range (optional enhancement)
function exportReportWithDateRange() {
    if (!isAdmin()) {
        alert('Admin access required');
        return;
    }
    
    const startDate = prompt('Enter start date (YYYY-MM-DD) or leave empty for all:');
    const endDate = prompt('Enter end date (YYYY-MM-DD) or leave empty for all:');
    
    let filteredOrders = orders;
    
    if (startDate || endDate) {
        filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.date);
            const start = startDate ? new Date(startDate) : new Date('1900-01-01');
            const end = endDate ? new Date(endDate) : new Date('2099-12-31');
            
            return orderDate >= start && orderDate <= end;
        });
    }
    
    if (filteredOrders.length === 0) {
        alert('No orders found in the specified date range');
        return;
    }
    
    // Create CSV headers
    const headers = ['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Status'];
    const csvRows = [headers.join(',')];
    
    filteredOrders.forEach(order => {
        const itemsText = order.items.map(item => `${item.name} x${item.quantity}`).join('; ');
        const row = [
            order.id,
            order.date,
            order.customer,
            `"${itemsText}"`,
            order.total.toFixed(2),
            order.status
        ];
        csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const filename = `sales-report-${startDate || 'all'}-to-${endDate || 'all'}.csv`;
    downloadCSV(csvContent, filename);
    
    showNotification(`Exported ${filteredOrders.length} orders successfully!`);
}

// Export detailed inventory with additional metrics
function exportDetailedInventory() {
    if (!isAdmin()) {
        alert('Admin access required');
        return;
    }
    
    if (typeof products === 'undefined' || products.length === 0) {
        alert('No products to export');
        return;
    }
    
    // Create detailed CSV headers
    const headers = [
        'Product ID', 'Name', 'Category', 'Price', 'Current Stock', 
        'Stock Status', 'Total Value', 'Description'
    ];
    
    const csvRows = [headers.join(',')];
    
    products.forEach(product => {
        const status = product.stock === 0 ? 'Out of Stock' : 
                      product.stock < 10 ? 'Low Stock' : 'In Stock';
        const totalValue = (product.price * product.stock).toFixed(2);
        
        const row = [
            product.id,
            `"${product.name}"`,
            product.category,
            product.price.toFixed(2),
            product.stock,
            status,
            totalValue,
            `"${product.description || 'No description available'}"`
        ];
        csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    downloadCSV(csvContent, 'detailed-inventory-report.csv');
    
    showNotification('Detailed inventory report exported successfully!');
}

// Enhanced Reports Tab HTML (replace the reports case in showAdminTab function)
function getEnhancedReportsHTML() {
    const monthlyRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = orders.length > 0 ? monthlyRevenue / orders.length : 0;
    const totalCustomers = [...new Set(orders.map(order => order.customer))].length;
    
    return `
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
        
        <div style="background: white; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
            <h4 style="margin-bottom: 20px; color: var(--text-dark);">📊 Sales Reports</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <button onclick="exportReportToCSV()" style="padding: 12px 20px; background: var(--secondary-color); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 500;">
                    📄 Basic Sales Report
                </button>
                <button onclick="exportReportWithDateRange()" style="padding: 12px 20px; background: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 500;">
                    📅 Date Range Report
                </button>
            </div>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 10px;">
            <h4 style="margin-bottom: 20px; color: var(--text-dark);">📦 Inventory Reports</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <button onclick="exportInventoryToCSV()" style="padding: 12px 20px; background: var(--success-color); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 500;">
                    📋 Basic Inventory
                </button>
                <button onclick="exportDetailedInventory()" style="padding: 12px 20px; background: var(--accent-color); color: var(--primary-color); border: none; border-radius: 5px; cursor: pointer; font-weight: 500;">
                    📊 Detailed Inventory
                </button>
            </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #f0f8ff; border-radius: 5px; border-left: 4px solid var(--secondary-color);">
            <p style="margin: 0; color: var(--text-dark); font-size: 14px;">
                💡 <strong>Tip:</strong> CSV files will automatically download to your Downloads folder and can be opened in Excel, Google Sheets, or any spreadsheet application.
            </p>
        </div>
    `;
}