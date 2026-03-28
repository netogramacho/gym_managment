<?php

namespace App\Http\Requests\MuscleGroup;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMuscleGroupRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
        ];
    }
}
