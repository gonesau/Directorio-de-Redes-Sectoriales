<?php
/**
 * SISTEMA DE REGISTRO DE EVENTOS - DIRECTORIO
 * ============================================
 * Guarda eventos del directorio en archivo de texto
 */

// Permitir CORS si es necesario
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener los datos enviados desde el cliente
    $data = json_decode(file_get_contents('php://input'), true);

    $accion = $data['accion'] ?? 'Desconocida';
    $detalle = $data['detalle'] ?? 'Sin detalle';
    $timestamp = date('Y-m-d H:i:s');
    
    // Obtener información adicional
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'Desconocida';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Desconocido';

    // Crear el registro en formato legible
    $registro = "[$timestamp] Acción: $accion | Detalle: $detalle | IP: $ip\n";

    // Ruta del archivo .txt en la raíz del proyecto
    $archivo = 'registros_directorio.txt';

    // Guardar el registro en el archivo
    if (file_put_contents($archivo, $registro, FILE_APPEND | LOCK_EX)) {
        echo json_encode([
            'status' => 'success', 
            'message' => 'Registro guardado correctamente.',
            'timestamp' => $timestamp
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error', 
            'message' => 'No se pudo guardar el registro.'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'status' => 'error', 
        'message' => 'Método no permitido. Use POST.'
    ]);
}
?>