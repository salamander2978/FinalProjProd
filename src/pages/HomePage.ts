import { BasePage } from './BasePage';
import { ApiService } from '../services/ApiService';

import bannerImg from '../assets/banner.png';

export class HomePage extends BasePage {
  private apiService: ApiService;

  constructor(app: any) {
    super(app);
    this.apiService = new ApiService();
  }

  async render(container: HTMLElement): Promise<void> {
    container.innerHTML = `
      ${this.createHeader()}
      <main class="main">
      <section class="hero" style="background: #f9f9fa;">
        <div class="hero__container" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; padding-top: 48px; padding-bottom: 32px;">
        <div class="hero__text" style="max-width: 520px; position:relative;z-index:1">
          <h1 class="hero__title" style="font-size: 3rem; font-weight: 800; margin-bottom: 16px; line-height: 1.1;">
          <span style="display:block; width:fit-content;">FIND ANYTHING</span>
          <span style="display:block;width:fit-content;">THAT MATCHES</span>
          <span style="display:block;width:fit-content;">YOUR STYLE</span>
          </h1>
          <p class="hero__subtitle" style="text-align:start;font-size: 1.1rem; color: #666; margin-bottom: 32px;">
          Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>
          <button class="hero__cta" id="shop-now-btn" style="padding: 16px 40px; font-size: 1.1rem; border-radius: 32px; background: #000; color: #fff; border: none; font-weight: 600; cursor: pointer;">
          Shop Now
          </button>
          <div class="hero__stats" style="display: flex; gap: 40px; margin-top: 40px;">
          <div>
            <div style="font-size: 2rem; font-weight: 700;">200+</div>
            <div style="color: #888;">International Brands</div>
          </div>
          <div>
            <div style="font-size: 2rem; font-weight: 700;">2,000+</div>
            <div style="color: #888;">High-Quality Products</div>
          </div>
          <div>
            <div style="font-size: 2rem; font-weight: 700;">30,000+</div>
            <div style="color: #888;">Happy Customers</div>
          </div>
          </div>
        </div>
          <img src="${bannerImg}" alt="Fashionable people" style="z-index :0;width: 100%; border-radius: 0; object-fit: contain; background: none; box-shadow: none; position:absolute" />
        </div>
        </div>
        <div class="hero__brands" style="background: #111; color: #fff; padding: 32px 0; margin-top: 32px;">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 32px;">
          <span style="font-family: serif; font-size: 2rem; letter-spacing: 2px;">VERSACE</span>
          <span style="font-family: serif; font-size: 2rem; letter-spacing: 2px;">ZARA</span>
          <span style="font-family: serif; font-size: 2rem; letter-spacing: 2px;">GUCCI</span>
          <span style="font-family: serif; font-size: 2rem; letter-spacing: 2px;">PRADA</span>
          <span style="font-family: serif; font-size: 2rem; letter-spacing: 2px;">Calvin Klein</span>
        </div>
        </div>
      </section>
      <section class="categories" id="categories-section">
        <div class="container">
        <h2 class="categories__title" style="font-size: 2rem; font-weight: 700; margin: 48px 0 24px;">Categories</h2>
        <div class="categories__grid" id="categories-grid">
          <div class="loading">Loading categories...</div>
        </div>
        </div>
      </section>
      </main>
      ${this.createSubscribeBanner()}
      ${this.createFooter()}
    `;
    this.setupSubscribeBanner()
    this.setupNavigation();
    this.setupEventListeners();
    await this.loadCategories();
  }

  private setupEventListeners(): void {
    const shopNowBtn = document.getElementById('shop-now-btn');
    if (shopNowBtn) {
      shopNowBtn.addEventListener('click', () => {
        const categoriesSection = document.getElementById('categories-section');
        if (categoriesSection) {
          categoriesSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  private async loadCategories(): Promise<void> {
    try {
      console.log('Loading categories...');
      const categories = await this.apiService.getCategories();
      console.log('Categories loaded:', categories);
      
      if (Array.isArray(categories) && categories.length > 0) {
        this.renderCategories(categories);
      } else {
        console.warn('Categories response is not an array or is empty:', categories);
        this.renderFallbackCategories();
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      this.renderFallbackCategories();
    }
  }

  private renderFallbackCategories(): void {
    console.log('Using fallback categories');
    const fallbackCategories = [
      { slug: 'beauty', name: 'Beauty' },
      { slug: 'fragrances', name: 'Fragrances' },
      { slug: 'furniture', name: 'Furniture' },
      { slug: 'groceries', name: 'Groceries' },
      { slug: 'home-decoration', name: 'Home Decoration' },
      { slug: 'kitchen-accessories', name: 'Kitchen Accessories' },
      { slug: 'laptops', name: 'Laptops' },
      { slug: 'mens-shirts', name: 'Mens Shirts' },
      { slug: 'mens-shoes', name: 'Mens Shoes' },
      { slug: 'mens-watches', name: 'Mens Watches' },
      { slug: 'mobile-accessories', name: 'Mobile Accessories' },
      { slug: 'motorcycle', name: 'Motorcycle' },
      { slug: 'skin-care', name: 'Skin Care' },
      { slug: 'smartphones', name: 'Smartphones' },
      { slug: 'sports-accessories', name: 'Sports Accessories' },
      { slug: 'sunglasses', name: 'Sunglasses' },
      { slug: 'tablets', name: 'Tablets' },
      { slug: 'tops', name: 'Tops' },
      { slug: 'vehicle', name: 'Vehicle' },
      { slug: 'womens-bags', name: 'Womens Bags' },
      { slug: 'womens-dresses', name: 'Womens Dresses' },
      { slug: 'womens-jewellery', name: 'Womens Jewellery' },
      { slug: 'womens-shoes', name: 'Womens Shoes' },
      { slug: 'womens-watches', name: 'Womens Watches' }
    ];
    
    this.renderCategories(fallbackCategories);
  }

  private renderCategories(categories: any[]): void {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    grid.innerHTML = categories.map(category => {
      try {
        let categorySlug: string;
        let categoryName: string;
        
        if (typeof category === 'string') {
          categorySlug = category;
          categoryName = this.formatCategoryName(category);
        } else if (category && typeof category === 'object') {
          categorySlug = category.slug || category.name || String(category);
          categoryName = category.name || this.formatCategoryName(categorySlug);
        } else {
          console.warn('Invalid category format:', category);
          categorySlug = String(category);
          categoryName = String(category);
        }
        
        return `
          <div class="category-card">
            <a href="/category/${encodeURIComponent(categorySlug)}" class="category-card__link" data-navigo>
              <div class="category-card__content">
                <h3 class="category-card__title">${categoryName}</h3>
              </div>
            </a>
          </div>
        `;
      } catch (error) {
        console.error('Error formatting category name:', category, error);
        return `
          <div class="category-card">
            <a href="/category/${encodeURIComponent(String(category))}" class="category-card__link" data-navigo>
              <div class="category-card__content">
                <h3 class="category-card__title">${String(category)}</h3>
              </div>
            </a>
          </div>
        `;
      }
    }).join('');

    this.setupNavigation();
  }

  private formatCategoryName(category: string): string {
    if (typeof category !== 'string') {
      console.warn('Category is not a string:', category);
      return String(category);
    }
    
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
} 