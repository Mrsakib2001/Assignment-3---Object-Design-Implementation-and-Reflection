// Authentication functionality extracted from working project.html

let currentUser = null;
let isRegisterMode = false;

// Admin credentials
const ADMIN_CREDENTIALS = {
    email: 'admin@awe.com',
    password: 'admin123'
};

// Show login modal
function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.add('active');
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
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
    
    if (!modalTitle || !authSubmitBtn || !authToggleText || !authToggleLink || !nameGroup || !phoneGroup || !adminHint) {
        console.error('Auth form elements not found');
        return;
    }
    
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
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    
    if (!emailInput || !passwordInput) {
        console.error('Auth form inputs not found');
        return;
    }
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (isRegisterMode) {
        const name = nameInput ? nameInput.value : '';
        const phone = phoneInput ? phoneInput.value : '';
        
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
    
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.reset();
    }
}

// Check login status
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            updateUserUI();
        } catch (error) {
            console.error('Error parsing saved user:', error);
            localStorage.removeItem('currentUser');
        }
    }
}

// Update user UI
function updateUserUI() {
    const welcomeUser = document.getElementById('welcomeUser');
    const loginBtn = document.getElementById('loginBtn');
    
    if (!welcomeUser || !loginBtn) {
        console.error('User UI elements not found');
        return;
    }
    
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

// Check if user is admin
function isAdmin() {
    return currentUser && currentUser.isAdmin === true;
}

// Check if user is logged in
function isLoggedIn() {
    return currentUser !== null;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Require login
function requireLogin(callback, message = 'Please login to continue') {
    if (!isLoggedIn()) {
        alert(message);
        showLoginModal();
        return false;
    }
    
    if (typeof callback === 'function') {
        callback();
    }
    return true;
}

// Require admin access
function requireAdmin(callback, message = 'Admin access required') {
    if (!isAdmin()) {
        alert(message);
        return false;
    }
    
    if (typeof callback === 'function') {
        callback();
    }
    return true;
}

// Initialize auth
function initAuth() {
    checkLoginStatus();
    
    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            const modalId = event.target.id;
            if (modalId) {
                closeModal(modalId);
            }
        }
        
        if (event.target.classList.contains('modal-close')) {
            const modal = event.target.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
}