import { BasePage } from './BasePage';
import { ApiService, type Product } from '../services/ApiService';

export class CategoryPage extends BasePage {
  private apiService: ApiService;
  private categoryName: string;
  private allProducts: Product[] = [];
  private filteredProducts: Product[] = [];
  private selectedBrands: Set<string> = new Set();
  private minPrice: number = 1;
  private maxPrice: number = 20000;

  constructor(app: any, categoryName: string) {
    super(app);
    this.apiService = new ApiService();
    this.categoryName = categoryName;
  }

  async render(container: HTMLElement): Promise<void> {
    container.innerHTML = `
      ${this.createHeader()}
      <main class="main">
        <div class="container">
          <div class="category-page">
            <div class="category-page__header">
              <h1 class="category-page__title">${this.formatCategoryName(this.categoryName)}</h1>
              <button class="category-page__filter-toggle" id="filter-toggle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4H21V6H3V4ZM7 10H17V12H7V10ZM10 16H14V18H10V16Z" fill="currentColor"/>
                </svg>
                Filters
              </button>
            </div>
            
            <div class="category-page__content">
              <aside class="filters" id="filters-panel">
                <div class="filters__header">
                  <h3>Filters</h3>
                  <button class="filters__close" id="filters-close">×</button>
                </div>
                
                <div class="filters__section">
                  <h4>Brand</h4>
                  <div class="filters__brands" id="brand-filters">
                    <div class="loading">Loading brands...</div>
                  </div>
                </div>
                
                <div class="filters__section">
                  <h4>Price Range</h4>
                  <div class="filters__price">
                    <div class="price-inputs">
                      <input type="number" id="min-price" min="1" max="20000" value="1" placeholder="Min">
                      <span>-</span>
                      <input type="number" id="max-price" min="1" max="20000" value="20000" placeholder="Max">
                    </div>
                    <div class="price-range">
                      <input type="range" id="price-range" min="1" max="20000" value="20000">
                    </div>
                  </div>
                </div>
                
                <div class="filters__actions">
                  <button class="btn btn--primary" id="apply-filters">Apply Filters</button>
                  <button class="btn btn--secondary" id="reset-filters">Reset Filters</button>
                </div>
              </aside>
              
              <div class="products">
                <div class="products__grid" id="products-grid">
                  <div class="loading">Loading products...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      ${this.createSubscribeBanner()}
      
        ${this.createFooter()}
    `;

    this.setupEventListeners();
    this.setupSubscribeBanner();
    this.setupNavigation();
    await this.loadProducts();
  }

  private setupEventListeners(): void {
    const filterToggle = document.getElementById('filter-toggle');
    const filtersPanel = document.getElementById('filters-panel');
    const filtersClose = document.getElementById('filters-close');

    if (filterToggle && filtersPanel) {
      filterToggle.addEventListener('click', () => {
        filtersPanel.classList.add('filters--open');
      });
    }

    if (filtersClose && filtersPanel) {
      filtersClose.addEventListener('click', () => {
        filtersPanel.classList.remove('filters--open');
      });
    }

    const minPriceInput = document.getElementById('min-price') as HTMLInputElement;
    const maxPriceInput = document.getElementById('max-price') as HTMLInputElement;
    const priceRange = document.getElementById('price-range') as HTMLInputElement;

    if (minPriceInput && maxPriceInput && priceRange) {
      minPriceInput.addEventListener('input', () => {
        this.minPrice = parseInt(minPriceInput.value) || 1;
        priceRange.value = this.maxPrice.toString();
      });

      maxPriceInput.addEventListener('input', () => {
        this.maxPrice = parseInt(maxPriceInput.value) || 20000;
        priceRange.value = this.maxPrice.toString();
      });

      priceRange.addEventListener('input', () => {
        this.maxPrice = parseInt(priceRange.value);
        maxPriceInput.value = this.maxPrice.toString();
      });
    }

    const applyFilters = document.getElementById('apply-filters');
    const resetFilters = document.getElementById('reset-filters');

    if (applyFilters) {
      applyFilters.addEventListener('click', () => {
        this.applyFilters();
        if (filtersPanel) {
          filtersPanel.classList.remove('filters--open');
        }
      });
    }

    if (resetFilters) {
      resetFilters.addEventListener('click', () => {
        this.resetFilters();
        if (filtersPanel) {
          filtersPanel.classList.remove('filters--open');
        }
      });
    }
  }

