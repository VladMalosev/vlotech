import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-header',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit{
  @Output() searchEvent = new EventEmitter<string>();
  searchTerm: string = '';

  isBannerHidden: boolean = false;
  isHeaderHidden: boolean = false;
  lastScrollTop: number = 0;
  isAuthenticated: boolean = false;

  // Inject Router into the constructor
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((authStatus) => {
      this.isAuthenticated = authStatus;
    });
  }


  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Hide the free banner when scrolled 100px
    this.isBannerHidden = scrollY > 100;

    // Hide the header when scrolled 300px
    this.isHeaderHidden = scrollY > 300;
  }


  onSearch(): void {
    this.searchEvent.emit(this.searchTerm);
    this.router.navigate(['/search'], {
      queryParams: { search: this.searchTerm },
    });
  }
  navigateToProfileOrLogin(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
