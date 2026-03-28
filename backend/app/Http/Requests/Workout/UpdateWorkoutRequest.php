<?php

namespace App\Http\Requests\Workout;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkoutRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name'                       => ['sometimes', 'string', 'max:255'],
            'description'                => ['nullable', 'string'],
            'exercises'                  => ['sometimes', 'array', 'min:1'],
            'exercises.*.exercise_id'    => ['required_with:exercises', 'uuid', 'exists:exercises,id'],
            'exercises.*.sets'           => ['required_with:exercises', 'integer', 'min:1'],
            'exercises.*.reps'           => ['required_with:exercises', 'integer', 'min:1'],
            'exercises.*.weight'         => ['nullable', 'numeric', 'min:0'],
            'exercises.*.rest_seconds'   => ['nullable', 'integer', 'min:0'],
            'exercises.*.order'          => ['required_with:exercises', 'integer', 'min:0'],
        ];
    }
}
