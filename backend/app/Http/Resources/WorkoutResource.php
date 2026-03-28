<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkoutResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $this->description,
            'user_id'     => $this->user_id,
            'created_by'  => $this->created_by,
            'is_owner'    => $request->user()?->id === $this->user_id,
            'is_creator'  => $request->user()?->id === $this->created_by,
            'exercises'   => WorkoutExerciseResource::collection($this->whenLoaded('exercises')),
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,
        ];
    }
}
