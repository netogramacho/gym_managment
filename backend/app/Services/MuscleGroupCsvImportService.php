<?php

namespace App\Services;

use App\Models\MuscleGroup;
use Illuminate\Http\UploadedFile;

class MuscleGroupCsvImportService
{
    public function import(UploadedFile $file, string $createdBy): array
    {
        $existing = MuscleGroup::pluck('name')->map(fn ($n) => mb_strtolower($n))->flip()->toArray();

        $handle = fopen($file->getRealPath(), 'r');

        $imported    = 0;
        $rejected    = [];
        $line        = 0;
        $seenInFile  = [];

        while (($row = fgetcsv($handle)) !== false) {
            $line++;

            $name = trim($row[0] ?? '');

            if ($name === '') {
                $rejected[] = ['line' => $line, 'reason' => 'O campo nome é obrigatório.'];
                continue;
            }

            if (mb_strlen($name) > 255) {
                $rejected[] = ['line' => $line, 'reason' => 'O campo nome deve ter no máximo 255 caracteres.'];
                continue;
            }

            $nameLower = mb_strtolower($name);

            if (isset($existing[$nameLower])) {
                $rejected[] = ['line' => $line, 'reason' => "Grupo muscular \"{$name}\" já existe."];
                continue;
            }

            if (isset($seenInFile[$nameLower])) {
                $rejected[] = ['line' => $line, 'reason' => "Grupo muscular \"{$name}\" duplicado no arquivo."];
                continue;
            }

            $seenInFile[$nameLower] = true;

            MuscleGroup::create(['name' => $name, 'created_by' => $createdBy]);
            $imported++;
        }

        fclose($handle);

        return compact('imported', 'rejected');
    }
}
