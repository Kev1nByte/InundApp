
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FloodReportController;

Route::view('/', 'pages.mapa')->name('mapa');

Route::get('/reportes/crear', function () {
    return view('pages.reportes.crear');
})->name('reportes.create');

Route::post('/reportes', [FloodReportController::class, 'store'])
    ->name('reportes.store');

Route::get('/reportes', [FloodReportController::class, 'index'])
    ->name('reportes.index');