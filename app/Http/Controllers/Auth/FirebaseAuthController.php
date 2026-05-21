<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class FirebaseAuthController extends Controller
{
    /**
     * Handle the Firebase ID Token verification and user login.
     * Note: In a production app, you should use a library like 'google/auth' 
     * or 'kreait/laravel-firebase' to verify the ID token's signature via Firebase public keys.
     * For this prototype, we'll receive the user details directly after client-side verification.
     */
    public function login(Request $request)
    {
        $request->validate([
            'uid' => 'required|string',
            'email' => 'required|email',
            'name' => 'required|string',
            'avatar' => 'nullable|string',
        ]);

        $user = User::where('google_id', $request->uid)
            ->orWhere('email', $request->email)
            ->first();

        if ($user) {
            $user->update([
                'google_id' => $request->uid,
                'avatar' => $request->avatar,
            ]);
        } else {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'google_id' => $request->uid,
                'avatar' => $request->avatar,
                'password' => bcrypt(Str::random(24)),
                'is_active' => true,
            ]);

            if (method_exists($user, 'assignRole')) {
                $user->assignRole('staff');
            }
        }

        Auth::login($user, true);

        return response()->json([
            'redirect' => route('dashboard')
        ]);
    }
}
