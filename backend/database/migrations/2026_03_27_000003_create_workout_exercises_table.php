<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workout_exercises', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('workout_id')->constrained('workouts')->cascadeOnDelete();
            $table->foreignUuid('exercise_id')->constrained('exercises');
            $table->integer('sets');
            $table->integer('reps');
            $table->decimal('weight', 8, 2)->nullable();
            $table->integer('rest_seconds')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workout_exercises');
    }
};
