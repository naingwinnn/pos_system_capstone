<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ShopController;
use Illuminate\Http\Request;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/orders', [OrderController::class, 'orders']);
    Route::get('/shops', [ShopController::class, 'index']); // ✅ THIS IS THE KEY
    Route::get('/shops/{id}', [ShopController::class, 'show']); // single shop 
    Route::get('/user', [AuthController::class, 'user']);

});

Route::get('/test', function() {
    return response()->json(['message' => 'API works!']);
});
