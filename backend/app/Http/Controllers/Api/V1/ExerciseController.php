<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Exercise\StoreExerciseRequest;
use App\Http\Requests\Exercise\UpdateExerciseRequest;
use App\Http\Resources\ExerciseResource;
use App\Models\Exercise;
use App\Services\ExerciseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ExerciseController extends Controller
{
    public function __construct(private readonly ExerciseService $exerciseService) {}

    public function index(): AnonymousResourceCollection
    {
        return ExerciseResource::collection($this->exerciseService->list());
    }

    public function show(string $id): ExerciseResource
    {
        return new ExerciseResource($this->exerciseService->find($id));
    }

    public function store(StoreExerciseRequest $request): JsonResponse
    {
        $exercise = $this->exerciseService->create(
            $request->validated(),
            $request->user()->id,
        );

        return (new ExerciseResource($exercise))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateExerciseRequest $request, Exercise $exercise): ExerciseResource
    {
        return new ExerciseResource(
            $this->exerciseService->update($exercise, $request->validated())
        );
    }

    public function destroy(Exercise $exercise): JsonResponse
    {
        $this->exerciseService->delete($exercise);

        return response()->json(null, 204);
    }
}
