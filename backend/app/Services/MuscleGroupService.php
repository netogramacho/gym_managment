<?php

namespace App\Services;

use App\Models\MuscleGroup;
use Illuminate\Pagination\LengthAwarePaginator;

class MuscleGroupService
{
    public function list(): LengthAwarePaginator
    {
        return MuscleGroup::paginate(20);
    }

    public function create(string $name, string $createdBy): MuscleGroup
    {
        return MuscleGroup::create(['name' => $name, 'created_by' => $createdBy]);
    }

    public function update(MuscleGroup $muscleGroup, string $name): MuscleGroup
    {
        $muscleGroup->update(['name' => $name]);

        return $muscleGroup->fresh();
    }

    public function delete(MuscleGroup $muscleGroup): void
    {
        $muscleGroup->delete();
    }
}
