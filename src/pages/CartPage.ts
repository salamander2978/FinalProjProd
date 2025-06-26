import { BasePage } from './BasePage';
import { type Cart } from '../services/CartService';

export class CartPage extends BasePage {
  private cart: Cart | null = null;

  constructor(app: any) {
    super(app);
  }

  async render(container: HTMLElement): Promise<void> {
    container.innerHTML = `
      ${this.createHeader()}
      <main class="main">
        <div class="container">
          <div class="cart-page">
            <h1 class="cart-page__title">Shopping Cart</h1>
            <div class="cart-content" id="cart-content">
              <div class="loading">Loading cart...</div>
            </div>
          </div>
        </div>
      </main>
      ${this.createSubscribeBanner()}
    `;

    this.setupSubscribeBanner();
    this.setupNavigation();
    await this.loadCart();
  }

  private async loadCart(): Promise<void> {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;

    try {
      this.cart = await this.app.getCartService().getCart();
      
      if (this.cart && this.cart.products.length === 0) {
        this.renderEmptyCart();
      } else {
        this.renderCart();
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      this.renderEmptyCart();
    }
  }

  private renderEmptyCart(): void {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;

    cartContent.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart__content">
          <h2>Cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <a href="/" class="btn btn--primary" data-navigo>Continue Shopping</a>
        </div>
      </div>
    `;

    this.setupNavigation();
  }

  private renderCart(): void {
    if (!this.cart) return;

    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;

    cartContent.innerHTML = `
      <div class="cart-items">
        <div class="cart-items__header">
          <span>Product</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Total</span>
          <span></span>
        </div>
        
        <div class="cart-items__list">
          ${this.cart.products.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
              <div class="cart-item__product">
                <img src="${item.thumbnail || ''}" alt="${item.title || 'Product'}" class="cart-item__image">
                <div class="cart-item__details">
                  <h3 class="cart-item__title">${item.title || 'Unknown Product'}</h3>
                  <p class="cart-item__price">$${(item.price || 0).toFixed(2)}</p>
                </div>
              </div>
              
              <div class="cart-item__price-col">
                $${(item.price || 0).toFixed(2)}
              </div>
              
              <div class="cart-item__quantity">
                <div class="quantity-controls">
                  <button class="quantity-btn" data-action="decrease" data-product-id="${item.id}">-</button>
                  <span class="quantity-value">${item.quantity || 0}</span>
                  <button class="quantity-btn" data-action="increase" data-product-id="${item.id}">+</button>
                </div>
              </div>
              
              <div class="cart-item__total">
                $${(item.total || 0).toFixed(2)}
              </div>
              
              <div class="cart-item__actions">
                <button class="cart-item__remove" data-product-id="${item.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="cart-summary">
        <div class="cart-summary__content">
          <h3>Order Summary</h3>
          
          <div class="summary-line">
            <span>Subtotal:</span>
            <span>$${(this.cart.total || 0).toFixed(2)}</span>
          </div>
          
          ${(this.cart.discountedTotal || 0) < (this.cart.total || 0) ? `
            <div class="summary-line summary-line--discount">
              <span>Discount:</span>
              <span>-$${((this.cart.total || 0) - (this.cart.discountedTotal || 0)).toFixed(2)}</span>
            </div>
          ` : ''}
          
          <div class="summary-line summary-line--total">
            <span>Total:</span>
            <span>$${(this.cart.discountedTotal || 0).toFixed(2)}</span>
          </div>
          
          <button class="btn btn--primary btn--large" id="checkout-btn">
            Go to Checkout
          </button>
        </div>
      </div>
    `;

    this.setupCartEventListeners();
  }

  private setupCartEventListeners(): void {
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    quantityBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const button = e.currentTarget as HTMLButtonElement;
        const action = button.dataset.action;
        const productId = parseInt(button.dataset.productId || '0');
        
        if (action && productId) {
          await this.updateQuantity(productId, action);
        }
      });
    });

    const removeBtns = document.querySelectorAll('.cart-item__remove');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const button = e.currentTarget as HTMLButtonElement;
        const productId = parseInt(button.dataset.productId || '0');
        
        if (productId) {
          await this.removeItem(productId);
        }
      });
    });

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        window.history.pushState({}, '', '/checkout');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }
  }

  private async updateQuantity(productId: number, action: string): Promise<void> {
    if (!this.cart) return;

    try {
      const currentProduct = this.cart.products.find(p => p.id === productId);
      if (!currentProduct) return;

      let newQuantity = currentProduct.quantity;
      if (action === 'increase') {
        newQuantity += 1;
      } else if (action === 'decrease' && newQuantity > 1) {
        newQuantity -= 1;
      } else if (action === 'decrease' && newQuantity === 1) {
        await this.removeItem(productId);
        return;
      }

      this.cart = await this.app.getCartService().updateCartItemQuantity(productId, newQuantity);
      this.renderCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }

  private async removeItem(productId: number): Promise<void> {
    if (!this.cart) return;

    try {
      this.cart = await this.app.getCartService().removeFromCart(productId);
      
      this.renderCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }
} 