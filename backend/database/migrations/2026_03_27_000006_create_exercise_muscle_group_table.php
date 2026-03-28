<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercise_muscle_group', function (Blueprint $table): void {
            $table->foreignUuid('exercise_id')->constrained('exercises')->cascadeOnDelete();
            $table->foreignUuid('muscle_group_id')->constrained('muscle_groups')->cascadeOnDelete();
            $table->primary(['exercise_id', 'muscle_group_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercise_muscle_group');
    }
};
