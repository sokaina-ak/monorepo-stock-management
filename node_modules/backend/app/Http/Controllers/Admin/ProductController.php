<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', 10);
        $skip = $request->get('skip', 0);

        $products = Product::with('category')->skip($skip)->take($limit)->get();

        $products = $products->map(function ($product) {
            $data = $product->toArray();
            $data['category'] = $product->category->slug;
            return $data;
        });

        return response()->json($products);
    }

    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $limit = $request->get('limit', 10);
        $skip = $request->get('skip', 0);

        $products = Product::with('category')
            ->where('title', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->skip($skip)
            ->take($limit)
            ->get();

        $products = $products->map(function ($product) {
            $data = $product->toArray();
            $data['category'] = $product->category->slug;
            return $data;
        });

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);

        $data = $product->toArray();
        $data['category'] = $product->category->slug;

        return response()->json($data);
    }

    public function getCategories()
    {
        $categories = \App\Models\Category::pluck('slug');

        return response()->json($categories);
    }

    public function getByCategory($category, Request $request)
    {
        $limit = $request->get('limit', 10);
        $skip = $request->get('skip', 0);

        $categoryModel = \App\Models\Category::where('slug', $category)->firstOrFail();

        $products = Product::where('category_id', $categoryModel->id)
            ->skip($skip)
            ->take($limit)
            ->get();

        $products = $products->map(function ($product) use ($category) {
            $data = $product->toArray();
            $data['category'] = $category;
            return $data;
        });

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'discount_percentage' => 'nullable|numeric',
            'rating' => 'nullable|numeric',
            'stock' => 'nullable|integer',
            'brand' => 'nullable|string',
            'category' => 'required|string',
            'thumbnail' => 'nullable|string',
            'images' => 'nullable|array',
        ]);

        $category = \App\Models\Category::where('slug', $request->category)->firstOrFail();

        $data = $request->all();
        $data['category_id'] = $category->id;
        unset($data['category']);

        $product = Product::create($data);

        $product->load('category');
        $data = $product->toArray();
        $data['category'] = $product->category->slug;

        return response()->json($data, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'discount_percentage' => 'nullable|numeric',
            'rating' => 'nullable|numeric',
            'stock' => 'nullable|integer',
            'brand' => 'nullable|string',
            'category' => 'required|string',
            'thumbnail' => 'nullable|string',
            'images' => 'nullable|array',
        ]);

        $category = \App\Models\Category::where('slug', $request->category)->firstOrFail();

        $data = $request->all();
        $data['category_id'] = $category->id;
        unset($data['category']);

        $product->update($data);

        $product->load('category');
        $data = $product->toArray();
        $data['category'] = $product->category->slug;

        return response()->json($data);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }
}