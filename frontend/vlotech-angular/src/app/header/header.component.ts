import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Output() searchEvent = new EventEmitter<string>();
  searchTerm: string = '';

  isBannerHidden: boolean = false;
  isHeaderHidden: boolean = false;
  lastScrollTop: number = 0;

  // Inject Router into the constructor
  constructor(private router: Router) {}

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

  onSearch(): void {
    this.searchEvent.emit(this.searchTerm);
    this.router.navigate(['/search'], {
      queryParams: { search: this.searchTerm },
    });
  }
}
