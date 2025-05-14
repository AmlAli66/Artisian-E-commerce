import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArtistService } from '../../core/services/artist.service';
import { Product } from '../../core/interfaces/product';
import { Artist } from '../../core/interfaces/artist';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-artist-profile',
  standalone: true,
  imports: [RouterLink, CommonModule, HttpClientModule],
  templateUrl: './artist-profile.component.html',
  styleUrl: './artist-profile.component.scss'
})
export class ArtistProfileComponent implements OnInit {
  artist: Artist | null = null;
  products: Product[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private artistService: ArtistService
  ) { }

  ngOnInit(): void {
    const artistId = this.route.snapshot.paramMap.get('id');
    if (!artistId) {
      this.error = 'Artist ID not found';
      this.loading = false;
      return;
    }

    this.loadArtistData(+artistId);
  }

  private loadArtistData(artistId: number): void {
    this.loading = true;
    this.error = null;

    // Load artist details
    this.artistService.getArtistById(artistId).subscribe({
      next: (artist) => {
        this.artist = artist;
        this.loadArtistProducts(artistId);
      },
      error: (error) => {
        console.error('Error loading artist:', error);
        this.error = 'Failed to load artist details';
        this.loading = false;
      }
    });
  }

  private loadArtistProducts(artistId: number): void {
    this.artistService.getProductsByArtistId(artistId).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load artist products';
        this.loading = false;
      }
    });
  }
}
