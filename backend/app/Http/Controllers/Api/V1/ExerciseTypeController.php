<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExerciseType\StoreExerciseTypeRequest;
use App\Http\Requests\ExerciseType\UpdateExerciseTypeRequest;
use App\Http\Resources\ExerciseTypeResource;
use App\Models\ExerciseType;
use App\Services\ExerciseTypeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ExerciseTypeController extends Controller
{
    public function __construct(private readonly ExerciseTypeService $exerciseTypeService) {}

    public function index(): AnonymousResourceCollection
    {
        return ExerciseTypeResource::collection($this->exerciseTypeService->list());
    }

    public function store(StoreExerciseTypeRequest $request): JsonResponse
    {
        $exerciseType = $this->exerciseTypeService->create(
            $request->validated()['name'],
            $request->user()->id,
        );

        return (new ExerciseTypeResource($exerciseType))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateExerciseTypeRequest $request, ExerciseType $exerciseType): ExerciseTypeResource
    {
        return new ExerciseTypeResource(
            $this->exerciseTypeService->update($exerciseType, $request->validated()['name'])
        );
    }

    public function destroy(ExerciseType $exerciseType): JsonResponse
    {
        $this->exerciseTypeService->delete($exerciseType);

        return response()->json(null, 204);
    }
}
