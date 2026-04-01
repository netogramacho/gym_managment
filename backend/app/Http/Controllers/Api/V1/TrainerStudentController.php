<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Trainer\AddStudentRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\TrainerStudentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TrainerStudentController extends Controller
{
    public function __construct(private readonly TrainerStudentService $service) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        return UserResource::collection(
            $this->service->list($request->user())
        );
    }

    public function store(AddStudentRequest $request): JsonResponse
    {
        $student = $this->service->addByEmail(
            $request->user(),
            $request->validated('email')
        );

        return (new UserResource($student))
            ->response()
            ->setStatusCode(201);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $this->service->remove($request->user(), $user);

        return response()->json(null, 204);
    }
}
