// public/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavClose = document.getElementById('mobileNavClose');
    
    // Show mobile nav toggle on mobile
    function checkMobile() {
        if (window.innerWidth <= 768) {
            mobileNavToggle.style.display = 'block';
        } else {
            mobileNavToggle.style.display = 'none';
            mobileNav.classList.remove('active');
        }
    }
    
    // Check on load and resize
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Toggle mobile nav
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNav.classList.add('active');
        });
    }
    
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
    }
    
    // Close mobile nav when clicking on a link
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
    });
    
    // Collections dropdown functionality
    const collectionsContainer = document.querySelector('.collections-menu-container');
    const collectionsDropdown = document.querySelector('.collections-dropdown');
    
    if (collectionsContainer && collectionsDropdown) {
        // Show dropdown on hover
        collectionsContainer.addEventListener('mouseenter', () => {
            collectionsDropdown.classList.add('active');
        });
        
        // Hide dropdown when mouse leaves the entire container (only if not clicked)
        collectionsContainer.addEventListener('mouseleave', () => {
            if (!collectionsContainer.classList.contains('clicked')) {
                collectionsDropdown.classList.remove('active');
            }
        });
        
        // Prevent dropdown from closing when hovering over the dropdown itself
        collectionsDropdown.addEventListener('mouseenter', () => {
            collectionsDropdown.classList.add('active');
        });
        
        // Toggle dropdown on click
        const collectionsLink = collectionsContainer.querySelector('.nav-link');
        if (collectionsLink) {
            collectionsLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle clicked state
                collectionsContainer.classList.toggle('clicked');
                
                // Toggle dropdown visibility
                if (collectionsContainer.classList.contains('clicked')) {
                    collectionsDropdown.classList.add('active');
                } else {
                    collectionsDropdown.classList.remove('active');
                }
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!collectionsContainer.contains(e.target)) {
                collectionsDropdown.classList.remove('active');
                collectionsContainer.classList.remove('clicked');
            }
        });
    }

    // Coming Soon shake effect and sound
    const comingSoonBoxes = document.querySelectorAll('.collection-box');
    comingSoonBoxes.forEach(box => {
        const title = box.querySelector('.collection-title');
        if (title && title.textContent.includes('COMING SOON')) {
            box.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Add shake animation
                box.classList.add('shake');
                
                // Play error sound (using Web Audio API)
                playErrorSound();
                
                // Remove shake class after animation completes
                setTimeout(() => {
                    box.classList.remove('shake');
                }, 500);
            });
        }
    });

    // Function to play error sound
    function playErrorSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(100, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Audio not supported or blocked');
        }
    }

    // Logic for the product detail page
    if (document.querySelector('.product-container')) {
        let selectedVariantId = null;

        const sizeButtons = document.querySelectorAll('.size-btn');
        sizeButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                sizeButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to the clicked button
                button.classList.add('active');
                selectedVariantId = button.dataset.variantId;
            });
        });

        const orderBtn = document.getElementById('orderBtn');
        const statusEl = document.getElementById('orderStatus');

        orderBtn.addEventListener('click', () => {
            if (!selectedVariantId) {
                statusEl.textContent = 'Please select a size.';
                statusEl.style.color = 'yellow';
                return;
            }
            
            const quantity = document.getElementById('quantity').value;
            
            // This is a placeholder. A real app would open a modal or go to a checkout page
            // to collect customer details (name, email, address).
            const customerDetails = {
                name: 'Test Customer',
                email: 'test@example.com',
                phone: '123456789',
                address: '123 Test Street'
            };

            const orderData = {
                ...customerDetails,
                variant_id: selectedVariantId,
                quantity: parseInt(quantity)
            };

            statusEl.textContent = 'Placing order...';
            statusEl.style.color = 'white';

            fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    statusEl.textContent = `Success! Your Order ID is ${data.orderId}.`;
                    statusEl.style.color = 'lightgreen';
                } else {
                    statusEl.textContent = `Error: ${data.message}`;
                    statusEl.style.color = 'red';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                statusEl.textContent = 'An unexpected error occurred.';
                statusEl.style.color = 'red';
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
  const products = [
    {
      id: 1,
      name: 'Canvas Tee',
      price: '69.90',
      image: '/images/shirt_front.png',
      url: '/products/1',
      keywords: ['tee', 't shirt', 'shirt', 'canvas', 'bnd', 'black', 't', 'tshirt']
    },
    {
      id: 2,
      name: 'Canvas Boxy Pullover Hoodie',
      price: '99.90',
      image: '/images/hoodie_front.png',
      url: '/products/2',
      keywords: ['hoodie', 'pullover', 'boxy', 'canvas', 'bnd', 'black', 'fleece']
    }
  ];

  const searchBox = document.getElementById('searchBox');
  const dropdown = document.getElementById('searchDropdown');

  if (searchBox && dropdown) {
    searchBox.addEventListener('input', function() {
      const query = searchBox.value.trim().toLowerCase();
      if (query.length === 0) {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        return;
      }
      // Match if any keyword or name contains any word from the query
      const queryWords = query.split(/\s+/);
      const filtered = products.filter(product =>
        queryWords.some(word =>
          product.name.toLowerCase().includes(word) ||
          product.keywords.some(k => k.includes(word))
        )
      );
      if (filtered.length === 0) {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        return;
      }
      dropdown.innerHTML = filtered.map(product => `
        <div class="search-suggestion" tabindex="0" data-url="${product.url}">
          <img src="${product.image}" class="suggestion-img" alt="${product.name}" />
          <div class="suggestion-info">
            <div class="suggestion-title">${product.name}</div>
            <div class="suggestion-price">RM ${product.price}</div>
          </div>
        </div>
      `).join('');
      dropdown.classList.add('active');
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target) && e.target !== searchBox) {
        dropdown.classList.remove('active');
      }
    });

    // Keyboard and click navigation
    dropdown.addEventListener('mousedown', function(e) {
      const target = e.target.closest('.search-suggestion');
      if (target && target.dataset.url) {
        window.location.href = target.dataset.url;
      }
    });
    dropdown.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const target = document.activeElement;
        if (target.classList.contains('search-suggestion') && target.dataset.url) {
          window.location.href = target.dataset.url;
        }
      }
    });
  }
});

