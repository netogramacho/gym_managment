<?php

namespace App\Http\Requests\MuscleGroup;

use Illuminate\Foundation\Http\FormRequest;

class StoreMuscleGroupRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
        ];
    }
}
