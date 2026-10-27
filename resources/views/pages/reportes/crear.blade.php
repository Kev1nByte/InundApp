
@extends('layouts.app')

@section('content')
<div class="report-page">
    <div class="report-container">

        <a href="{{ route('mapa') }}" class="report-back">
            ← Volver al mapa
        </a>

        <header class="report-header">
            <span class="report-icon">🌧️</span>
            <h1>Reportar inundación</h1>
            <p>Ayúdanos a identificar las zonas afectadas
                y mantener informada a la comunidad.</p>
        </header>

        <form id="flood-report-form" class="report-form">

            @csrf

            <section class="report-section">
                <h2>📍 Ubicación del incidente</h2>
                <p class="report-help">
                    Coordenadas de la ubicación seleccionada en el mapa.
                </p>

                <div class="report-coordinates">
                    <div class="form-group">
                        <label for="latitude">Latitud *</label>
                        <input
                            type="number"
                            id="latitude"
                            name="latitude"
                            step="any"
                            min="-90"
                            max="90"
                            value="{{ request('lat') }}"
                            placeholder="-5.089200"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="longitude">Longitud *</label>
                        <input
                            type="number"
                            id="longitude"
                            name="longitude"
                            step="any"
                            min="-180"
                            max="180"
                            value="{{ request('lng') }}"
                            placeholder="-81.114400"
                            required
                        >
                    </div>
                </div>

                <p class="report-help">
                    Verifica que las coordenadas correspondan al lugar afectado.
                </p>
            </section>

            <section class="report-section">
                <h2>Información de la inundación</h2>

                <div class="form-group">
                    <label for="incident_type">
                        Tipo de incidencia *
                    </label>

                    <select id="incident_type"
                            name="incident_type" required>
                        <option value="">Selecciona una opción</option>
                        <option value="calle_inundada">Calle inundada</option>
                        <option value="viviendas_afectadas">Viviendas afectadas</option>
                        <option value="drenaje_colapsado">Drenaje colapsado</option>
                        <option value="desborde">Río o canal desbordado</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="severity">Nivel de gravedad *</label>

                    <select id="severity" name="severity" required>
                        <option value="">Selecciona la gravedad</option>
                        <option value="leve">Leve - Acumulación de agua</option>
                        <option value="moderada">Moderada - Tránsito dificultado</option>
                        <option value="grave">Grave - Zona peligrosa o viviendas afectadas</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="description">Descripción *</label>

                    <textarea
                        id="description"
                        name="description"
                        rows="5"
                        maxlength="1000"
                        placeholder="Describe lo que sucede, las calles afectadas y si el agua impide el tránsito..."
                        required
                    ></textarea>

                    <small class="report-help">
                        Máximo 1000 caracteres.
                    </small>
                </div>
            </section>

            <section class="report-section">
                <h2>📷 Fotografía de evidencia</h2>

                <div class="form-group">
                    <label for="evidence">Adjuntar fotografía</label>

                    <input
                        type="file"
                        id="evidence"
                        name="evidence"
                        accept="image/jpeg,image/png,image/webp"
                        required
                    >

                    <small class="report-help">
                        Formatos JPG, PNG o WEBP.
                    </small>

                    <img
                        id="photo-preview"
                        class="photo-preview"
                        alt="Vista previa de la fotografía"
                        hidden
                    >
                </div>
            </section>

            <div id="report-message"
                 class="report-message"
                 role="status"
                 aria-live="polite"></div>

            <button type="submit" class="report-submit">
                Enviar reporte
            </button>

            <p class="report-disclaimer">
                Registra información real y verifica los datos antes de enviar.
            </p>

        </form>
    </div>
</div>
@endsection
