<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    
    public function up(): void
    {
        Schema::create('flood_reports', function (Blueprint $table) {
            $table->id();

            // Ubicación seleccionada en el mapa
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);

            // Datos de la inundación
            $table->string('severity', 20);
            $table->text('description');

            // Ruta de la fotografía, si existe
            $table->string('photo_path')->nullable();

            // Estado inicial del reporte
            $table->string('status', 20)->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flood_reports');
    }
};
