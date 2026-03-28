<?php

namespace App\Http\Requests\Workout;

use Illuminate\Foundation\Http\FormRequest;

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
}
