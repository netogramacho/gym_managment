<?php

namespace App\Services;

use App\Models\ExerciseType;
use Illuminate\Pagination\LengthAwarePaginator;

class ExerciseTypeService
{
    public function list(): LengthAwarePaginator
    {
        return ExerciseType::paginate(20);
    }

    public function create(string $name, string $createdBy): ExerciseType
    {
        return ExerciseType::create(['name' => $name, 'created_by' => $createdBy]);
    }

    public function update(ExerciseType $exerciseType, string $name): ExerciseType
    {
        $exerciseType->update(['name' => $name]);

        return $exerciseType->fresh();
    }

    public function delete(ExerciseType $exerciseType): void
    {
        $exerciseType->delete();
    }
}
