import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface ProductDetails {
  burnTime: string;
  weight: string;
  scentNotes: string[];
  mood: string[];
}

interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  description: string;
  details: ProductDetails;
  images: string[];
  artistId: number;
  artistName: string;
  inStock: boolean;
  featured: boolean;
  seasonal?: boolean;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ProductListComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  products: Product[] = [];
  displayedProducts: Product[] = [];
  
  // Cart state
  cartItems: any[] = [];
  cartTotal: number = 0;
  private cartSubscription: Subscription;
  
  // Filter states
  selectedCategories: { [key: number]: boolean } = {};
  selectedScents: { [key: string]: boolean } = {};
  selectedMoods: { [key: string]: boolean } = {};
  priceRange: number = 200;
  searchQuery: string = '';
  sortOption: string = 'featured';
  
  // Unique scent types and moods extracted from products
  scentTypes: string[] = [];
  moods: string[] = [];
  
  // View states
  activeCategory: number | null = null;
  viewMode: 'grid' | 'list' = 'grid';
  
  constructor(
    private router: Router,
    public cartService: CartService
  ) {
    // Subscribe to cart updates
    this.cartSubscription = this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }
  
  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
  
  async loadCategories() {
    try {
      const response = await fetch('http://localhost:3001/categories');
      this.categories = await response.json();
      this.categories.forEach(category => {
        this.selectedCategories[category.id] = false;
      });
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }
  
  async loadProducts() {
    try {
      const response = await fetch('http://localhost:3001/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Loaded products:', data); // Debug log
      this.products = data;
      if (this.products.length > 0) {
        this.extractFilters();
        this.filterProducts();
      } else {
        console.log('No products found in the response');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      this.products = [];
      this.displayedProducts = [];
    }
  }
  
  extractFilters() {
    const scentSet = new Set<string>();
    const moodSet = new Set<string>();
    
    this.products.forEach(product => {
      product.details.scentNotes.forEach(scent => scentSet.add(scent));
      product.details.mood.forEach(mood => moodSet.add(mood));
    });
    
    this.scentTypes = Array.from(scentSet).sort();
    this.moods = Array.from(moodSet).sort();
  }
  
  filterProducts() {
    let filtered = [...this.products];
    
    // Category filter
    const selectedCategoryIds = Object.entries(this.selectedCategories)
      .filter(([_, selected]) => selected)
      .map(([id]) => Number(id));
    
    if (selectedCategoryIds.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategoryIds.includes(product.categoryId)
      );
    }
    
    // Scent filter
    const selectedScents = Object.entries(this.selectedScents)
      .filter(([_, selected]) => selected)
      .map(([scent]) => scent);
    
    if (selectedScents.length > 0) {
      filtered = filtered.filter(product =>
        product.details.scentNotes.some(scent => selectedScents.includes(scent))
      );
    }
    
    // Mood filter
    const selectedMoods = Object.entries(this.selectedMoods)
      .filter(([_, selected]) => selected)
      .map(([mood]) => mood);
    
    if (selectedMoods.length > 0) {
      filtered = filtered.filter(product =>
        product.details.mood.some(mood => selectedMoods.includes(mood))
      );
    }
    
    // Price filter
    filtered = filtered.filter(product => product.price <= this.priceRange);
    
    // Search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.details.scentNotes.some(scent => 
          scent.toLowerCase().includes(query)
        )
      );
    }
    
    this.displayedProducts = this.sortProducts(filtered);
  }
  
  sortProducts(products: Product[]): Product[] {
    switch (this.sortOption) {
      case 'priceAsc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'nameAsc':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'nameDesc':
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      case 'featured':
      default:
        return [...products].sort((a, b) => {
          if (a.featured === b.featured) return 0;
          return a.featured ? -1 : 1;
        });
    }
  }
  
  onSort() {
    this.filterProducts();
  }
  
  switchMainImage(product: Product, newImage: string) {
    const productCopy = { ...product };
    const currentIndex = productCopy.images.indexOf(newImage);
    if (currentIndex > 0) {
      [productCopy.images[0], productCopy.images[currentIndex]] = 
      [productCopy.images[currentIndex], productCopy.images[0]];
    }
    const index = this.displayedProducts.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.displayedProducts[index] = productCopy;
    }
  }
  
  getRelatedProducts(product: Product): Product[] {
    return this.products
      .filter(p => 
        p.id !== product.id && 
        (p.categoryId === product.categoryId ||
         p.details.scentNotes.some(scent => 
           product.details.scentNotes.includes(scent)
         ))
      )
      .slice(0, 3);
  }
  
  addToCart(product: any): void {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      images: product.images,
      quantity: 1
    };
    this.cartService.addToCart(cartItem);
  }
  
  isInCart(productId: number): boolean {
    return this.cartItems.some(item => item.id === productId);
  }
  
  getCartItemQuantity(productId: number): number {
    const item = this.cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }
  
  private showToast(message: string, type: 'success' | 'error' = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast show position-fixed bottom-0 end-0 m-3';
    toast.style.backgroundColor = 'white';
    toast.style.padding = '1rem';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    toast.style.zIndex = '1050';
    toast.style.minWidth = '250px';

    const icon = type === 'success' ? 'fa-check-circle text-success' : 'fa-exclamation-circle text-danger';
    
    toast.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="fas ${icon} me-2"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
  
  setActiveCategory(categoryId: number | null) {
    this.activeCategory = categoryId;
    
    // Reset all category selections
    Object.keys(this.selectedCategories).forEach(key => {
      this.selectedCategories[Number(key)] = false;
    });
    
    // If a category is selected, set it to true
    if (categoryId !== null) {
      this.selectedCategories[categoryId] = true;
    }
    
    this.filterProducts();
  }
  
  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
}
