<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Workout\StoreWorkoutRequest;
use App\Http\Requests\Workout\UpdateWorkoutRequest;
use App\Http\Resources\WorkoutResource;
use App\Models\Workout;
use App\Services\WorkoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class WorkoutController extends Controller
{
    public function __construct(private readonly WorkoutService $workoutService) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        return WorkoutResource::collection(
            $this->workoutService->list($request->user())
        );
    }

    public function show(string $id): WorkoutResource
    {
        return new WorkoutResource($this->workoutService->find($id));
    }

    public function store(StoreWorkoutRequest $request): JsonResponse
    {
        $workout = $this->workoutService->create($request->validated(), $request->user());

        return (new WorkoutResource($workout))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateWorkoutRequest $request, Workout $workout): WorkoutResource
    {
        $this->authorize('update', $workout);

        return new WorkoutResource(
            $this->workoutService->update($workout, $request->validated())
        );
    }

    public function destroy(Workout $workout): JsonResponse
    {
        $this->authorize('delete', $workout);

        $this->workoutService->delete($workout);

        return response()->json(null, 204);
    }
}
