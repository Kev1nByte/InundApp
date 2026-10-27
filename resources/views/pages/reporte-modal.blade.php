
<div id="report-modal" class="modal-overlay" hidden>
    <section
        class="report-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
    >
        <header class="report-modal__header">
            <div>
                <h2 id="report-modal-title">Reportar inundación</h2>
                <p>Ayúdanos a identificar calles afectadas en Paita.</p>
            </div>

            <button
                id="close-report-modal"
                class="modal-close"
                type="button"
                aria-label="Cerrar formulario"
            >
                &times;
            </button>
        </header>


    <form
        id="flood-report-form"
        data-store-url="{{ route('reportes.store') }}"
    >
        @csrf

        <div id="report-step-data">
            <div class="report-step-indicator">
                <span class="active">1. Datos</span>
                <span>2. Revisar</span>
            </div>

            <div class="form-group">
                <label for="report-location">Ubicación del reporte</label>

                <input
                    id="report-location"
                    name="location"
                    type="text"
                    placeholder="Se registrará tu ubicación actual"
                    readonly
                    required
                >

                <button
                    id="select-location-button"
                    class="select-location-button"
                    type="button"
                >
                    📍 Usar mi ubicación actual
                </button>

                <input id="report-latitude" name="latitude" type="hidden">
                <input id="report-longitude" name="longitude" type="hidden">

                <small>
                    El reporte se registrará en tu posición actual. Debes permitir el acceso a tu ubicación.
                </small>
            </div>

            <div class="form-group">
                <label for="report-severity">Nivel de inundación</label>
                <select id="report-severity" name="severity" required>
                    <option value="">Selecciona un nivel</option>
                    <option value="low">Agua acumulada</option>
                    <option value="medium">Inundación importante</option>
                    <option value="high">Intransitable</option>
                </select>
            </div>

            <div class="form-group">
                <label for="report-description">Descripción</label>
                <textarea
                    id="report-description"
                    name="description"
                    rows="3"
                    maxlength="1000"
                    placeholder="Describe qué sucede en esta calle..."
                    required
                ></textarea>
            </div>

            <div class="form-group">
                <label for="report-photo">Fotografía de la inundación</label>

                 <!-- <input
                    id="report-photo"
                    name="photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required
                > -->

                <input
                    id="report-photo"
                    name="photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    capture="environment"
                    required
                >

                <small>
                    Toma una fotografía de la calle afectada. Máximo 5 MB.
                </small>
            </div>


            <p id="report-form-message" class="form-message" hidden></p>

            <button class="submit-report-button" type="submit">
                Revisar reporte →
            </button>
        </div>

        <!-- PASO 2: REVISIÓN -->
        <div id="report-step-review" hidden>
            <div class="report-step-indicator">
                <span>1. Datos</span>
                <span class="active">2. Revisar</span>
            </div>

            <h3>Revisa tu reporte</h3>
            <p>Verifica la información antes de confirmar.</p>

            <div class="report-review-card">
                <div class="review-item">
                    <span>📍 Ubicación</span>
                    <strong id="review-location">—</strong>
                    <small id="review-coordinates"></small>
                </div>

                <div class="review-item">
                    <span>🌊 Nivel de inundación</span>
                    <strong id="review-severity">—</strong>
                </div>

                <div class="review-item">
                    <span>📝 Descripción</span>
                    <p id="review-description">—</p>
                </div>

                <div class="review-item" id="review-photo-container" hidden>
                    <span>📷 Fotografía</span>
                    <img id="review-photo" alt="Fotografía adjunta">
                </div>
            </div>

            <p id="review-message" class="form-message" hidden></p>

            <div class="review-actions">
                <button
                    id="back-to-report"
                    class="select-location-button"
                    type="button"
                >
                    ← Volver a editar
                </button>

                <button
                    id="confirm-report"
                    class="submit-report-button"
                    type="button"
                >
                    Confirmar reporte
                </button>
            </div>
        </div>
    </form>

    </section>
</div>
