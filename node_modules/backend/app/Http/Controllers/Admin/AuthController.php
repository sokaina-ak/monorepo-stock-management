<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        \Log::info('Login attempt', ['username' => $request->username, 'password_length' => strlen($request->password)]);

        $user = User::where('username', $request->username)->where('role', 'admin')->with('admin')->first();

        if (!$user) {
            \Log::info('User not found', ['username' => $request->username]);
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!Hash::check($request->password, $user->password)) {
            \Log::info('Password check failed', ['user_id' => $user->id]);
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        $admin = $user->admin;

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'firstName' => $admin ? $admin->first_name : null,
            'lastName' => $admin ? $admin->last_name : null,
            'gender' => $admin ? $admin->gender : null,
            'image' => $admin ? $admin->image : null,
            'accessToken' => $token,
            'refreshToken' => $token, //For simplicity
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('admin');
        $admin = $user->admin;

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'firstName' => $admin ? $admin->first_name : null,
            'lastName' => $admin ? $admin->last_name : null,
            'gender' => $admin ? $admin->gender : null,
            'image' => $admin ? $admin->image : null,
        ]);
    }

    public function refresh(Request $request)
    {
        $request->validate([
            'refreshToken' => 'required|string',
        ]);

        //For simplicity, since Sanctum uses personal access tokens, 
        //we can just return a new token or handle refresh differently.
        //But for now, since the fake API has refresh, we'll create a new token.

        $user = $request->user();
        $user->tokens()->delete(); //Delete old tokens
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'accessToken' => $token,
            'refreshToken' => $token,
        ]);
    }
}