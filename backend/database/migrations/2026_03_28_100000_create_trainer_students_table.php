<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trainer_students', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('trainer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('student_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['trainer_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trainer_students');
    }
};
