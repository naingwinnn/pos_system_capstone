<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    public function orders(Request $request)
    {   
        $user = $request->user();
        \Log::info('Authenticated user:', ['user' => $request->user()]);

        
        $orders = Order::where('user_id', $request->user()?->id)->get();
        

        

        \Log::info("📦 ORDERS RETURNED:", $orders->toArray());

        return response()->json($orders);
    }
    
}
