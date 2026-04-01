<?php

namespace App\Services;

use App\Models\TrainerStudent;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class TrainerStudentService
{
    public function list(User $trainer): Collection
    {
        return User::whereIn(
            'id',
            TrainerStudent::where('trainer_id', $trainer->id)->pluck('student_id')
        )->get();
    }

    public function addByEmail(User $trainer, string $email): User
    {
        $student = User::where('email', $email)->firstOrFail();

        if ($student->id === $trainer->id) {
            throw ValidationException::withMessages([
                'email' => ['You cannot add yourself as a student.'],
            ]);
        }

        $alreadyLinked = TrainerStudent::where('trainer_id', $trainer->id)
            ->where('student_id', $student->id)
            ->exists();

        if ($alreadyLinked) {
            throw ValidationException::withMessages([
                'email' => ['This user is already your student.'],
            ]);
        }

        TrainerStudent::create([
            'trainer_id' => $trainer->id,
            'student_id' => $student->id,
        ]);

        return $student;
    }

    public function remove(User $trainer, User $student): void
    {
        TrainerStudent::where('trainer_id', $trainer->id)
            ->where('student_id', $student->id)
            ->delete();
    }

    public function isStudent(User $trainer, string $studentId): bool
    {
        return TrainerStudent::where('trainer_id', $trainer->id)
            ->where('student_id', $studentId)
            ->exists();
    }
}
