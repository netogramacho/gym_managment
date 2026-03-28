<?php

namespace App\Http\Requests\Exercise;

use Illuminate\Foundation\Http\FormRequest;

class StoreExerciseRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name'             => ['required', 'string', 'max:255'],
            'description'      => ['required', 'string'],
            'media_url'        => ['nullable', 'url', 'max:2048'],
            'exercise_type_id' => ['nullable', 'uuid', 'exists:exercise_types,id'],
            'muscle_groups'    => ['nullable', 'array'],
            'muscle_groups.*'  => ['uuid', 'exists:muscle_groups,id'],
        ];
    }
}
