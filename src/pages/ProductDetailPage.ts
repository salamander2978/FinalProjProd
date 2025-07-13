import { BasePage } from './BasePage';
import { ApiService, type Product } from '../services/ApiService';

export class ProductDetailPage extends BasePage {
  private apiService: ApiService;
  private productId: number;
  private product: Product | null = null;
  private currentImageIndex: number = 0;

  constructor(app: any, productId: number) {
    super(app);
    this.apiService = new ApiService();
    this.productId = productId;
  }

  async render(container: HTMLElement): Promise<void> {
    container.innerHTML = `
      ${this.createHeader()}
      <main class="main">
        <div class="container">
          <div class="product-detail" id="product-detail">
            <div class="loading">Loading product...</div>
          </div>
        </div>
      </main>
      ${this.createSubscribeBanner()}
    `;

    this.setupSubscribeBanner();
    this.setupNavigation();
    await this.loadProduct();
  }

  private async loadProduct(): Promise<void> {
    try {
      console.log('Loading product with ID:', this.productId);
      this.product = await this.apiService.getProduct(this.productId);
      console.log('Product loaded:', this.product);
      this.renderProduct();
    } catch (error) {
      console.error('Error loading product:', error);
      const container = document.getElementById('product-detail');
      if (container) {
        container.innerHTML = `
          <div class="error">
            <h2>Failed to load product</h2>
            <p>Sorry, we couldn't load the product details. Please try again later.</p>
            <a href="/" class="btn btn--primary" data-navigo>Go back to home</a>
          </div>
        `;
        this.setupNavigation();
      }
    }
  }

  private renderProduct(): void {
    const productDetail = document.getElementById('product-detail');
    if (!productDetail || !this.product) return;

    const product = this.product;

    productDetail.innerHTML = `
      <div class="product-detail__content">
        <div class="product-detail__gallery">
          <div class="gallery__main">
            <img src="${product.images[this.currentImageIndex]}" alt="${product.title}" id="main-image">
          </div>
          <div class="gallery__thumbnails">
            ${product.images.map((image, index) => `
              <button class="gallery__thumbnail ${index === this.currentImageIndex ? 'gallery__thumbnail--active' : ''}" data-index="${index}">
                <img src="${image}" alt="${product.title}">
              </button>
            `).join('')}
          </div>
        </div>
        
        <div class="product-detail__info">
          <div class="product-detail__header">
            <h1 class="product-detail__title">${product.title}</h1>
            <p class="product-detail__brand">${product.brand}</p>
            <div class="product-detail__rating">
              <span class="rating">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
              <span class="rating-value">${product.rating}</span>
              <span class="rating-count">(${product.reviews.length} reviews)</span>
            </div>
          </div>
          
          <div class="product-detail__price">
            <span class="product-detail__current-price">$${product.price.toFixed(2)}</span>
            ${product.discountPercentage > 0 ? `
              <span class="product-detail__original-price">$${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}</span>
              <span class="product-detail__discount">${product.discountPercentage}% off</span>
            ` : ''}
          </div>
          
          <div class="product-detail__description">
            <h3>Description</h3>
            <p>${product.description}</p>
          </div>
          
          <div class="product-detail__details">
            <div class="detail-item">
              <span class="detail-label">Category:</span>
              <span class="detail-value">${this.formatCategoryName(product.category)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Stock:</span>
              <span class="detail-value">${product.stock} available</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">SKU:</span>
              <span class="detail-value">${product.sku}</span>
            </div>
          </div>
          
          <div class="product-detail__actions">
            <div class="quantity-selector">
              <label for="quantity">Quantity:</label>
              <div class="quantity-controls">
                <button class="quantity-btn" id="decrease-qty">-</button>
                <input type="number" id="quantity" value="1" min="1" max="${product.stock}">
                <button class="quantity-btn" id="increase-qty">+</button>
              </div>
            </div>
            
            <button class="btn btn--primary btn--large" id="add-to-cart">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      
      <div class="product-detail__reviews">
        <h3>Customer Reviews</h3>
        <div class="reviews-list">
          ${product.reviews.slice(0, 3).map(review => `
            <div class="review">
              <div class="review__header">
                <span class="review__author">${review.reviewerName}</span>
                <span class="review__rating">${'★'.repeat(Math.floor(review.rating))}${'☆'.repeat(5 - Math.floor(review.rating))}</span>
                <span class="review__date">${new Date(review.date).toLocaleDateString()}</span>
              </div>
              <p class="review__comment">${review.comment}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.setupProductEventListeners();
  }

  private setupProductEventListeners(): void {
    const thumbnails = document.querySelectorAll('.gallery__thumbnail');
    const mainImage = document.getElementById('main-image') as HTMLImageElement;

    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', (e) => {
        const button = e.currentTarget as HTMLButtonElement;
        const index = parseInt(button.dataset.index || '0');
        
        this.currentImageIndex = index;
        
        if (this.product && mainImage) {
          mainImage.src = this.product.images[index];
        }
        
        thumbnails.forEach(t => t.classList.remove('gallery__thumbnail--active'));
        button.classList.add('gallery__thumbnail--active');
      });
    });

    const quantityInput = document.getElementById('quantity') as HTMLInputElement;
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');

    if (decreaseBtn && quantityInput) {
      decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
          quantityInput.value = (currentValue - 1).toString();
        }
      });
    }

    if (increaseBtn && quantityInput && this.product) {
      increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < this.product!.stock) {
          quantityInput.value = (currentValue + 1).toString();
        }
      });
    }

    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn && quantityInput) {
      addToCartBtn.addEventListener('click', async () => {
        const quantity = parseInt(quantityInput.value);
        await this.addToCart(quantity);
      });
    }
  }

  private async addToCart(quantity: number): Promise<void> {
    if (!this.product) return;

    try {
      const addToCartBtn = document.getElementById('add-to-cart') as HTMLButtonElement;
      if (addToCartBtn) {
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Adding...';
      }

      await this.app.getCartService().addToCart(this.product.id, quantity);
      
      if (addToCartBtn) {
        addToCartBtn.textContent = 'Added to Cart!';
        setTimeout(() => {
          addToCartBtn.disabled = false;
          addToCartBtn.textContent = 'Add to Cart';
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      const addToCartBtn = document.getElementById('add-to-cart') as HTMLButtonElement;
      if (addToCartBtn) {
        addToCartBtn.disabled = false;
        addToCartBtn.textContent = 'Add to Cart';
      }
    }
  }

  private formatCategoryName(category: any): string {
    if (typeof category === 'string') {
      return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } else if (category && typeof category === 'object') {
      return category.name || String(category);
    } else {
      console.warn('Invalid category format:', category);
      return String(category);
    }
  }
} 