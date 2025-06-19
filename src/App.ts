import { CartService } from './services/CartService';
import { StorageService } from './services/StorageService';

export class App {
  private cartService: CartService;
  private storageService: StorageService;
  private appElement: HTMLElement;

  constructor() {
    this.cartService = new CartService();
    this.storageService = new StorageService();
    this.appElement = document.getElementById('app') as HTMLElement;
  }

  init(): void {
    this.render();
  }

  render(): void {
    this.appElement.innerHTML = `
      <div id="header-container"></div>
      <main id="main-content"></main>
      <div id="subscribe-banner-container"></div>
    `;
  }

  getCartService(): CartService {
    return this.cartService;
  }

  getStorageService(): StorageService {
    return this.storageService;
  }

  getAppElement(): HTMLElement {
    return this.appElement;
  }
} 