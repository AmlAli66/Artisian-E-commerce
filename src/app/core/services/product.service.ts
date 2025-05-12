import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }


  // getLatestProducts() {
  //   return this.products.slice(0, 3);
  // }

  // private products = [
  //   {
  //     id: 1,
  //     name: 'Handmade Ceramic Vase',
  //     price: 45.99,
  //     description: 'A beautifully crafted ceramic vase, perfect for home decoration.',
  //     imageUrl: 'https://images.unsplash.com/photo-1588865790927-2a4f7604d0c3',
  //     artistName: 'Amira Artworks',
  //     artistId: 1
  //   },
  //   {
  //     id: 2,
  //     name: 'Knitted Wool Scarf',
  //     price: 25.50,
  //     description: 'Soft and warm handmade wool scarf for the winter season.',
  //     imageUrl: 'https://images.unsplash.com/photo-1610465298879-d8d18ee820c3',
  //     artistName: 'Mohamed Handmade',
  //     artistId: 2
  //   },
  //   {
  //     id: 3,
  //     name: 'Leather Handbag',
  //     price: 120.00,
  //     description: 'Elegant handmade leather handbag with customizable options.',
  //     imageUrl: 'https://images.unsplash.com/photo-1617854818583-5d4e9c9a1e7e',
  //     artistName: 'Layla Creations',
  //     artistId: 1
  //   },
  //   {
  //     id: 4,
  //     name: 'Wooden Jewelry Box',
  //     price: 60.00,
  //     description: 'Hand-carved wooden jewelry box with intricate designs.',
  //     imageUrl: 'https://images.unsplash.com/photo-1611095973518-9b4d1f016c74',
  //     artistName: 'Handcrafted by Nour',
  //     artistId: 2
  //   },
  //   {
  //     id: 5,
  //     name: 'Custom Beaded Necklace',
  //     price: 35.75,
  //     description: 'Colorful handmade beaded necklace, customizable upon request.',
  //     imageUrl: 'https://images.unsplash.com/photo-1584382295380-c59cf4bd825c',
  //     artistName: 'Dina Designs',
  //     artistId: 3
  //   }
  // ];




}
