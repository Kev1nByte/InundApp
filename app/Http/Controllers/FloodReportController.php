<?php

namespace App\Http\Controllers;

use App\Models\FloodReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Cloudinary\Cloudinary;

class FloodReportController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'severity' => ['required', 'in:low,medium,high'],
            'description' => ['required', 'string', 'max:1000'],
            'photo' => [
                'nullable',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120',
            ],
        ]);

        $photoUrl = null;

        if ($request->hasFile('photo')) {
            $cloudinary = new Cloudinary(
                config('services.cloudinary')
            );

            $result = $cloudinary->uploadApi()->upload(
                $request->file('photo')->getRealPath(),
                [
                    'folder' => 'inundapp/flood-reports',
                    'resource_type' => 'image',
                ]
            );

            $photoUrl = $result['secure_url'];
        }

        $report = FloodReport::create([
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'severity' => $validated['severity'],
            'description' => $validated['description'],
            'photo_path' => $photoUrl,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Reporte registrado correctamente.',
            'report_id' => $report->id,
        ], 201);
    }
}
