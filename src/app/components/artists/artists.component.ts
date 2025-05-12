import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../../core/services/artist.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ARTISTS } from '../../data/artists';
import { PRODUCTS } from '../../data/products';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.scss'
})
export class ArtistsComponent implements OnInit {

  artist: any;
  artistProducts: any[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.artist = ARTISTS.find(a => a.id === id);
    this.artistProducts = PRODUCTS.filter(p => p.artistId === id);
  }
}
