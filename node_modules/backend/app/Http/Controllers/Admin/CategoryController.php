<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        // Get all categories with their parent relationships
        $categories = Category::with('parent')->get();

        // Format categories to include parent slug if exists
        $formatted = $categories->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'parent_id' => $category->parent_id,
                'parent_slug' => $category->parent ? $category->parent->slug : null,
            ];
        });

        return response()->json($formatted);
    }

    public function getMainCategories()
    {
        // Get only categories without a parent (main categories)
        $categories = Category::whereNull('parent_id')->get();

        return response()->json($categories);
    }

    public function getSubcategories($parentSlug)
    {
        $parent = Category::where('slug', $parentSlug)->firstOrFail();
        $subcategories = Category::where('parent_id', $parent->id)->get();

        return response()->json($subcategories);
    }

    public function show($id)
    {
        $category = Category::with(['parent', 'children', 'products'])->findOrFail($id);

        $data = [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'parent_id' => $category->parent_id,
            'parent' => $category->parent ? [
                'id' => $category->parent->id,
                'name' => $category->parent->name,
                'slug' => $category->parent->slug,
            ] : null,
            'children' => $category->children->map(function ($child) {
                return [
                    'id' => $child->id,
                    'name' => $child->name,
                    'slug' => $child->slug,
                ];
            }),
            'products_count' => $category->products->count(),
        ];

        return response()->json($data);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        // Generate slug from name if not provided
        $slug = $request->slug ?? \Illuminate\Support\Str::slug($request->name);
        
        // Ensure slug is unique
        $originalSlug = $slug;
        $counter = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        $category = Category::create([
            'name' => $request->name,
            'slug' => $slug,
            'parent_id' => $request->parent_id,
        ]);

        $category->load('parent');
        $data = [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'parent_id' => $category->parent_id,
            'parent_slug' => $category->parent ? $category->parent->slug : null,
        ];

        return response()->json($data, 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug,' . $id,
            'parent_id' => 'nullable|exists:categories,id|not_in:' . $id, // Prevent self-reference
        ]);

        // Generate slug from name if not provided
        $slug = $request->slug ?? \Illuminate\Support\Str::slug($request->name);
        
        // Ensure slug is unique (excluding current category)
        if ($slug !== $category->slug) {
            $originalSlug = $slug;
            $counter = 1;
            while (Category::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        $category->update([
            'name' => $request->name,
            'slug' => $slug,
            'parent_id' => $request->parent_id,
        ]);

        $category->load('parent');
        $data = [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'parent_id' => $category->parent_id,
            'parent_slug' => $category->parent ? $category->parent->slug : null,
        ];

        return response()->json($data);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        
        // Check if category has products
        if ($category->products()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with associated products',
                'products_count' => $category->products()->count(),
            ], 422);
        }

        // Check if category has children
        if ($category->children()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with subcategories',
                'children_count' => $category->children()->count(),
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
