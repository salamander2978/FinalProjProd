import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  private cart: any = null;

  constructor(app: any) {
    super(app);
  }

  async render(container: HTMLElement): Promise<void> {
    container.innerHTML = `
      ${this.createHeader()}
      <main class="main">
        <div class="container">
          <div class="checkout-page">
            <h1 class="checkout-page__title">Checkout</h1>
            <div class="checkout-content" id="checkout-content">
              <div class="loading">Loading checkout...</div>
            </div>
          </div>
        </div>
      </main>
    `;

    this.setupNavigation();
    await this.loadCart();
  }

  private async loadCart(): Promise<void> {
    try {
      this.cart = await this.app.getCartService().getCart();
      
      if (!this.cart || this.cart.products.length === 0) {
        window.history.pushState({}, '', '/cart');
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
      }
      
      this.renderCheckout();
    } catch (error) {
      console.error('Error loading cart:', error);
      const content = document.getElementById('checkout-content');
      if (content) {
        content.innerHTML = '<div class="error">Failed to load cart</div>';
      }
    }
  }

  private renderCheckout(): void {
    if (!this.cart) return;

    const content = document.getElementById('checkout-content');
    if (!content) return;

    content.innerHTML = `
      <div class="checkout-form-container">
        <form class="checkout-form" id="checkout-form">
          <div class="form-section">
            <h3>Personal Information</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  class="form-input"
                >
              </div>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="phone">Phone</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                placeholder="+63 739 292 7942"
                class="form-input"
              >
            </div>
          </div>
          
          <div class="form-section">
            <h3>Shipping Address</h3>
            
            <div class="form-group">
              <label for="address">Address</label>
              <input 
                type="text" 
                id="address" 
                name="address" 
                placeholder="1745 T Street Southeast"
                class="form-input"
              >
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  placeholder="Washington"
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label for="postalCode">Postal Code</label>
                <input 
                  type="text" 
                  id="postalCode" 
                  name="postalCode" 
                  placeholder="20020"
                  class="form-input"
                >
              </div>
            </div>
          </div>
          
          <button type="submit" class="btn btn--primary btn--large">
            Go to Payment
          </button>
        </form>
      </div>
      
      <div class="order-summary">
        <h3>Order Summary</h3>
        
        <div class="order-items">
          ${this.cart.products.map((item: any) => `
            <div class="order-item">
              <img src="${item.thumbnail}" alt="${item.title}" class="order-item__image">
              <div class="order-item__details">
                <h4>${item.title}</h4>
                <p>Qty: ${item.quantity}</p>
              </div>
              <div class="order-item__price">
                $${item.total.toFixed(2)}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="order-totals">
          <div class="total-line">
            <span>Subtotal:</span>
            <span>$${this.cart.total.toFixed(2)}</span>
          </div>
          
          ${this.cart.discountedTotal < this.cart.total ? `
            <div class="total-line">
              <span>Discount:</span>
              <span>-$${(this.cart.total - this.cart.discountedTotal).toFixed(2)}</span>
            </div>
          ` : ''}
          
          <div class="total-line total-line--final">
            <span>Total:</span>
            <span>$${this.cart.discountedTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;

    this.setupFormSubmit();
  }

  private setupFormSubmit(): void {
    const form = document.getElementById('checkout-form') as HTMLFormElement;
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  private handleSubmit(): void {
    window.history.pushState({}, '', '/order-confirmation');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
} 