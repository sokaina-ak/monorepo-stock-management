<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//Auth routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->middleware('admin')->post('/auth/me', [AuthController::class, 'me']);
Route::middleware('auth:sanctum')->middleware('admin')->post('/auth/refresh', [AuthController::class, 'refresh']);

//Product routes
Route::middleware('auth:sanctum')->middleware('admin')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/search', [ProductController::class, 'search']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::get('/products/category-list', [ProductController::class, 'getCategories']);
    Route::get('/products/category/{category}', [ProductController::class, 'getByCategory']);
    Route::post('/products/add', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});