// Cart functionality
class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
    this.isOpen = false; // Track cart open state
    this.init();  
    // Ensure cart starts closed
    const cartDropdown = document.getElementById('cartDropdown');
    if (cartDropdown) {
      cartDropdown.classList.remove('active');
      cartDropdown.style.display = 'none';
    }
  }

  init() {
    this.updateCartCount();
    this.setupEventListeners();
    this.renderCart();
  }

  setupEventListeners() {
    const cartIcon = document.getElementById('cartIcon');
    const cartDropdown = document.getElementById('cartDropdown');
    const closeCart = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    // Remove customerInfoForm logic

    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
        this.toggleCart();
      });
    }

    if (closeCart) {
      closeCart.addEventListener('click', () => {
        this.closeCart();
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/checkout';
      });
    }

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.cart-container')) {
        this.closeCart();
      }
    });
  }

  toggleCart() {
    this.isOpen = !this.isOpen;
    const cartDropdown = document.getElementById('cartDropdown');
    if (cartDropdown) {
      if (this.isOpen) {
        cartDropdown.classList.add('active');
      } else {
        cartDropdown.classList.remove('active');
      }
    }
  }

  openCart() {
    this.isOpen = true;
    const cartDropdown = document.getElementById('cartDropdown');
    if (cartDropdown) {
      cartDropdown.classList.add('active');
    }
  }

  closeCart() {
    this.isOpen = false;
    const cartDropdown = document.getElementById('cartDropdown');
    if (cartDropdown) {
      cartDropdown.classList.remove('active');
    }
  }

  addItem(product) {
    // Find the total stock for this variant from the DOM (if available)
    const stockBtn = document.querySelector(`[data-variant-id="${product.variantId}"]`);
    const totalStock = stockBtn ? parseInt(stockBtn.dataset.stockQuantity || '0') : 0;
    const existingItem = this.items.find(item => 
      item.variantId === product.variantId && item.size === product.size
    );
    if (existingItem) {
      // Increment, but do not exceed stock
      const newQty = existingItem.quantity + product.quantity;
      if (totalStock > 0 && newQty > totalStock) {
        existingItem.quantity = totalStock;
        alert(`Cannot add more than available in stock for this size.`);
      } else {
        existingItem.quantity = newQty;
      }
    } else {
      // Do not add more than stock
      if (totalStock > 0 && product.quantity > totalStock) {
        product.quantity = totalStock;
        alert(`Cannot add more than available in stock for this size.`);
      }
      this.items.push(product);
    }
    this.saveCart();
    this.updateCartCount();
    this.renderCart();
    this.showAddToCartMessage();
    if (typeof initializeStockValidation === 'function') {
      initializeStockValidation();
    }
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.saveCart();
    this.updateCartCount();
    this.renderCart();
    
    // Refresh stock validation on product detail pages
    if (typeof initializeStockValidation === 'function') {
      initializeStockValidation();
    }
  }

  updateQuantity(index, newQuantity) {
    const item = this.items[index];
    // Find the total stock for this variant from the DOM (if available)
    const stockBtn = document.querySelector(`[data-variant-id="${item.variantId}"]`);
    const totalStock = stockBtn ? parseInt(stockBtn.dataset.stockQuantity || '0') : 0;
    if (newQuantity > totalStock) {
      alert(`Cannot set quantity higher than ${totalStock} in stock for this size.`);
      return;
    }
    if (newQuantity > 0) {
      this.items[index].quantity = newQuantity;
    } else {
      this.removeItem(index);
      return;
    }
    this.saveCart();
    this.updateCartCount();
    this.renderCart();
    // Refresh stock validation on product detail pages
    if (typeof initializeStockValidation === 'function') {
      initializeStockValidation();
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }

  renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (!cartItems) return;

    if (this.items.length === 0) {
      cartItems.innerHTML = '<div class="cart-empty"><p>Your cart is empty</p></div>';
      if (cartTotal) cartTotal.textContent = 'RM 0.00';
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    cartItems.innerHTML = this.items.map((item, index) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-size">Size: ${item.size}</div>
          <div class="cart-item-price">RM ${item.price.toFixed(2)}</div>
        </div>
        <div class="cart-item-quantity">
          <button class="quantity-btn" onclick="cart.updateQuantity(${index}, ${item.quantity - 1})">-</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" onclick="cart.updateQuantity(${index}, ${item.quantity + 1})">+</button>
        </div>
        <button class="remove-item" onclick="cart.removeItem(${index})">&times;</button>
      </div>
    `).join('');

    if (cartTotal) cartTotal.textContent = `RM ${this.getTotal().toFixed(2)}`;
    if (checkoutBtn) checkoutBtn.disabled = false;

    // Hide customer info form and show cart footer on render
    const customerInfoForm = document.getElementById('customerInfoForm');
    const cartFooter = document.querySelector('.cart-footer');
    if (customerInfoForm) customerInfoForm.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  showAddToCartMessage() {
    // Create a temporary success message
    const message = document.createElement('div');
    message.textContent = 'Added to cart!';
    message.style.cssText = `
      position: fixed;
      left: 50%;
      bottom: 40px;
      transform: translateX(-50%);
      background: #4CAF50;
      color: white;
      padding: 14px 32px;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 600;
      font-size: 1.1rem;
      box-shadow: 0 4px 24px rgba(0,0,0,0.18);
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(message);

    setTimeout(() => {
      message.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(message);
      }, 300);
    }, 2000);
  }

  checkout() {
    if (this.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // For now, just show an alert with the total
    const total = this.getTotal().toFixed(2);
    alert(`Checkout functionality coming soon! Total: RM ${total}`);
    
    // In a real implementation, this would redirect to a checkout page
    // or open a payment modal
  }

  clear() {
    this.items = [];
    this.saveCart();
    this.updateCartCount();
    this.renderCart();
  }
}

