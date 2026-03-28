<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExerciseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'description'      => $this->description,
            'media_url'        => $this->media_url,
            'exercise_type_id' => $this->exercise_type_id,
            'exercise_type'    => new ExerciseTypeResource($this->whenLoaded('type')),
            'muscle_groups'    => MuscleGroupResource::collection($this->whenLoaded('muscleGroups')),
            'created_by'       => $this->created_by,
            'created_at'       => $this->created_at,
            'updated_at'       => $this->updated_at,
        ];
    }
}
