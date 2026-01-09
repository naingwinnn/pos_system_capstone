<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $shop = \App\Models\Shop::inRandomOrder()->first();

        $categories = [
            'Electronics' => ['Laptop', 'Smartphone', 'Headphones'],
            'Clothing'    => ['Shirt', 'Jeans', 'Jacket'],
            'Groceries'   => ['Fruits', 'Vegetables', 'Snacks'],
            'Books'       => ['Novel', 'Magazine', 'Comic'],
            'Beauty'      => ['Lipstick', 'Perfume', 'Skincare'],
        ];

        $productNames = $categories[$shop->category] ?? ['Generic Product'];

        return [
            'name' => fake()->randomElement($productNames),
            'price' => fake()->numberBetween(10, 500),
            'shop_id' => $shop->id,
        ];
    }
}
