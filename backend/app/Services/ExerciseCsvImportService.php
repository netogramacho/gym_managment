<?php

namespace App\Services;

use App\Models\MuscleGroup;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ExerciseCsvImportService
{
    public function import(UploadedFile $file, string $createdBy): array
    {
        $muscleGroupMap = MuscleGroup::pluck('id', 'name')->toArray();

        $handle = fopen($file->getRealPath(), 'r');

        $validRows = [];
        $rejected  = [];
        $line      = 0;

        while (($row = fgetcsv($handle)) !== false) {
            $line++;

            $rejection = $this->validate($row, $line, $muscleGroupMap);

            if ($rejection !== null) {
                $rejected[] = $rejection;
                continue;
            }

            $validRows[] = $this->parseRow($row, $muscleGroupMap);
        }

        fclose($handle);

        if (!empty($validRows)) {
            $this->bulkInsert($validRows, $createdBy);
        }

        return ['imported' => count($validRows), 'rejected' => $rejected];
    }

    private function validate(array $row, int $line, array $muscleGroupMap): ?array
    {
        $name        = trim($row[0] ?? '');
        $description = trim($row[1] ?? '');
        $groupsRaw   = trim($row[2] ?? '');

        if ($name === '') {
            return ['line' => $line, 'reason' => 'O campo nome é obrigatório.'];
        }

        if (mb_strlen($name) > 255) {
            return ['line' => $line, 'reason' => 'O campo nome deve ter no máximo 255 caracteres.'];
        }

        if ($description === '') {
            return ['line' => $line, 'reason' => 'O campo descrição é obrigatório.'];
        }

        if ($groupsRaw !== '') {
            foreach (array_map('trim', explode(';', $groupsRaw)) as $groupName) {
                if ($groupName === '') {
                    continue;
                }

                if (!array_key_exists($groupName, $muscleGroupMap)) {
                    return ['line' => $line, 'reason' => "Grupo muscular \"{$groupName}\" não encontrado."];
                }
            }
        }

        return null;
    }

    private function parseRow(array $row, array $muscleGroupMap): array
    {
        $groupsRaw = trim($row[2] ?? '');
        $groupIds  = [];

        if ($groupsRaw !== '') {
            $names    = array_filter(array_map('trim', explode(';', $groupsRaw)));
            $groupIds = array_values(array_intersect_key($muscleGroupMap, array_flip($names)));
        }

        return [
            'name'        => trim($row[0]),
            'description' => trim($row[1]),
            'group_ids'   => $groupIds,
        ];
    }

    private function bulkInsert(array $validRows, string $createdBy): void
    {
        $now          = now();
        $exerciseRows = [];
        $pivotRows    = [];

        foreach ($validRows as $row) {
            $id = (string) Str::uuid();

            $exerciseRows[] = [
                'id'          => $id,
                'name'        => $row['name'],
                'description' => $row['description'],
                'created_by'  => $createdBy,
                'created_at'  => $now,
                'updated_at'  => $now,
            ];

            foreach ($row['group_ids'] as $groupId) {
                $pivotRows[] = [
                    'exercise_id'     => $id,
                    'muscle_group_id' => $groupId,
                ];
            }
        }

        DB::transaction(function () use ($exerciseRows, $pivotRows) {
            DB::table('exercises')->insert($exerciseRows);

            if (!empty($pivotRows)) {
                DB::table('exercise_muscle_group')->insert($pivotRows);
            }
        });
    }
}
