import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{
  banners = [
    {src: 'assets/banner/banner1.jpg', alt: 'Banner 1'},
    {src: 'assets/banner/banner2.jpg', alt: 'Banner 2'},
    {src: 'assets/banner/banner3.jpg', alt: 'Banner 3'},
  ];

  currentSlide = 0;
  sliderTransition = 'transform 0.5s ease-in-out'; //smooth trans between banners
  sliderTransform = 'translateX(0%)'; //init
  autoSlideInterval: any; //interval for auto sliding

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    clearInterval(this.autoSlideInterval);
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 10000); // 10sec
  }
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.banners.length;
    this.updateSliderTransform();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.banners.length) % this.banners.length;
    this.updateSliderTransform();
  }


  updateSliderTransform() {
    this.sliderTransform = `translateX(-${this.currentSlide * 100}%)`;
  }

  resetAutoSlide() {
    clearInterval(this.autoSlideInterval);
    this.startAutoSlide();
  }
  goToSlide(index: number) {
    this.currentSlide = index;
    this.updateSliderTransform();
    this.resetAutoSlide();
  }
}
