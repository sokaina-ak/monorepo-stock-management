<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        $users = User::all();

        if ($products->isEmpty()) {
            $this->command->warn('No products found. Please run ProductSeeder first.');
            return;
        }

        $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        $paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
        $paymentMethods = ['credit_card', 'paypal', 'cash_on_delivery'];

        // create 50 orders
        for ($i = 0; $i < 50; $i++) {
            $productCount = rand(1, 5);
            $selectedProducts = $products->random($productCount);

            $subtotal = 0;
            $items = [];

            foreach ($selectedProducts as $product) {
                $quantity = rand(1, 3);
                $itemSubtotal = $product->price * $quantity;
                $subtotal += $itemSubtotal;

                $items[] = [
                    'product_id' => $product->id,
                    'product_title' => $product->title,
                    'product_price' => $product->price,
                    'quantity' => $quantity,
                    'subtotal' => $itemSubtotal,
                ];
            }

            $tax = $subtotal * 0.1; // 10% tax
            $shippingCost = rand(5, 25);
            $discount = rand(0, 50);
            $total = $subtotal + $tax + $shippingCost - $discount;

            $status = $statuses[array_rand($statuses)];
            $paymentStatus = $paymentStatuses[array_rand($paymentStatuses)];

            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => $users->isNotEmpty() ? $users->random()->id : null,
                'customer_name' => fake()->name(),
                'customer_email' => fake()->email(),
                'customer_phone' => fake()->phoneNumber(),
                'shipping_address' => fake()->address(),
                'billing_address' => fake()->address(),
                'status' => $status,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_cost' => $shippingCost,
                'discount' => $discount,
                'total' => $total,
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'payment_status' => $paymentStatus,
                'notes' => rand(0, 1) ? fake()->sentence() : null,
                'shipped_at' => $status === 'shipped' || $status === 'delivered' ? now()->subDays(rand(1, 30)) : null,
                'delivered_at' => $status === 'delivered' ? now()->subDays(rand(1, 15)) : null,
                'created_at' => now()->subDays(rand(1, 90)),
            ]);

            // create order items
            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_title' => $item['product_title'],
                    'product_price' => $item['product_price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['subtotal'],
                ]);
            }
        }
    }
}