  private async loadProducts(): Promise<void> {
    try {
      console.log('Loading products for category:', this.categoryName);
      const response = await this.apiService.getProductsByCategory(this.categoryName);
      console.log('Products response:', response);
      this.allProducts = response.products;
      this.filteredProducts = [...this.allProducts];
      console.log('Loaded products:', this.allProducts.length);
      this.renderProducts();
      this.renderBrandFilters();
    } catch (error) {
      console.error('Error loading products:', error);
      const grid = document.getElementById('products-grid');
      if (grid) {
        grid.innerHTML = `
          <div class="error">
            <h2>Failed to load products</h2>
            <p>Sorry, we couldn't load the products for this category. Please try again later.</p>
            <a href="/" class="btn btn--primary" data-navigo>Go back to home</a>
          </div>
        `;
        this.setupNavigation();
      }
    }
  }

  private renderProducts(): void {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    if (this.filteredProducts.length === 0) {
      grid.innerHTML = '<div class="no-products">No products found matching your criteria</div>';
      return;
    }

    grid.innerHTML = this.filteredProducts.map(product => `
      <div class="product-card">
        <a href="/product/${product.id}" class="product-card__link" data-navigo>
          <div class="product-card__image">
            <img src="${product.thumbnail}" alt="${product.title}" loading="lazy">
          </div>
          <div class="product-card__content">
            <h3 class="product-card__title">${product.title}</h3>
            ${product.brand?
            `<p class="product-card__brand">${product.brand}</p>`:""
            }
            <div class="product-card__price">
              <span class="product-card__current-price">$${product.price.toFixed(2)}</span>
            </div>
            <div class="product-card__rating">
              <span class="rating">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
              <span class="rating-value">${product.rating}</span>
            </div>
          </div>
        </a>
      </div>
    `).join('');

    this.setupNavigation();
  }

  private renderBrandFilters(): void {
    const brandFilters = document.getElementById('brand-filters');
    if (!brandFilters) return;

    const brands = [...new Set(this.allProducts.map(p => p.brand))].sort();
    if(brands[0]===undefined){
      brandFilters.innerHTML = "-" 
      return
    }

    brandFilters.innerHTML = brands.map(brand => `
      <label class="filter-checkbox">
        <input type="checkbox" value="${brand}" ${this.selectedBrands.has(brand) ? 'checked' : ''}>
        <span class="filter-checkbox__label ${this.selectedBrands.has(brand) ? 'filter-checkbox__label--selected' : ''}">${brand}</span>
      </label>
    `).join('');

    const checkboxes = brandFilters.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const label = target.nextElementSibling as HTMLElement;
        
        if (target.checked) {
          this.selectedBrands.add(target.value);
          label.classList.add('filter-checkbox__label--selected');
        } else {
          this.selectedBrands.delete(target.value);
          label.classList.remove('filter-checkbox__label--selected');
        }
      });
    });
  }

  private applyFilters(): void {
    this.filteredProducts = this.allProducts.filter(product => {
      const brandMatch = this.selectedBrands.size === 0 || this.selectedBrands.has(product.brand);
      const priceMatch = product.price >= this.minPrice && product.price <= this.maxPrice;
      return brandMatch && priceMatch;
    });

    this.renderProducts();
  }

  private resetFilters(): void {
    this.selectedBrands.clear();
    this.minPrice = 1;
    this.maxPrice = 20000;
    this.filteredProducts = [...this.allProducts];

    const minPriceInput = document.getElementById('min-price') as HTMLInputElement;
    const maxPriceInput = document.getElementById('max-price') as HTMLInputElement;
    const priceRange = document.getElementById('price-range') as HTMLInputElement;

    if (minPriceInput) minPriceInput.value = '1';
    if (maxPriceInput) maxPriceInput.value = '20000';
    if (priceRange) priceRange.value = '20000';

    this.renderProducts();
    this.renderBrandFilters();
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