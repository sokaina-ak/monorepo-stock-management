<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit', 10);
        $skip = $request->get('skip', 0);
        $status = $request->get('status');

        $query = Order::with(['items.product', 'user']);

        if ($status) {
            $query->where('status', $status);
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->skip($skip)
            ->take($limit)
            ->get();

        $orders = $orders->map(function ($order) {
            return $this->formatOrder($order);
        });

        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::with(['items.product', 'user'])->findOrFail($id);
        return response()->json($this->formatOrder($order));
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'status' => 'nullable|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'nullable|in:pending,paid,failed,refunded',
            'notes' => 'nullable|string',
        ]);

        if ($request->has('status')) {
            $order->status = $request->status;
            
            // set timestamps based on status
            if ($request->status === 'shipped' && !$order->shipped_at) {
                $order->shipped_at = now();
            }
            if ($request->status === 'delivered' && !$order->delivered_at) {
                $order->delivered_at = now();
            }
        }

        if ($request->has('payment_status')) {
            $order->payment_status = $request->payment_status;
        }

        if ($request->has('notes')) {
            $order->notes = $request->notes;
        }

        $order->save();

        $order->load(['items.product', 'user']);
        return response()->json($this->formatOrder($order));
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return response()->json(['message' => 'Order deleted']);
    }

    private function formatOrder($order)
    {
        $data = $order->toArray();
        
        // format order items
        $data['items'] = $order->items->map(function ($item) {
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_title' => $item->product_title,
                'product_price' => $item->product_price,
                'quantity' => $item->quantity,
                'subtotal' => $item->subtotal,
                'product' => $item->product ? [
                    'id' => $item->product->id,
                    'title' => $item->product->title,
                    'thumbnail' => $item->product->thumbnail,
                ] : null,
            ];
        })->toArray();

        // format user info
        if ($order->user) {
            $data['user'] = [
                'id' => $order->user->id,
                'name' => $order->user->name,
                'email' => $order->user->email,
            ];
        }

        return $data;
    }
}

