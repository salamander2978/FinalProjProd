import { ApiService } from './ApiService';
import { StorageService } from './StorageService';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface Cart {
  id: number;
  products: CartItem[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export class CartService {
  private apiService: ApiService;
  private storageService: StorageService;
  private cartId: number = 1;

  constructor() {
    this.apiService = new ApiService();
    this.storageService = new StorageService();
  }

  private getCartFromStorage(): Cart | null {
    return this.storageService.getItem<Cart>('localCart');
  }

  private saveCartToStorage(cart: Cart): void {
    this.storageService.setItem('localCart', cart);
  }

  private async getProductDetails(productId: number): Promise<any> {
    try {
      return await this.apiService.getProduct(productId);
    } catch (error) {
      console.error('Error fetching product details:', error);
      return {
        id: productId,
        title: `Product ${productId}`,
        price: 0,
        discountPercentage: 0,
        thumbnail: ''
      };
    }
  }

  private calculateCartTotals(products: CartItem[]): { total: number; discountedTotal: number; totalProducts: number; totalQuantity: number } {
    const total = products.reduce((sum, item) => sum + item.total, 0);
    const discountedTotal = products.reduce((sum, item) => sum + item.discountedTotal, 0);
    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
    
    return { total, discountedTotal, totalProducts, totalQuantity };
  }

  async getCart(): Promise<Cart> {
    const cart = this.getCartFromStorage();
    
    if (!cart) {
      const emptyCart: Cart = {
        id: this.cartId,
        products: [],
        total: 0,
        discountedTotal: 0,
        userId: 1,
        totalProducts: 0,
        totalQuantity: 0
      };
      this.saveCartToStorage(emptyCart);
      return emptyCart;
    }
    
    return cart;
  }

  async addToCart(productId: number, quantity: number = 1): Promise<Cart> {
    const cart = await this.getCart();
    const existingProductIndex = cart.products.findIndex(p => p.id === productId);
    
    if (existingProductIndex >= 0) {
      const existingProduct = cart.products[existingProductIndex];
      const newQuantity = existingProduct.quantity + quantity;
      const newTotal = existingProduct.price * newQuantity;
      const newDiscountedTotal = newTotal * (1 - existingProduct.discountPercentage / 100);
      
      cart.products[existingProductIndex] = {
        ...existingProduct,
        quantity: newQuantity,
        total: newTotal,
        discountedTotal: newDiscountedTotal
      };
    } else {
      const productDetails = await this.getProductDetails(productId);
      const total = productDetails.price * quantity;
      const discountedTotal = total * (1 - productDetails.discountPercentage / 100);
      
      const newItem: CartItem = {
        id: productId,
        title: productDetails.title,
        price: productDetails.price,
        quantity,
        total,
        discountPercentage: productDetails.discountPercentage,
        discountedTotal,
        thumbnail: productDetails.thumbnail
      };
      
      cart.products.push(newItem);
    }
    
    const totals = this.calculateCartTotals(cart.products);
    cart.total = totals.total;
    cart.discountedTotal = totals.discountedTotal;
    cart.totalProducts = totals.totalProducts;
    cart.totalQuantity = totals.totalQuantity;
    
    this.saveCartToStorage(cart);
    return cart;
  }

  async updateCartItemQuantity(productId: number, quantity: number): Promise<Cart> {
    const cart = await this.getCart();
    const productIndex = cart.products.findIndex(p => p.id === productId);
    
    if (productIndex >= 0) {
      if (quantity <= 0) {
        cart.products.splice(productIndex, 1);
      } else {
        const product = cart.products[productIndex];
        const newTotal = product.price * quantity;
        const newDiscountedTotal = newTotal * (1 - product.discountPercentage / 100);
        
        cart.products[productIndex] = {
          ...product,
          quantity,
          total: newTotal,
          discountedTotal: newDiscountedTotal
        };
      }
      
      const totals = this.calculateCartTotals(cart.products);
      cart.total = totals.total;
      cart.discountedTotal = totals.discountedTotal;
      cart.totalProducts = totals.totalProducts;
      cart.totalQuantity = totals.totalQuantity;
      
      this.saveCartToStorage(cart);
    }
    
    return cart;
  }

  async removeFromCart(productId: number): Promise<Cart> {
    return this.updateCartItemQuantity(productId, 0);
  }

  async clearCart(): Promise<Cart> {
    const emptyCart: Cart = {
      id: this.cartId,
      products: [],
      total: 0,
      discountedTotal: 0,
      userId: 1,
      totalProducts: 0,
      totalQuantity: 0
    };
    this.saveCartToStorage(emptyCart);
    return emptyCart;
  }

  getCurrentCartId(): number {
    return this.cartId;
  }
} 