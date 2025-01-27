import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

/*expected structure of the product data returned by the API*/
interface ProductResponse {
  content: any[];
  totalElements: number;
}


@Component({
  selector: 'app-product-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = []; /*stores all fetched products*/
  materials: any[] = []; // placeholders
  colors: any[] = ['Red', 'Blue', 'Green']; // example color options
  filteredProducts: any[] = []; /*hold products after applying fitlers*/
  pagProducts: any[] = []; /*curr page of products being displayed*/
  searchTerm: string = ''; /*holds the search query*/
  activeFilters: { [key: string]: boolean } = {};
  totalPages: number = 0;
  currPage: number = 1;
  itemsPerPage: number = 40;
  currentSort: string = 'name';
  dataLoaded: boolean = false;
  pageNumbers: number[] = [];
  selectedCategory: string = '';
  selectedBrand: string = '';
  selectedAvailability: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  navigateToProductDetails(productId: number): void {
    this.router.navigate(['/product', productId]);
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      /*listens for changes to query parameters from the URL
      * when parameters are available -> updates teh state*/
      this.currPage = params['page'] || 1;
      this.searchTerm = params['search'] || '';
      this.currentSort = params['sort'] || 'name';
      this.selectedAvailability = params['availability'] || '';
      this.selectedBrand = params['brand'] || '';
      this.selectedCategory = params['category'] || '';

      window.scrollTo(0, 0);

      if (!this.dataLoaded) {
        this.loadProductsFromApi();
      } else {
        this.updateFilteredProducts();
        this.updatePagination();
      }
    });
  }

  loadProductsFromApi(): void {
    const apiUrl = `http://localhost:8080/api/products?page=${this.currPage}&size=${this.itemsPerPage}&search=${this.searchTerm}&category=${this.selectedCategory}&brand=${this.selectedBrand}&availability=${this.selectedAvailability}&sort=${this.currentSort}`;
    this.http.get<ProductResponse>(apiUrl, {withCredentials: true}).subscribe(
      (data: any) => {
        console.log('Fetched products:', data);
        this.products = data.content;
        this.totalPages = data.totalPages;
        this.generatePageNumbers();
        this.currPage = data.number + 1; /*Backend page is zero-based, convert to one-based*/
        this.updatePagination();
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );
  }


  updateFilteredProducts(): void {
    this.filteredProducts = this.products.filter(product =>
      product.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    console.log('Filtered products:', this.filteredProducts);
  }

  updatePagination(): void {
    this.pagProducts = this.products;
  }


  updateUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currPage,
        search: this.searchTerm,
        sort: this.currentSort,
      },
      queryParamsHandling: 'merge',
    });
  }


  onSortChange(event: any): void {
    const sortOption = event.target.value;

    const sortMapping: { [key: string]: string } = {
      name_asc: 'name,asc',
      name_desc: 'name,desc',
      price_asc: 'price,asc',
      price_desc: 'price,desc',
    };

    const newSort = sortMapping[sortOption] || 'name,asc'; /*def to asc*/

    if (newSort !== this.currentSort) {
      this.currentSort = newSort;
      this.currPage = 1;
      this.updateUrl();
      this.loadProductsFromApi();
    }
  }




  toggleFilter(filter: string): void {
    this.activeFilters[filter] = !this.activeFilters[filter];
    const filterElement = document.getElementById(filter);

    if (filterElement) {
      const parentFilterElement = filterElement?.parentElement;
      if (parentFilterElement) {
        parentFilterElement.classList.toggle('active', this.activeFilters[filter]);
      }
    }
  }

/*checks if the filter is active*/
  isActive(option: string): boolean {
    return this.activeFilters[option] === true;
  }

  setActive(option: string): void {
    this.activeFilters[option] = !this.activeFilters[option];
  }

  generatePageNumbers(): void {
    const pagesToShow = 5;
    const startPage = Math.max(1, this.currPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + pagesToShow - 1);

    this.pageNumbers = [];

    if (this.totalPages <= 2) {
      this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    } else {
      for (let i = startPage; i <= endPage; i++) {
        this.pageNumbers.push(i);
      }
    }
  }

  goToPage(page: number): void {
    this.currPage = page;
    this.updateUrl();
    this.loadProductsFromApi();
  }

  goToFirstPage(): void {
    this.currPage = 1;
    this.updateUrl();
    this.loadProductsFromApi();
  }

  goToLastPage(): void {
    this.currPage = this.totalPages;
    this.updateUrl();
    this.loadProductsFromApi();
  }


}
