
@extends('layouts.app')

@section('title', 'InundApp | Mapa de inundaciones')

@section('content')
    <header class="app-header">
        <div class="brand">Inund<span>App</span></div>

        <p class="subtitle">
            Mapa colaborativo de calles inundadas en Paita
        </p>

        <label class="sr-only" for="street-search">
            Buscar una calle
        </label>

        <input
            id="street-search"
            class="search-input"
            type="search"
            placeholder="Buscar una calle..."
            autocomplete="off"
        >
    </header>

    <nav class="map-legend" aria-label="Niveles de inundación">
        <span class="legend-item">
            <i class="legend-dot legend-dot--high"></i>
            Intransitable
        </span>

        <span class="legend-item">
            <i class="legend-dot legend-dot--medium"></i>
            Inundación importante
        </span>

        <span class="legend-item">
            <i class="legend-dot legend-dot--low"></i>
            Agua acumulada
        </span>
    </nav>

    <main class="map-page">
        <h1 class="map-title">Mapa de zonas afectadas</h1>

        <div
            id="map"
            role="application"
            aria-label="Mapa interactivo de Paita"
        ></div>

        <section class="notice" aria-label="Información importante">
            <h2>Consulta ciudadana</h2>
            <p>
                Consulta los reportes de inundación antes de desplazarte.
                Verifica la fecha y el estado de cada reporte.
            </p>
        </section>
    </main>

    <button
        id="report-button"
        class="report-button"
        type="button"
    >
        + Reportar inundación
    </button>
    
@include('pages.reporte-modal')
@endsection
