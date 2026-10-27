
<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'pages.mapa')->name('mapa');

Route::get('/reportes/crear', function () {
    return view('pages.reportes.crear');
})->name('reportes.create');

