<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Main Categories
        $electronics = Category::create(['name' => 'Electronics', 'slug' => 'electronics']);
        $clothing = Category::create(['name' => 'Clothing', 'slug' => 'clothing']);
        $books = Category::create(['name' => 'Books', 'slug' => 'books']);
        $home = Category::create(['name' => 'Home & Garden', 'slug' => 'home-garden']);
        $sports = Category::create(['name' => 'Sports & Outdoors', 'slug' => 'sports-outdoors']);
        $beauty = Category::create(['name' => 'Beauty & Personal Care', 'slug' => 'beauty-personal-care']);
        $toys = Category::create(['name' => 'Toys & Games', 'slug' => 'toys-games']);
        $automotive = Category::create(['name' => 'Automotive', 'slug' => 'automotive']);

        // Electronics Subcategories
        Category::create(['name' => 'Smartphones', 'slug' => 'smartphones', 'parent_id' => $electronics->id]);
        Category::create(['name' => 'Laptops', 'slug' => 'laptops', 'parent_id' => $electronics->id]);
        Category::create(['name' => 'Tablets', 'slug' => 'tablets', 'parent_id' => $electronics->id]);
        Category::create(['name' => 'Headphones', 'slug' => 'headphones', 'parent_id' => $electronics->id]);
        Category::create(['name' => 'Cameras', 'slug' => 'cameras', 'parent_id' => $electronics->id]);
        Category::create(['name' => 'Smart Watches', 'slug' => 'smart-watches', 'parent_id' => $electronics->id]);

        // Clothing Subcategories
        Category::create(['name' => "Men's Clothing", 'slug' => 'mens-clothing', 'parent_id' => $clothing->id]);
        Category::create(['name' => "Women's Clothing", 'slug' => 'womens-clothing', 'parent_id' => $clothing->id]);
        Category::create(['name' => "Kids' Clothing", 'slug' => 'kids-clothing', 'parent_id' => $clothing->id]);
        Category::create(['name' => 'Shoes', 'slug' => 'shoes', 'parent_id' => $clothing->id]);
        Category::create(['name' => 'Accessories', 'slug' => 'accessories', 'parent_id' => $clothing->id]);

        // Books Subcategories
        Category::create(['name' => 'Fiction', 'slug' => 'fiction', 'parent_id' => $books->id]);
        Category::create(['name' => 'Non-Fiction', 'slug' => 'non-fiction', 'parent_id' => $books->id]);
        Category::create(['name' => 'Educational', 'slug' => 'educational', 'parent_id' => $books->id]);
        Category::create(['name' => 'Comics & Graphic Novels', 'slug' => 'comics-graphic-novels', 'parent_id' => $books->id]);

        // Home & Garden Subcategories
        Category::create(['name' => 'Furniture', 'slug' => 'furniture', 'parent_id' => $home->id]);
        Category::create(['name' => 'Kitchen & Dining', 'slug' => 'kitchen-dining', 'parent_id' => $home->id]);
        Category::create(['name' => 'Home Decor', 'slug' => 'home-decor', 'parent_id' => $home->id]);
        Category::create(['name' => 'Garden Tools', 'slug' => 'garden-tools', 'parent_id' => $home->id]);
        Category::create(['name' => 'Bedding', 'slug' => 'bedding', 'parent_id' => $home->id]);

        // Sports & Outdoors Subcategories
        Category::create(['name' => 'Fitness Equipment', 'slug' => 'fitness-equipment', 'parent_id' => $sports->id]);
        Category::create(['name' => 'Outdoor Recreation', 'slug' => 'outdoor-recreation', 'parent_id' => $sports->id]);
        Category::create(['name' => 'Team Sports', 'slug' => 'team-sports', 'parent_id' => $sports->id]);
    }
}