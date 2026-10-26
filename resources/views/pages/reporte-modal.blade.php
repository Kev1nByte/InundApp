
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

        <form id="flood-report-form">
            <div class="form-group">
                <label for="report-location">Ubicación de la calle</label>
                <input
                    id="report-location"
                    name="location"
                    type="text"
                    placeholder="Ej. Av. principal, Paita"
                    required
                    maxlength="150"
                >
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
                    placeholder="Describe qué sucede en esta calle..."
                    maxlength="1000"
                    required
                ></textarea>
            </div>

            <div class="form-group">
                <label for="report-photo">Fotografía (opcional)</label>
                <input
                    id="report-photo"
                    name="photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                >
                <small>JPG, PNG o WebP. Máximo 5 MB.</small>
            </div>

            <p id="report-form-message" class="form-message" hidden></p>

            <button class="submit-report-button" type="submit">
                Continuar con el reporte
            </button>
        </form>
    </section>
</div>
