<?php

namespace App\Http\Responses\Auth;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class AuthResponse extends JsonResponse
{
    public function __construct(User $user, string $token, int $status = 200)
    {
        parent::__construct([
            'token' => $token,
            'user'  => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ],
        ], $status);
    }
}
