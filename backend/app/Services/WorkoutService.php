<?php

namespace App\Services;

use App\Models\User;
use App\Models\Workout;
use Illuminate\Pagination\LengthAwarePaginator;

class WorkoutService
{
    public function list(User $user): LengthAwarePaginator
    {
        return Workout::with('exercises.exercise')
            ->where('user_id', $user->id)
            ->orWhere('created_by', $user->id)
            ->paginate(20);
    }

    public function find(string $id): Workout
    {
        return Workout::with('exercises.exercise')->findOrFail($id);
    }

    public function create(array $data, User $user): Workout
    {
        $userId = $user->role === 'user'
            ? $user->id
            : ($data['user_id'] ?? $user->id);

        $workout = Workout::create([
            'name'        => $data['name'],
            'description' => $data['description'] ?? null,
            'user_id'     => $userId,
            'created_by'  => $user->id,
        ]);

        $this->syncExercises($workout, $data['exercises']);

        return $workout->load('exercises.exercise');
    }

    public function update(Workout $workout, array $data): Workout
    {
        $workout->update(array_filter([
            'name'        => $data['name'] ?? null,
            'description' => array_key_exists('description', $data) ? $data['description'] : $workout->description,
        ], fn ($v) => $v !== null));

        if (isset($data['exercises'])) {
            $this->syncExercises($workout, $data['exercises']);
        }

        return $workout->load('exercises.exercise');
    }

    public function delete(Workout $workout): void
    {
        $workout->delete();
    }

    private function syncExercises(Workout $workout, array $exercises): void
    {
        $workout->exercises()->delete();

        $records = array_map(fn (array $ex) => [
            'workout_id'   => $workout->id,
            'exercise_id'  => $ex['exercise_id'],
            'sets'         => $ex['sets'],
            'reps'         => $ex['reps'],
            'weight'       => $ex['weight'] ?? null,
            'rest_seconds' => $ex['rest_seconds'] ?? null,
            'order'        => $ex['order'],
        ], $exercises);

        $workout->exercises()->createMany($records);
    }
}
