<?php

namespace App\Http\Requests\MuscleGroup;

use Illuminate\Foundation\Http\FormRequest;

class ImportMuscleGroupCsvRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
        ];
    }
}
