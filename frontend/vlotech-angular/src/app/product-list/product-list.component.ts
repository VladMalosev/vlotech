import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  // Store all products from JSON files
  products: any[] = [];

  // Pagination
  currPage: number = 1;
  itemsPerPage: number = 40;
  pagProducts: any[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Read the 'page' query parameter from the URL
    this.route.queryParams.subscribe(params => {
      this.currPage = params['page'] || 1; // Default to page 1 if no page param exists
      this.updatePagination();
    });

    // Load all JSON files
    this.loadJSONData('assets/data/laptops.json');
    this.loadJSONData('assets/data/phones.json');
    this.loadJSONData('assets/data/smartwatches.json');
    this.loadJSONData('assets/data/tv.json');
    this.loadJSONData('assets/data/desktops.json');
    this.loadJSONData('assets/data/accessories.json');
  }

  loadJSONData(filePath: string): void {
    this.http.get<any[]>(filePath).subscribe(
      (data) => {
        const cleanedData = data.map(product => {
          // Clean the name to remove extra descriptions
          if (product['Name']) {
            product['Name'] = product['Name'].split(' - ')[0];
          }
          return product;
        });
        this.products.push(...cleanedData);
        this.updatePagination();
      },
      (error) => {
        console.error(`Error loading ${filePath}:`, error);
      }
    );
  }

  updatePagination(): void {
    const startIndex = (this.currPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagProducts = this.products.slice(startIndex, endIndex);

  }

  nextPage(): void {
    if (this.currPage < Math.ceil(this.products.length / this.itemsPerPage)) {
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
    // Update the URL query parameter without reloading the page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currPage },
      queryParamsHandling: 'merge', // Merge existing query params
    });
  }

  navigateToProductDetails(): void {

  }

  protected readonly Math = Math;
}
