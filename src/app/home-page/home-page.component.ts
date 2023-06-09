import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  title = 'frontend';

  isSearchBannerOpen: boolean = false;

  nTires: number = -1;

  openBanner() {
    this.isSearchBannerOpen = true;
  }

  onBannerOpenChange(value: boolean) {
    this.isSearchBannerOpen = false;
  }

  countResult(results: any) {
    this.nTires = results.length;
  }
}


