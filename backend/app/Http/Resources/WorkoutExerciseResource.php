<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkoutExerciseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'exercise_id'  => $this->exercise_id,
            'exercise'     => new ExerciseResource($this->whenLoaded('exercise')),
            'sets'         => $this->sets,
            'reps'         => $this->reps,
            'weight'       => $this->weight,
            'rest_seconds' => $this->rest_seconds,
            'order'        => $this->order,
        ];
    }
}
