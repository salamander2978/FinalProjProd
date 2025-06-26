import './styles/main.scss';
import Navigo from 'navigo';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { CartService } from './services/CartService';

class App {
  private router: Navigo;
  private container: HTMLElement;
  private cartService: CartService;

  constructor() {
    this.container = document.getElementById('app') as HTMLElement;
    this.router = new Navigo('/', { hash: false });
    this.cartService = new CartService();
    this.setupRoutes();
    this.setupGlobalStyles();
  }

  private setupGlobalStyles(): void {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Rubik:wght@400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const iconLink = document.createElement('link');
    iconLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    iconLink.rel = 'stylesheet';
    document.head.appendChild(iconLink);
  }

  private setupRoutes(): void {
    this.router
      .on('/', () => {
        this.renderPage(new HomePage(this));
      })
      .on('/category/:categoryName', (match) => {
        const categoryName = match?.data?.categoryName;
        if (categoryName) {
          this.renderPage(new CategoryPage(this, categoryName));
        }
      })
      .on('/product/:productId', (match) => {
        const productId = match?.data?.productId;
        if (productId) {
          this.renderPage(new ProductDetailPage(this, parseInt(productId)));
        }
      })
      .on('/cart', () => {
        this.renderPage(new CartPage(this));
      })
      .on('/checkout', () => {
        this.renderPage(new CheckoutPage(this));
      })
      .on('/order-confirmation', () => {
        this.renderPage(new OrderConfirmationPage(this));
      })
      .notFound(() => {
        this.container.innerHTML = `
          <div class="container" style="background-image: url('./src/assets/images (1).jpeg'); background-size: cover; background-position: center; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
            <div class="error">
              <h2>404</h2>
              <p></p>

            </div>
          </div>
        `;
      });
  }


  private async renderPage(page: any): Promise<void> {
    this.container.innerHTML = '';
    await page.render(this.container);
    window.scrollTo(0, 0);
    }

  public start(): void {
    this.router.resolve();
  }

  public navigate(path: string): void {
    this.router.navigate(path);
  }

  public getRouter(): Navigo {
    return this.router;
  }

  public getCartService(): CartService {
    return this.cartService;
  }
}

const app = new App();
app.start();

(window as any).app = app;

export default app; 