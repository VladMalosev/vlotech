import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

interface ProductResponse {
  content: any[];
}


@Component({
  selector: 'app-product-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  materials: any[] = []; // placeholders
  colors: any[] = ['Red', 'Blue', 'Green']; // example color options
  sizes: any[] = ['S', 'M', 'L', 'XL']; // example size options
  filteredProducts: any[] = [];
  pagProducts: any[] = [];
  searchTerm: string = '';
  activeFilters: { [key: string]: boolean } = {};

  currPage: number = 1;
  itemsPerPage: number = 40;

  // Current sorting option
  currentSort: string = 'name';

  // Flag to track if data has been loaded
  dataLoaded: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Check query params on load
    this.route.queryParams.subscribe(params => {
      this.currPage = params['page'] || 1;
      this.searchTerm = params['search'] || ''; // Get search term from query params
      this.currentSort = params['sort'] || 'name';

      // Load JSON data only once if not loaded
      if (!this.dataLoaded) {
        this.loadProductsFromApi();
      } else {
        this.updateFilteredProducts();
        this.updatePagination();
      }
    });
  }

  loadProductsFromApi(): void {
    this.http.get<ProductResponse>(`http://localhost:8080/api/products?search=${this.searchTerm}&page=${this.currPage}&size=${this.itemsPerPage}`).subscribe(
      (data) => {
        console.log('Fetched products:', data); // Log the full response
        this.products = data.content; // Now, this works because 'content' exists on the response object
        console.log('Assigned products:', this.products); // Verify products data

        // Check if all products have the 'name' property
        this.products.forEach(product => {
          console.log('Product name:', product.name); // Log the name to verify
        });

        this.dataLoaded = true;
        this.updateFilteredProducts();
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

    this.sortProducts(this.currentSort);
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);

    // Ensure that currPage doesn't exceed the total number of pages
    if (this.currPage > totalPages) {
      this.currPage = totalPages;
    }

    const startIndex = (this.currPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currPage < Math.ceil(this.filteredProducts.length / this.itemsPerPage)) {
      this.currPage++;
      this.updatePagination();
      this.updateUrl();
    }
  }

  previousPage(): void {
    if (this.currPage > 1) {
      this.currPage--;
      this.updatePagination();
      this.updateUrl();
    }
  }

  updateUrl(): void {
    // Update the URL query parameters without reloading the page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currPage, sort: this.currentSort, search: this.searchTerm },
      queryParamsHandling: 'merge',
    });
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currPage = 1; // Reset to first page for new search
    this.updateFilteredProducts();
    this.updateUrl();
  }

  onSortChange(event: any): void {
    const sortOption = event.target.value;
    this.currentSort = sortOption; // Update the current sorting option
    this.updateFilteredProducts(); // Apply the sorting
    this.updatePagination();
    this.updateUrl();
  }

  sortProducts(sortOption: string): void {
    console.log('Sorting products by:', sortOption);

    // Check if 'name' exists
    this.filteredProducts.forEach(product => {
      if (!product.name) {
        console.warn('Missing name property for product:', product);
      }
    });

    if (sortOption === 'name_asc') {
      this.filteredProducts.sort((a, b) => a.name?.localeCompare(b.name));
    } else if (sortOption === 'name_desc') {
      this.filteredProducts.sort((a, b) => b.name?.localeCompare(a.name));
    }
  }


  navigateToProductDetails(): void {
    // to-do
  }

  toggleFilter(filter: string): void {
    console.log('Toggling filter: ', filter);
    this.activeFilters[filter] = !this.activeFilters[filter];

    console.log('activeFilters: ', this.activeFilters);

    const filterElement = document.getElementById(filter);
    if (filterElement) {
      console.log('Toggling element: ', filterElement);
      const parentFilterElement = filterElement?.parentElement;
      if (parentFilterElement) {
        console.log('Toggling parent element: ', parentFilterElement);
        parentFilterElement.classList.toggle('active', this.activeFilters[filter]);
      }    }
  }



  isActive(option: string): boolean {
    return this.activeFilters[option] === true;
  }

  setActive(option: string): void {
    this.activeFilters[option] = !this.activeFilters[option];
  }



  protected readonly Math = Math;
}





