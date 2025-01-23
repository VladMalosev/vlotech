package com.vlotech.javabackend.mapper;

import com.vlotech.javabackend.service.ProductImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ProductImporterRunner implements CommandLineRunner {

    @Autowired
    private ProductImportService productImportService;

    @Override
    public void run(String... args) throws Exception {
        productImportService.importProductsFromFile("frontend/vlotech-angular/public/assets/data/accessories.json", "Accessories");
        productImportService.importProductsFromFile("frontend/vlotech-angular/public/assets/data/desktops.json", "desktops");
        productImportService.importProductsFromFile("frontend/vlotech-angular/public/assets/data/devices.json", "devices");
        productImportService.importProductsFromFile("frontend/vlotech-angular/public/assets/data/laptop.json", "laptop");
        productImportService.importProductsFromFile("frontend/vlotech-angular/public/assets/data/phones.json", "phones");
        productImportService.importProductsFromFile("frontend/vlotech-angular/public/assets/data/smartwatches.json", "smartwatches");
        productImportService.importProductsFromFile("frontend/vlotech-angular/public/assets/data/tv.json", "tv");
    }
}

