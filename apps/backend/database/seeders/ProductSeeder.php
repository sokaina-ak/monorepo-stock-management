<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Get categories by slug for dependency
        $smartphones = Category::where('slug', 'smartphones')->first();
        $laptops = Category::where('slug', 'laptops')->first();
        $tablets = Category::where('slug', 'tablets')->first();
        $headphones = Category::where('slug', 'headphones')->first();
        $cameras = Category::where('slug', 'cameras')->first();
        $mensClothing = Category::where('slug', 'mens-clothing')->first();
        $womensClothing = Category::where('slug', 'womens-clothing')->first();
        $shoes = Category::where('slug', 'shoes')->first();
        $fiction = Category::where('slug', 'fiction')->first();
        $furniture = Category::where('slug', 'furniture')->first();
        $kitchenDining = Category::where('slug', 'kitchen-dining')->first();
        $fitnessEquipment = Category::where('slug', 'fitness-equipment')->first();

        $products = [
            // Smartphones
            [
                'title' => 'iPhone 15 Pro',
                'description' => 'Latest iPhone with titanium design, A17 Pro chip, and Pro camera system',
                'price' => 999.00,
                'discount_percentage' => 5.0,
                'rating' => 4.8,
                'stock' => 0, // Out of stock
                'brand' => 'Apple',
                'category_id' => $smartphones->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/1/1.jpg', 'https://cdn.dummyjson.com/product-images/1/2.jpg'],
            ],
            [
                'title' => 'Samsung Galaxy S24 Ultra',
                'description' => 'Premium Android smartphone with S Pen and 200MP camera',
                'price' => 1199.00,
                'discount_percentage' => 8.0,
                'rating' => 4.7,
                'stock' => 32,
                'brand' => 'Samsung',
                'category_id' => $smartphones->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/2/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/2/1.jpg'],
            ],
            [
                'title' => 'Google Pixel 8 Pro',
                'description' => 'Google\'s flagship phone with advanced AI features and camera',
                'price' => 899.00,
                'discount_percentage' => 10.0,
                'rating' => 4.6,
                'stock' => 0, // Out of stock
                'brand' => 'Google',
                'category_id' => $smartphones->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/3/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/3/1.jpg'],
            ],
            [
                'title' => 'OnePlus 12',
                'description' => 'Flagship killer with Snapdragon 8 Gen 3 and fast charging',
                'price' => 699.00,
                'discount_percentage' => 12.0,
                'rating' => 4.5,
                'stock' => 56,
                'brand' => 'OnePlus',
                'category_id' => $smartphones->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/4/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/4/1.jpg'],
            ],
            [
                'title' => 'Xiaomi 14 Pro',
                'description' => 'High-performance smartphone with Leica camera partnership',
                'price' => 799.00,
                'discount_percentage' => 7.0,
                'rating' => 4.4,
                'stock' => 41,
                'brand' => 'Xiaomi',
                'category_id' => $smartphones->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/5/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/5/1.jpg'],
            ],

            // Laptops
            [
                'title' => 'MacBook Pro 16" M3 Max',
                'description' => 'Powerful laptop for professionals with M3 Max chip and Liquid Retina XDR display',
                'price' => 3999.00,
                'discount_percentage' => 3.0,
                'rating' => 4.9,
                'stock' => 0, // Out of stock
                'brand' => 'Apple',
                'category_id' => $laptops->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/6/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/6/1.jpg'],
            ],
            [
                'title' => 'Dell XPS 15',
                'description' => 'Premium Windows laptop with OLED display and Intel Core i9',
                'price' => 1899.00,
                'discount_percentage' => 10.0,
                'rating' => 4.6,
                'stock' => 22,
                'brand' => 'Dell',
                'category_id' => $laptops->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/7/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/7/1.jpg'],
            ],
            [
                'title' => 'HP Spectre x360',
                'description' => '2-in-1 convertible laptop with touchscreen and stylus support',
                'price' => 1299.00,
                'discount_percentage' => 8.0,
                'rating' => 4.5,
                'stock' => 18,
                'brand' => 'HP',
                'category_id' => $laptops->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/8/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/8/1.jpg'],
            ],
            [
                'title' => 'Lenovo ThinkPad X1 Carbon',
                'description' => 'Business laptop with premium build quality and excellent keyboard',
                'price' => 1499.00,
                'discount_percentage' => 12.0,
                'rating' => 4.7,
                'stock' => 25,
                'brand' => 'Lenovo',
                'category_id' => $laptops->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/9/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/9/1.jpg'],
            ],
            [
                'title' => 'ASUS ROG Zephyrus G16',
                'description' => 'Gaming laptop with RTX 4070 and high refresh rate display',
                'price' => 1999.00,
                'discount_percentage' => 15.0,
                'rating' => 4.8,
                'stock' => 12,
                'brand' => 'ASUS',
                'category_id' => $laptops->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/10/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/10/1.jpg'],
            ],

            // Tablets
            [
                'title' => 'iPad Pro 12.9" M2',
                'description' => 'Professional tablet with M2 chip and Liquid Retina XDR display',
                'price' => 1099.00,
                'discount_percentage' => 5.0,
                'rating' => 4.8,
                'stock' => 30,
                'brand' => 'Apple',
                'category_id' => $tablets->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/11/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/11/1.jpg'],
            ],
            [
                'title' => 'Samsung Galaxy Tab S9 Ultra',
                'description' => 'Large Android tablet with S Pen and AMOLED display',
                'price' => 1199.00,
                'discount_percentage' => 10.0,
                'rating' => 4.6,
                'stock' => 0, // Out of stock
                'brand' => 'Samsung',
                'category_id' => $tablets->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/12/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/12/1.jpg'],
            ],
            [
                'title' => 'Microsoft Surface Pro 9',
                'description' => '2-in-1 tablet with detachable keyboard and Windows 11',
                'price' => 999.00,
                'discount_percentage' => 8.0,
                'rating' => 4.5,
                'stock' => 24,
                'brand' => 'Microsoft',
                'category_id' => $tablets->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/13/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/13/1.jpg'],
            ],

            // Headphones
            [
                'title' => 'Sony WH-1000XM5',
                'description' => 'Premium noise-cancelling wireless headphones',
                'price' => 399.00,
                'discount_percentage' => 15.0,
                'rating' => 4.8,
                'stock' => 50,
                'brand' => 'Sony',
                'category_id' => $headphones->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/14/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/14/1.jpg'],
            ],
            [
                'title' => 'Apple AirPods Pro 2',
                'description' => 'Wireless earbuds with active noise cancellation',
                'price' => 249.00,
                'discount_percentage' => 10.0,
                'rating' => 4.7,
                'stock' => 0, // Out of stock
                'brand' => 'Apple',
                'category_id' => $headphones->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/15/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/15/1.jpg'],
            ],
            [
                'title' => 'Bose QuietComfort 45',
                'description' => 'Comfortable noise-cancelling headphones',
                'price' => 329.00,
                'discount_percentage' => 12.0,
                'rating' => 4.6,
                'stock' => 42,
                'brand' => 'Bose',
                'category_id' => $headphones->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/16/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/16/1.jpg'],
            ],

            // Cameras
            [
                'title' => 'Canon EOS R5',
                'description' => 'Professional mirrorless camera with 45MP sensor',
                'price' => 3899.00,
                'discount_percentage' => 5.0,
                'rating' => 4.9,
                'stock' => 0, // Out of stock
                'brand' => 'Canon',
                'category_id' => $cameras->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/17/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/17/1.jpg'],
            ],
            [
                'title' => 'Sony Alpha A7 IV',
                'description' => 'Full-frame mirrorless camera with 33MP sensor',
                'price' => 2499.00,
                'discount_percentage' => 8.0,
                'rating' => 4.8,
                'stock' => 14,
                'brand' => 'Sony',
                'category_id' => $cameras->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/18/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/18/1.jpg'],
            ],

            // Men's Clothing
            [
                'title' => 'Classic Fit T-Shirt',
                'description' => 'Comfortable cotton t-shirt in various colors',
                'price' => 29.99,
                'discount_percentage' => 20.0,
                'rating' => 4.3,
                'stock' => 150,
                'brand' => 'Classic',
                'category_id' => $mensClothing->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/19/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/19/1.jpg'],
            ],
            [
                'title' => 'Slim Fit Jeans',
                'description' => 'Premium denim jeans with stretch fabric',
                'price' => 79.99,
                'discount_percentage' => 25.0,
                'rating' => 4.4,
                'stock' => 0, // Out of stock
                'brand' => 'Denim',
                'category_id' => $mensClothing->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/20/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/20/1.jpg'],
            ],
            [
                'title' => 'Formal Dress Shirt',
                'description' => 'Professional dress shirt for office wear',
                'price' => 59.99,
                'discount_percentage' => 15.0,
                'rating' => 4.5,
                'stock' => 90,
                'brand' => 'Formal',
                'category_id' => $mensClothing->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/21/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/21/1.jpg'],
            ],

            // Women's Clothing
            [
                'title' => 'Summer Dress',
                'description' => 'Light and breezy summer dress in floral pattern',
                'price' => 49.99,
                'discount_percentage' => 30.0,
                'rating' => 4.6,
                'stock' => 85,
                'brand' => 'Fashion',
                'category_id' => $womensClothing->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/22/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/22/1.jpg'],
            ],
            [
                'title' => 'Blazer Jacket',
                'description' => 'Elegant blazer for professional or casual wear',
                'price' => 89.99,
                'discount_percentage' => 20.0,
                'rating' => 4.5,
                'stock' => 65,
                'brand' => 'Style',
                'category_id' => $womensClothing->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/23/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/23/1.jpg'],
            ],

            // Shoes
            [
                'title' => 'Running Shoes',
                'description' => 'Comfortable running shoes with cushioned sole',
                'price' => 129.99,
                'discount_percentage' => 25.0,
                'rating' => 4.7,
                'stock' => 110,
                'brand' => 'Nike',
                'category_id' => $shoes->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/24/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/24/1.jpg'],
            ],
            [
                'title' => 'Casual Sneakers',
                'description' => 'Stylish everyday sneakers',
                'price' => 79.99,
                'discount_percentage' => 20.0,
                'rating' => 4.4,
                'stock' => 95,
                'brand' => 'Adidas',
                'category_id' => $shoes->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/25/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/25/1.jpg'],
            ],
            [
                'title' => 'Leather Dress Shoes',
                'description' => 'Premium leather dress shoes for formal occasions',
                'price' => 199.99,
                'discount_percentage' => 15.0,
                'rating' => 4.6,
                'stock' => 45,
                'brand' => 'Leather',
                'category_id' => $shoes->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/26/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/26/1.jpg'],
            ],

            // Fiction Books
            [
                'title' => 'The Great Gatsby',
                'description' => 'Classic American novel by F. Scott Fitzgerald',
                'price' => 12.99,
                'discount_percentage' => 10.0,
                'rating' => 4.8,
                'stock' => 0, // Out of stock
                'brand' => 'Classic Literature',
                'category_id' => $fiction->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/27/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/27/1.jpg'],
            ],
            [
                'title' => '1984',
                'description' => 'Dystopian novel by George Orwell',
                'price' => 11.99,
                'discount_percentage' => 15.0,
                'rating' => 4.9,
                'stock' => 180,
                'brand' => 'Classic Literature',
                'category_id' => $fiction->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/28/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/28/1.jpg'],
            ],

            // Furniture
            [
                'title' => 'Modern Sofa',
                'description' => 'Comfortable 3-seater sofa with premium fabric',
                'price' => 899.99,
                'discount_percentage' => 20.0,
                'rating' => 4.5,
                'stock' => 0, // Out of stock
                'brand' => 'Home Comfort',
                'category_id' => $furniture->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/29/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/29/1.jpg'],
            ],
            [
                'title' => 'Office Desk',
                'description' => 'Ergonomic wooden desk with storage drawers',
                'price' => 299.99,
                'discount_percentage' => 25.0,
                'rating' => 4.6,
                'stock' => 30,
                'brand' => 'Workspace',
                'category_id' => $furniture->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/30/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/30/1.jpg'],
            ],

            // Kitchen & Dining
            [
                'title' => 'Stainless Steel Cookware Set',
                'description' => '10-piece professional cookware set',
                'price' => 199.99,
                'discount_percentage' => 30.0,
                'rating' => 4.7,
                'stock' => 55,
                'brand' => 'Kitchen Pro',
                'category_id' => $kitchenDining->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/31/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/31/1.jpg'],
            ],
            [
                'title' => 'Coffee Maker',
                'description' => 'Programmable drip coffee maker with timer',
                'price' => 89.99,
                'discount_percentage' => 20.0,
                'rating' => 4.4,
                'stock' => 70,
                'brand' => 'Brew Master',
                'category_id' => $kitchenDining->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/32/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/32/1.jpg'],
            ],

            // Fitness Equipment
            [
                'title' => 'Adjustable Dumbbells Set',
                'description' => 'Space-saving adjustable dumbbells 5-50 lbs',
                'price' => 349.99,
                'discount_percentage' => 15.0,
                'rating' => 4.6,
                'stock' => 40,
                'brand' => 'FitGear',
                'category_id' => $fitnessEquipment->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/33/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/33/1.jpg'],
            ],
            [
                'title' => 'Yoga Mat',
                'description' => 'Premium non-slip yoga mat with carrying strap',
                'price' => 39.99,
                'discount_percentage' => 25.0,
                'rating' => 4.5,
                'stock' => 125,
                'brand' => 'Yoga Life',
                'category_id' => $fitnessEquipment->id,
                'thumbnail' => 'https://cdn.dummyjson.com/product-images/34/thumbnail.jpg',
                'images' => ['https://cdn.dummyjson.com/product-images/34/1.jpg'],
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}