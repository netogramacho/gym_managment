<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\MuscleGroup\ImportMuscleGroupCsvRequest;
use App\Http\Requests\MuscleGroup\StoreMuscleGroupRequest;
use App\Http\Requests\MuscleGroup\UpdateMuscleGroupRequest;
use App\Http\Resources\MuscleGroupResource;
use App\Models\MuscleGroup;
use App\Services\MuscleGroupCsvImportService;
use App\Services\MuscleGroupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MuscleGroupController extends Controller
{
    public function __construct(
        private readonly MuscleGroupService $muscleGroupService,
        private readonly MuscleGroupCsvImportService $csvImportService,
    ) {}

    public function index(): AnonymousResourceCollection
    {
        return MuscleGroupResource::collection($this->muscleGroupService->list());
    }

    public function store(StoreMuscleGroupRequest $request): JsonResponse
    {
        $muscleGroup = $this->muscleGroupService->create(
            $request->validated()['name'],
            $request->user()->id,
        );

        return (new MuscleGroupResource($muscleGroup))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateMuscleGroupRequest $request, MuscleGroup $muscleGroup): MuscleGroupResource
    {
        return new MuscleGroupResource(
            $this->muscleGroupService->update($muscleGroup, $request->validated()['name'])
        );
    }

    public function destroy(MuscleGroup $muscleGroup): JsonResponse
    {
        $this->muscleGroupService->delete($muscleGroup);

        return response()->json(null, 204);
    }

    public function import(ImportMuscleGroupCsvRequest $request): JsonResponse
    {
        $result = $this->csvImportService->import(
            $request->file('file'),
            $request->user()->id,
        );

        return response()->json($result);
    }
}