// Initialize cart
let cart;
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize cart if cart elements exist
  const cartIcon = document.getElementById('cartIcon');
  const cartDropdown = document.getElementById('cartDropdown');
  
  if (cartIcon && cartDropdown) {
    cart = new Cart();
    
    // Ensure cart starts closed
    cartDropdown.classList.remove('active');
    cartDropdown.style.display = 'none';
  }
});

// Add to cart function for product pages
function addToCart(productData) {
  if (!cart) {
    cart = new Cart();
  }
  const selectedSize = document.querySelector('.size-btn.active');
  if (!selectedSize) {
    alert('Please select a size');
    return;
  }
  const quantityInput = document.getElementById('quantity-number');
  const quantity = parseInt(quantityInput.textContent);
  const variantId = selectedSize.dataset.variantId;
  const stockBtn = document.querySelector(`[data-variant-id="${variantId}"]`);
  const totalStock = stockBtn ? parseInt(stockBtn.dataset.stockQuantity || '0') : 0;
  // Calculate how many are already in cart for this variant
  const cartItem = cart.items.find(item => item.variantId === variantId && item.size === selectedSize.dataset.size);
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  const availableStock = Math.max(0, totalStock - cartQuantity);
  if (quantity > availableStock) {
    alert('Cannot add more than available in stock for this size (including what is already in your cart).');
    return;
  }
  // Always increment in cart, but never exceed stock
  const product = {
    id: productData.id,
    name: productData.name,
    price: productData.price,
    image: productData.image,
    size: selectedSize.dataset.size,
    variantId: variantId,
    quantity: quantity
  };
  cart.addItem(product);
  quantityInput.textContent = '1';
  if (typeof initializeStockValidation === 'function') {
    initializeStockValidation();
    updateQuantityButtonsState(1, totalStock - Math.min(totalStock, (cartQuantity + quantity)));
  }
}

