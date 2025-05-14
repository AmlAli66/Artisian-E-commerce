import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../../core/services/artist.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ARTISTS } from '../../data/artists';
import { PRODUCTS } from '../../data/products';
import { Artist } from '../../core/interfaces/artist';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.scss'
})
export class ArtistsComponent implements OnInit {

  artists: Artist[] = [];

  constructor(private artistService: ArtistService) { }

  ngOnInit(): void {
    this.artistService.getAllArtists().subscribe(data => {
      this.artists = data;
    });
  }
}
