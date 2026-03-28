<?php

namespace App\Http\Requests\ExerciseType;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExerciseTypeRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
        ];
    }
}
