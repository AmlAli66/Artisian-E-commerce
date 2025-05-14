import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Artist } from '../interfaces/artist';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) { }

  getArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.apiUrl}/artists`);
  }

  getArtistById(id: number): Observable<Artist> {
    return this.http.get<Artist>(`${this.apiUrl}/artists/${id}`);
  }

  getProductsByArtistId(artistId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?artistId=${artistId}`);
  }

  getAllArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.apiUrl}/artists`);
  }

  // استرجاع المنتجات المرتبطة بفنان معين
  // getProductsByArtistId(artistId: number) {
  //   return this.products.filter((product) => product.artistId === artistId);
  // }

  // private artists = [
  //   {
  //     id: 1,
  //     name: 'Layla Artworks',
  //     bio: 'Expert in handmade ceramics',
  //     image: 'https://i.imgur.com/layla.jpg',
  //   },
  //   {
  //     id: 2,
  //     name: 'Omar Crafts',
  //     bio: 'Woodwork specialist',
  //     image: 'https://i.imgur.com/omar.jpg',
  //   },
  // ];

  // private products = [
  //   {
  //     id: 1,
  //     name: 'Handmade Pottery Vase',
  //     price: 45,
  //     image: 'https://i.imgur.com/xxxxx.jpg',
  //     artistId: 1,
  //   },
  //   {
  //     id: 2,
  //     name: 'Wooden Jewelry Box',
  //     price: 60,
  //     image: 'https://i.imgur.com/yyyyy.jpg',
  //     artistId: 2,
  //   },
  // ];
}
