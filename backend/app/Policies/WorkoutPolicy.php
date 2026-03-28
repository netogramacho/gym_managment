<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Workout;

class WorkoutPolicy
{
    public function update(User $user, Workout $workout): bool
    {
        return $user->id === $workout->user_id
            || $user->id === $workout->created_by;
    }

    public function delete(User $user, Workout $workout): bool
    {
        return $user->id === $workout->user_id
            || $user->id === $workout->created_by;
    }
}
