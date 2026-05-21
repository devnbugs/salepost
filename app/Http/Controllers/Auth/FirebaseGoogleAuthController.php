<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class FirebaseGoogleAuthController extends Controller
{
    /**
     * Authenticate or register a user via Firebase Google OAuth.
     */
    public function authenticate(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'google_id' => ['required', 'string', 'max:255'],
            'branch_id' => ['nullable', 'exists:branches,id'],
            'new_company_name' => ['nullable', 'string', 'max:255'],
        ]);

        $email = $request->input('email');
        $name = $request->input('name');
        $googleId = $request->input('google_id');
        $branchId = $request->input('branch_id');
        $newCompanyName = $request->input('new_company_name');

        // 1. Resolve Company / Branch
        if (! empty($newCompanyName)) {
            // Register a new Company (Branch)
            $branchCode = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $newCompanyName), 0, 3));
            if (empty($branchCode)) {
                $branchCode = 'CO_'.rand(10, 99);
            }

            $branch = Branch::create([
                'name' => $newCompanyName,
                'code' => $branchCode,
                'is_active' => true,
                'is_default' => false,
            ]);

            $branchId = $branch->id;
            $isNewCompany = true;
        } else {
            $isNewCompany = false;
            if (empty($branchId)) {
                // Fallback to the default branch if nothing was selected
                $defaultBranch = Branch::where('is_default', true)->first() ?? Branch::first();
                $branchId = $defaultBranch ? $defaultBranch->id : null;
            }
        }

        // 2. Find or Create User
        $user = User::where('email', $email)->first();

        if ($user) {
            // Update existing user with Google ID and optional branch association
            $user->google_id = $googleId;
            if ($branchId && ! $user->branch_id) {
                $user->branch_id = $branchId;
            }
            $user->save();
        } else {
            // Register a new User
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'google_id' => $googleId,
                'branch_id' => $branchId,
                'job_title' => $isNewCompany ? 'Owner' : 'Operator',
                'password' => Hash::make(Str::random(32)),
                'is_active' => true,
            ]);
        }

        // 3. Log the User in
        Auth::login($user, true);

        // 4. Redirect to Dashboard
        return redirect()->intended('/dashboard');
    }
}
