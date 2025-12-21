<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'name' => 'John Doe',
            'email' => 'admin2@example.com',
            'username' => 'adminuser',
            'password' => Hash::make('admin'),
            'role' => 'admin',
        ]);

        Admin::create([
            'user_id' => $user->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'gender' => 'male',
            'image' => 'https://example.com/image.jpg',
        ]);
    }
}