// Buy Now function for product pages
function buyNow(productData) {
  const selectedSize = document.querySelector('.size-btn.active');
  if (!selectedSize) {
    alert('Please select a size');
    return;
  }
  const quantity = parseInt(document.getElementById('quantity-number').textContent);
  const product = {
    id: productData.id,
    name: productData.name,
    price: productData.price,
    image: productData.image,
    size: selectedSize.dataset.size,
    variantId: selectedSize.dataset.variantId,
    quantity: quantity
  };
  // Overwrite cart with just this product
  localStorage.setItem('cart', JSON.stringify([product]));
  window.location.href = '/checkout';
}

// Stock validation for product detail pages
function initializeStockValidation() {
  const sizeBtns = document.querySelectorAll('.size-btn');
  const quantityInput = document.getElementById('quantity-number');
  const quantityMinus = document.getElementById('quantity-minus');
  const quantityPlus = document.getElementById('quantity-plus');
  if (sizeBtns.length > 0 && quantityInput) {
    let currentVariantId = null;
    let maxStock = 0;
    const cart = window.cart || new Cart();
    function getAvailableStock(variantId) {
      const stockQuantity = parseInt(document.querySelector(`[data-variant-id="${variantId}"]`).dataset.stockQuantity || 0);
      const cartItem = cart.items.find(item => item.variantId === variantId);
      const cartQuantity = cartItem ? cartItem.quantity : 0;
      return Math.max(0, stockQuantity - cartQuantity);
    }
    // Disable out-of-stock sizes and auto-select first in-stock
    let firstInStockBtn = null;
    sizeBtns.forEach(btn => {
      const variantId = btn.dataset.variantId;
      const availableStock = getAvailableStock(variantId);
      btn.disabled = availableStock === 0;
      btn.style.opacity = availableStock === 0 ? '0.5' : '1';
      if (!firstInStockBtn && availableStock > 0) firstInStockBtn = btn;
    });
    // Auto-select first in-stock size if none selected
    if (!document.querySelector('.size-btn.active') && firstInStockBtn) {
      firstInStockBtn.classList.add('active');
      currentVariantId = firstInStockBtn.dataset.variantId;
      maxStock = getAvailableStock(currentVariantId);
      quantityInput.textContent = '1';
      updateQuantityButtonsState(1, maxStock);
      const addToCartBtn = document.getElementById('orderBtn');
      if (addToCartBtn) {
        addToCartBtn.disabled = maxStock === 0;
        addToCartBtn.style.opacity = maxStock === 0 ? '0.5' : '1';
      }
      showStockInfoWithCart(maxStock, currentVariantId);
    }
    sizeBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        sizeBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const variantId = this.dataset.variantId;
        const availableStock = getAvailableStock(variantId);
        currentVariantId = variantId;
        maxStock = availableStock;
        quantityInput.textContent = '1';
        updateQuantityButtonsState(1, availableStock);
        const addToCartBtn = document.getElementById('orderBtn');
        if (addToCartBtn) {
          addToCartBtn.disabled = availableStock === 0;
          addToCartBtn.style.opacity = availableStock === 0 ? '0.5' : '1';
        }
        showStockInfoWithCart(availableStock, variantId);
      });
    });
    if (quantityMinus && quantityPlus) {
      quantityMinus.replaceWith(quantityMinus.cloneNode(true));
      quantityPlus.replaceWith(quantityPlus.cloneNode(true));
      const newQuantityMinus = document.getElementById('quantity-minus');
      const newQuantityPlus = document.getElementById('quantity-plus');
      newQuantityMinus.addEventListener('click', () => {
        let currentQty = parseInt(quantityInput.textContent);
        if (isNaN(currentQty) || currentQty < 1) currentQty = 1;
        if (currentQty > 1) {
          quantityInput.textContent = (currentQty - 1).toString();
          updateQuantityButtonsState(currentQty - 1, maxStock);
        }
      });
      newQuantityPlus.addEventListener('click', () => {
        let currentQty = parseInt(quantityInput.textContent);
        if (isNaN(currentQty) || currentQty < 1) currentQty = 1;
        if (currentQty < maxStock) {
          quantityInput.textContent = (currentQty + 1).toString();
          updateQuantityButtonsState(currentQty + 1, maxStock);
        }
      });
    }
  }
}

