import { Component } from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArtistService } from '../../core/services/artist.service';
import { Product } from '../../core/interfaces/product';
import { Artist } from '../../core/interfaces/artist';

@Component({
  selector: 'app-artist-profile',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './artist-profile.component.html',
  styleUrl: './artist-profile.component.scss'
})
export class ArtistProfileComponent {
  // artist: any;
  // products: Product[] = [];

  // constructor(
  //   private route: ActivatedRoute,
  //   private artistService: ArtistService
  // ) { }

  // ngOnInit(): void {
  //   const artistId = +this.route.snapshot.paramMap.get('id')!;
  //   this.artist = this.artistService.getArtistById(artistId);  // استرجاع بيانات الفنان
  //   this.products = this.artistService.getProductsByArtistId(artistId);  // استرجاع منتجاته
  // }

  artist: Artist | null = null;
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private artistService: ArtistService
  ) { }

  ngOnInit(): void {
    const artistId = +this.route.snapshot.paramMap.get('id')!;

    // جلب بيانات الفنان
    this.artistService.getArtistById(artistId).subscribe(artist => {
      this.artist = artist;
    });

    // جلب المنتجات المرتبطة بالفنان
    this.artistService.getProductsByArtistId(artistId).subscribe(products => {
      this.products = products;
    });
  }
}
