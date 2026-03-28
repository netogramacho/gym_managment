<?php

namespace App\Http\Requests\ExerciseType;

use Illuminate\Foundation\Http\FormRequest;

class StoreExerciseTypeRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
        ];
    }
}
