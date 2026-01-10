<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Shop;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1️⃣ Users
        User::factory()->count(5)->create(['role' => 'customer']);
        User::factory()->count(3)->create(['role' => 'shop_owner']);
        User::factory()->create(['role' => 'admin']);

        // 2️⃣ Shops
        Shop::factory()->count(8)->create();

        // 3️⃣ Products
        Product::factory()->count(20)->create();

        // 4️⃣ Orders + OrderItems
        Order::factory()->count(10)->create()->each(function($order){
            // Pick 1-3 random products
            $products = Product::inRandomOrder()->take(fake()->numberBetween(1,3))->get();

            // If there are products, pick the shop_id from the first product
            $shop_id = $products->first()->shop_id ?? 1; // fallback to 1 if no product

            // Assign shop_id to order
            $order->update(['shop_id' => $shop_id]);

            foreach($products as $product){
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => fake()->numberBetween(1,5),
                    'price' => $product->price,
                    //'shop_id' => $product->shop_id, // include shop_id in order items
                ]);
            }

            // Update total_amount
            $order->update([
                'total_amount' => $order->orderItems->sum(fn($item) => $item->quantity * $item->price),
            ]);
        });
    }
}
