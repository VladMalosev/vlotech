import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isBannerHidden: boolean = false;
  isHeaderHidden: boolean = false;
  lastScrollTop: number = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Hide the banner first
    if (currentScroll > 150) {
      this.isBannerHidden = true;
    } else {
      this.isBannerHidden = false;
    }

    // Then hide the header after banner
    if (currentScroll > 300) {
      this.isHeaderHidden = true;
    } else {
      this.isHeaderHidden = false;
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }
}
