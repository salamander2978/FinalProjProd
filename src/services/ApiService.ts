export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export class ApiService {
  private baseUrl = 'https://dummyjson.com';

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      console.log(`Making API request to: ${this.baseUrl}${endpoint}`);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      console.log(`API response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`API response data:`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Endpoint:', endpoint);
      console.error('Full URL:', `${this.baseUrl}${endpoint}`);
      throw error;
    }
  }

  
  async getProducts(limit: number = 30, skip: number = 0): Promise<ProductsResponse> {
    return this.request<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async getCategories(): Promise<any[]> {
    try {
      const response = await this.request<any>('/products/categories');
      console.log('Raw categories response:', response);
      
      if (Array.isArray(response)) {
        return response;
      } else if (response && typeof response === 'object') {
        return (response as any).categories || (response as any).data || [];
      } else {
        console.warn('Unexpected categories response format:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getProductsByCategory(category: string): Promise<ProductsResponse> {
    return this.request<ProductsResponse>(`/products/category/${category}`);
  }

  async searchProducts(query: string): Promise<ProductsResponse> {
    return this.request<ProductsResponse>(`/products/search?q=${encodeURIComponent(query)}`);
  }

  async createCart(data: { userId: number; products: { id: number; quantity: number }[] }): Promise<any> {
    return this.request('/carts/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCart(id: number): Promise<any> {
    return this.request(`/carts/${id}`);
  }

  async updateCart(id: number, data: { products: { id: number; quantity: number }[] }): Promise<any> {
    return this.request(`/carts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCart(id: number): Promise<any> {
    return this.request(`/carts/${id}`, {
      method: 'DELETE',
    });
  }
} 