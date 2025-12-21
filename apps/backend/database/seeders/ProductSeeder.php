<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'title' => 'iPhone 9',
                'description' => 'An apple mobile which is nothing like apple',
                'price' => 549,
                'discount_percentage' => 12.96,
                'rating' => 4.69,
                'stock' => 94,
                'brand' => 'Apple',
                'category_id' => 1,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/1/1.jpg', 'https://cdn.dummyjson.com/product-images/1/2.jpg'],
            ],
            [
                'title' => 'iPhone X',
                'description' => 'SIM-Free, Model A19211 6.5-inch Super Retina HD display',
                'price' => 899,
                'discount_percentage' => 17.94,
                'rating' => 4.44,
                'stock' => 34,
                'brand' => 'Apple',
                'category_id' => 1,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/2/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/2/1.jpg', 'https://cdn.dummyjson.com/product-images/2/2.jpg'],
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}