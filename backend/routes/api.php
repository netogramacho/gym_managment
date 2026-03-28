<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ExerciseController;
use App\Http\Controllers\Api\V1\ExerciseTypeController;
use App\Http\Controllers\Api\V1\MuscleGroupController;
use App\Http\Controllers\Api\V1\WorkoutController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/workouts', [WorkoutController::class, 'index']);
        Route::get('/workouts/{id}', [WorkoutController::class, 'show']);
        Route::post('/workouts', [WorkoutController::class, 'store']);
        Route::put('/workouts/{workout}', [WorkoutController::class, 'update']);
        Route::delete('/workouts/{workout}', [WorkoutController::class, 'destroy']);

        Route::get('/exercises', [ExerciseController::class, 'index']);
        Route::get('/exercises/{id}', [ExerciseController::class, 'show']);
        Route::middleware('role:admin')->group(function () {
            Route::post('/exercises', [ExerciseController::class, 'store']);
            Route::put('/exercises/{exercise}', [ExerciseController::class, 'update']);
            Route::delete('/exercises/{exercise}', [ExerciseController::class, 'destroy']);
        });

        Route::get('/muscle-groups', [MuscleGroupController::class, 'index']);
        Route::middleware('role:admin')->group(function () {
            Route::post('/muscle-groups', [MuscleGroupController::class, 'store']);
            Route::put('/muscle-groups/{muscleGroup}', [MuscleGroupController::class, 'update']);
            Route::delete('/muscle-groups/{muscleGroup}', [MuscleGroupController::class, 'destroy']);
        });

        Route::get('/exercise-types', [ExerciseTypeController::class, 'index']);
        Route::middleware('role:admin')->group(function () {
            Route::post('/exercise-types', [ExerciseTypeController::class, 'store']);
            Route::put('/exercise-types/{exerciseType}', [ExerciseTypeController::class, 'update']);
            Route::delete('/exercise-types/{exerciseType}', [ExerciseTypeController::class, 'destroy']);
        });
    });
});