function updateQuantityButtonsState(currentQty, maxStock) {
  const quantityMinus = document.getElementById('quantity-minus');
  const quantityPlus = document.getElementById('quantity-plus');
  
  if (quantityMinus) {
    quantityMinus.disabled = currentQty <= 1;
    quantityMinus.style.opacity = currentQty <= 1 ? '0.5' : '1';
  }
  
  if (quantityPlus) {
    quantityPlus.disabled = currentQty >= maxStock;
    quantityPlus.style.opacity = currentQty >= maxStock ? '0.5' : '1';
  }
}

function showStockInfo(stockQuantity) {
  // Remove existing stock info
  const existingInfo = document.querySelector('.stock-info');
  if (existingInfo) {
    existingInfo.remove();
  }
  
  // Create stock info element
  const stockInfo = document.createElement('div');
  stockInfo.className = 'stock-info';
  stockInfo.style.cssText = `
    margin-top: 10px;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
  `;
  
  if (stockQuantity > 10) {
    stockInfo.style.background = '#1a3a1a';
    stockInfo.style.color = '#4ade80';
    stockInfo.textContent = `✓ In Stock (${stockQuantity} available)`;
  } else if (stockQuantity > 0) {
    stockInfo.style.background = '#3a2a1a';
    stockInfo.style.color = '#fbbf24';
    stockInfo.textContent = `⚠ Low Stock (${stockQuantity} available)`;
  } else {
    stockInfo.style.background = '#3a1a1a';
    stockInfo.style.color = '#f87171';
    stockInfo.textContent = '✗ Out of Stock';
  }
  
  // Insert after quantity box
  const quantityBox = document.querySelector('.quantity-box');
  if (quantityBox) {
    quantityBox.parentNode.insertBefore(stockInfo, quantityBox.nextSibling);
  }
}

function showStockInfoWithCart(availableStock, variantId) {
  // Remove existing stock info
  const existingInfo = document.querySelector('.stock-info');
  if (existingInfo) {
    existingInfo.remove();
  }
  // Only show out of stock if 0, otherwise show nothing
  if (availableStock === 0) {
    const stockInfo = document.createElement('div');
    stockInfo.className = 'stock-info';
    stockInfo.style.cssText = `
      margin-top: 10px;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      background: #3a1a1a;
      color: #f87171;
    `;
    stockInfo.textContent = '✗ Out of Stock';
    const quantityBox = document.querySelector('.quantity-box');
    if (quantityBox) {
      quantityBox.parentNode.insertBefore(stockInfo, quantityBox.nextSibling);
    }
  }
}