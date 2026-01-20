<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shop;

class ShopController extends Controller
{
    /**
     * Get all shops with their products
     */
    public function index()
    {
        $shops = Shop::with('products')->get();

        return response()->json([
            'shops' => $shops
        ], 200);
    }

    /**
     * Get a single shop by ID with its products
     */
    public function show($id)
    {
        $shop = Shop::with('products')->find($id);

        if (!$shop) {
            return response()->json([
                'message' => 'Shop not found'
            ], 404);
        }

        return response()->json([
            'shop' => $shop
        ], 200);
    }
}
