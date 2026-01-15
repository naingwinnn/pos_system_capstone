<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        \Log::info("REGISTER REQUEST:", $request->all());   // 👈 log frontend data
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'customer'
        ]);

        return response()->json([
            'user' => $user,
            // 'token' => Str::random(60)   // fake token, frontend just stores it
        ]);
    }
    // public function login(Request $request)
    // {
    //     \Log::info("LOGIN REQUEST:", $request->all());   // 👈 log frontend data

    //     $request->validate([
    //         'email'=>'required|email',
    //         'password'=>'required'
    //     ]);

    //     $user = User::where('email', $request->email)->first();

    //     if (!$user || !Hash::check($request->password, $user->password)) {
    //         return response()->json(['message'=>'Invalid credentials'],401);
    //     }



    //     Auth::login($user);

    //     // ✅ Log info to confirm
    //     \Log::info('User logged in:', [
    //     'user_id' => $user->id,
    //     'email' => $user->email,
    //     'session_id' => session()->getId(),  // shows session tied to cookie
    //     'guard' => Auth::getDefaultDriver()
    // ]);

    //     return response()->json([
    //         'user' => $user,
    //         // 'token' => Str::random(60)
    //     ]);
    // }  

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response([
                'message' => 'Invalid credentials',
            ], Response::HTTP_UNAUTHORIZED);
        };
        $user = Auth::user();

        $token = $user->createToken('token')->plainTextToken;

        // $cookie =cookie('jwt' ,$token , minutes:60* 24);
        // return response([
        //     'message' => "success",
        // ])->withCookie($cookie);

            return response()->json([
                'token' => $token,
                'user' => $user,
            ]);
    }
    public function user()
    {
      return Auth::user();

    }
}
