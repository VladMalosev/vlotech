import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

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
        this.loadJSONData('assets/data/laptop.json');
        this.loadJSONData('assets/data/accessories.json');
        this.loadJSONData('assets/data/desktops.json');
        this.loadJSONData('assets/data/devices.json');
        this.loadJSONData('assets/data/smartwatches.json');
        this.loadJSONData('assets/data/laptop.json');
        this.loadJSONData('assets/data/tv.json');
      } else {
        this.updateFilteredProducts();
        this.updatePagination();
      }
    });
  }

  loadJSONData(filePath: string): void {
    this.http.get<any[]>(filePath).subscribe(
      (data) => {
        const cleanedData = data.map(product => {
          if (product['Name']) {
            product['Name'] = product['Name'].split(' - ')[0];
          }
          return product;
        });
        this.products = [...this.products, ...cleanedData]; // Append new data to the products array
        this.dataLoaded = true;

        // After loading, update filtered products and pagination
        this.updateFilteredProducts();
        this.updatePagination();
      },
      (error) => {
        console.error(`Error loading ${filePath}:`, error);
      }
    );
  }

  updateFilteredProducts(): void {
    // If there is a search term, filter products accordingly
    this.filteredProducts = this.products.filter(product =>
      product.Name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Apply sorting to filtered products
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
    switch (sortOption) {
      case 'name':
        this.filteredProducts.sort((a, b) => a.Name.localeCompare(b.Name));
        break;
      case 'priceAsc':
        this.filteredProducts.sort((a, b) => a.Price - b.Price);
        break;
      case 'priceDesc':
        this.filteredProducts.sort((a, b) => b.Price - a.Price);
        break;
      case 'brand':
        this.filteredProducts.sort((a, b) => a.Brand.localeCompare(b.Brand));
        break;
    }
  }


  navigateToProductDetails(): void {
    // to-do
  }

  toggleFilter(filter: string): void {
    console.log('Toggling filter: ', filter);  // Add a log here to check if it's triggered.
    this.activeFilters[filter] = !this.activeFilters[filter];

    // Check if the activeFilters state is being updated correctly
    console.log('activeFilters: ', this.activeFilters); // This will give us a quick look at the filter status

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





