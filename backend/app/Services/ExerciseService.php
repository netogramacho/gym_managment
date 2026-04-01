<?php

namespace App\Services;

use App\Models\Exercise;
use Illuminate\Pagination\LengthAwarePaginator;

class ExerciseService
{
    public function list(int $perPage = 20): LengthAwarePaginator
    {
        return Exercise::with('type', 'muscleGroups')->paginate($perPage);
    }

    public function find(string $id): Exercise
    {
        return Exercise::with('type', 'muscleGroups')->findOrFail($id);
    }

    public function create(array $data, string $createdBy): Exercise
    {
        $exercise = Exercise::create([
            'name'             => $data['name'],
            'description'      => $data['description'],
            'media_url'        => $data['media_url'] ?? null,
            'exercise_type_id' => $data['exercise_type_id'] ?? null,
            'created_by'       => $createdBy,
        ]);

        if (!empty($data['muscle_groups'])) {
            $exercise->muscleGroups()->sync($data['muscle_groups']);
        }

        return $exercise->load('type', 'muscleGroups');
    }

    public function update(Exercise $exercise, array $data): Exercise
    {
        $exercise->update(array_filter([
            'name'             => $data['name'] ?? null,
            'description'      => $data['description'] ?? null,
            'media_url'        => $data['media_url'] ?? null,
            'exercise_type_id' => array_key_exists('exercise_type_id', $data) ? $data['exercise_type_id'] : $exercise->exercise_type_id,
        ], fn ($v) => $v !== null));

        if (array_key_exists('muscle_groups', $data)) {
            $exercise->muscleGroups()->sync($data['muscle_groups'] ?? []);
        }

        return $exercise->load('type', 'muscleGroups');
    }

    public function delete(Exercise $exercise): void
    {
        $exercise->delete();
    }
}
