import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})



export class ProductDetailsComponent implements OnInit{
  productId: string | null = null;

  constructor(private route: ActivatedRoute) {}


  ngOnInit(): void {
  this.productId = this.route.snapshot.paramMap.get('id');
  }
}
