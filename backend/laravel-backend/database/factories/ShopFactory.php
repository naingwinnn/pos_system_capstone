<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Shop>
 */
class ShopFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
        'Electronics' => ['Laptop', 'Smartphone', 'Headphones'],
        'Clothing'    => ['Shirt', 'Jeans', 'Jacket'],
        'Groceries'   => ['Fruits', 'Vegetables', 'Snacks'],
        'Books'       => ['Novel', 'Magazine', 'Comic'],
        'Beauty'      => ['Lipstick', 'Perfume', 'Skincare'],
        ];
        
        $shopOwner = \App\Models\User::where('role', 'shop_owner')->inRandomOrder()->first();
        $shopCategory = fake()->randomElement(array_keys($categories));

        
        return [
            'user_id' => $shopOwner?->id ?? 1,
            'name' => fake()->company(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'description' => fake()->sentence(10),
            'category' => $shopCategory,

        ];
    }
}
