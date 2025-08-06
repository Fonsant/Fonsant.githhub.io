// Sistema de Carrito para K'latee Joyería
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
        this.updateCartDisplay();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
        this.showNotification('Producto agregado al carrito');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
        this.showNotification('Producto removido del carrito');
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartCount();
                this.updateCartDisplay();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (cartItems) {
            if (this.items.length === 0) {
                cartItems.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío</p>';
    } else {
                cartItems.innerHTML = this.items.map(item => `
                    <div class="cart-item d-flex align-items-center justify-content-between p-3 border-bottom">
                        <div class="d-flex align-items-center">
                            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" class="me-3">
                            <div>
                                <h6 class="mb-0">${item.name}</h6>
                                <small class="text-muted">$${item.price.toLocaleString()}</small>
                            </div>
                        </div>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary me-2" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary ms-2" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            <button class="btn btn-sm btn-outline-danger ms-3" onclick="cart.removeItem('${item.id}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        if (cartTotal) {
            cartTotal.textContent = `$${this.getTotal().toLocaleString()}`;
        }
    }

    showNotification(message) {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bi bi-check-circle text-success"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Inicializar carrito
const cart = new ShoppingCart();

// Funciones globales
function addToCart(product) {
    cart.addItem(product);
}

function removeFromCart(productId) {
    cart.removeItem(productId);
}

function updateCartQuantity(productId, quantity) {
    cart.updateQuantity(productId, quantity);
}

function checkout() {
    if (cart.items.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Aquí puedes integrar con tu sistema de pagos
    const total = cart.getTotal();
    const items = cart.items.map(item => `${item.name} x${item.quantity}`).join(', ');
    
    // Simular proceso de checkout
    const message = `Procesando compra por $${total.toLocaleString()}\n\nProductos:\n${items}\n\nRedirigiendo al sistema de pagos...`;
    alert(message);
    
    // Limpiar carrito después del checkout
    cart.clearCart();
    
    // Cerrar modal
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

// Función para agregar productos desde las páginas de productos
function addProductToCart(name, price, image, id) {
    const product = {
        id: id || Date.now().toString(),
        name: name,
        price: parseFloat(price),
        image: image
    };
    cart.addItem(product);
}

// Función para filtrar productos
function filterProducts(category, priceRange) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productCategory = product.dataset.category;
        const productPrice = parseFloat(product.dataset.price);
        
        let showProduct = true;
        
        // Filtrar por categoría
        if (category && category !== 'all' && productCategory !== category) {
            showProduct = false;
        }
        
        // Filtrar por precio
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(p => parseFloat(p));
            if (productPrice < min || (max && productPrice > max)) {
                showProduct = false;
            }
        }
        
        // Mostrar/ocultar producto
        product.style.display = showProduct ? 'block' : 'none';
    });
}

// Función para ordenar productos
function sortProducts(sortBy) {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    
    const products = Array.from(productGrid.children);
    
    products.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        
        switch(sortBy) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'name':
                const nameA = a.querySelector('.product-title').textContent;
                const nameB = b.querySelector('.product-title').textContent;
                return nameA.localeCompare(nameB);
            default:
                return 0;
        }
    });
    
    // Reordenar elementos en el DOM
    products.forEach(product => productGrid.appendChild(product));
}

// Función para búsqueda de productos
function searchProducts(query) {
    const products = document.querySelectorAll('.product-card');
    const searchTerm = query.toLowerCase();
    
    products.forEach(product => {
        const title = product.querySelector('.product-title').textContent.toLowerCase();
        const description = product.querySelector('.product-description')?.textContent.toLowerCase() || '';
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Inicializar funcionalidades cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar carrito al cargar la página
    cart.updateCartDisplay();
    
    // Agregar event listeners para filtros si existen
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            const category = document.getElementById('categoryFilter')?.value || 'all';
            const priceRange = document.getElementById('priceFilter')?.value || '';
            filterProducts(category, priceRange);
        });
    });
    
    // Agregar event listener para búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchProducts(this.value);
        });
    }
    
    // Agregar event listener para ordenamiento
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
});

// Exportar para uso global
window.cart = cart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.checkout = checkout;
window.addProductToCart = addProductToCart;
window.filterProducts = filterProducts;
window.sortProducts = sortProducts;
window.searchProducts = searchProducts;