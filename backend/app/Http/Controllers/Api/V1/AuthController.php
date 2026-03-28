<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Responses\Auth\AuthResponse;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService) {}

    public function register(RegisterRequest $request): AuthResponse
    {
        $result = $this->authService->register($request->validated());

        return new AuthResponse($result['user'], $result['token'], 201);
    }

    public function login(LoginRequest $request): AuthResponse|JsonResponse
    {
        $result = $this->authService->login(
            $request->input('email'),
            $request->input('password'),
        );

        if ($result === null) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        return new AuthResponse($result['user'], $result['token']);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json(null, 204);
    }

    public function me(Request $request): AuthResponse
    {
        $user  = $request->user();
        $token = $request->bearerToken();

        return new AuthResponse($user, $token);
    }
}
