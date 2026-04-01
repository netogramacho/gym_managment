<?php

namespace App\Http\Requests\Workout;

use App\Models\TrainerStudent;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreWorkoutRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name'                       => ['required', 'string', 'max:255'],
            'description'                => ['nullable', 'string'],
            'user_id'                    => ['nullable', 'uuid', 'exists:users,id'],
            'exercises'                  => ['required', 'array', 'min:1'],
            'exercises.*.exercise_id'    => ['required', 'uuid', 'exists:exercises,id'],
            'exercises.*.sets'           => ['required', 'integer', 'min:1'],
            'exercises.*.reps'           => ['required', 'integer', 'min:1'],
            'exercises.*.weight'         => ['nullable', 'numeric', 'min:0'],
            'exercises.*.rest_seconds'   => ['nullable', 'integer', 'min:0'],
            'exercises.*.order'          => ['required', 'integer', 'min:0'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                $user = $this->user();
                $targetUserId = $this->input('user_id');

                if (
                    $user->role === 'trainer'
                    && $targetUserId
                    && $targetUserId !== $user->id
                ) {
                    $isStudent = TrainerStudent::where('trainer_id', $user->id)
                        ->where('student_id', $targetUserId)
                        ->exists();

                    if (! $isStudent) {
                        $validator->errors()->add('user_id', 'The selected user is not your student.');
                    }
                }
            },
        ];
    }
}
