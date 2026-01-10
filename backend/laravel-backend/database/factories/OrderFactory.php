<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Order;
use App\Models\Shop;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        // Pick a random customer
        $customer = User::where('role', 'customer')->inRandomOrder()->first();

        // Pick a random shop
        $shop = Shop::inRandomOrder()->first();

        return [
            'user_id' => $customer?->id ?? 1,
            'shop_id' => $shop?->id ?? 1, // <-- add shop_id here
            'total_amount' => 0, // will update later after order items
            'status' => fake()->randomElement(['pending','completed','cancelled']),
        ];
    }
}
