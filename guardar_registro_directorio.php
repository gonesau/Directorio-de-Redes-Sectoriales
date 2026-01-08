<?php
/**
 * SISTEMA DE REGISTRO DE EVENTOS - DIRECTORIO
 * ============================================
 * Guarda eventos del directorio en archivo de texto
 */

// Permitir CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Obtener los datos enviados desde el cliente
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Error al decodificar JSON: ' . json_last_error_msg());
        }

        $accion = isset($data['accion']) ? $data['accion'] : 'Desconocida';
        $detalle = isset($data['detalle']) ? $data['detalle'] : 'Sin detalle';
        $timestamp = date('Y-m-d H:i:s');
        
        // Obtener información adicional
        $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'Desconocida';
        $userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Desconocido';

        // Crear el registro en formato legible
        $registro = sprintf(
            "[%s] Acción: %s | Detalle: %s | IP: %s | User-Agent: %s\n",
            $timestamp,
            $accion,
            $detalle,
            $ip,
            substr($userAgent, 0, 100) // Limitar longitud
        );

        // Ruta del archivo .txt en la raíz del proyecto
        $archivo = __DIR__ . '/registros_directorio.txt';
        
        // Crear el archivo si no existe
        if (!file_exists($archivo)) {
            touch($archivo);
            chmod($archivo, 0666); // Dar permisos de escritura
        }
        
        // Verificar si el archivo es escribible
        if (!is_writable($archivo)) {
            throw new Exception('El archivo no tiene permisos de escritura. Ejecute: chmod 666 ' . $archivo);
        }

        // Guardar el registro en el archivo
        $result = file_put_contents($archivo, $registro, FILE_APPEND | LOCK_EX);
        
        if ($result === false) {
            throw new Exception('No se pudo escribir en el archivo');
        }
        
        echo json_encode([
            'status' => 'success', 
            'message' => 'Registro guardado correctamente.',
            'timestamp' => $timestamp,
            'bytes_written' => $result
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error', 
            'message' => $e->getMessage(),
            'timestamp' => date('Y-m-d H:i:s')
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