<?php
/**
 * API Proxy для безпечної роботи з Wargaming API
 * 
 * Цей скрипт виступає проксі між клієнтським JavaScript та API Wargaming.
 * Це дозволяє захистити API ключ від публічного доступу.
 * 
 * @version 1.0.0
 * @author G_UA Alliance Team
 */

// Налаштування
$api_key = 'f5f97f92233a59f3d8dbaec28d22ce0f'; // Ваш API ключ Wargaming
$allowed_endpoints = [
    'clans/info',        // Інформація про клани
    'clanratings/clans', // Рейтинги кланів
    'account/info'       // Інформація про гравців
];

// Налаштування кешування
$cache_enabled = true;
$cache_time = 3600; // 1 година в секундах
$cache_dir = __DIR__ . '/cache/wargaming_api/';

// Налаштування безпеки
$allowed_referers = [
    'https://your-domain.com', 
    'http://localhost'
]; // Дозволені реферери
$rate_limit = 10; // Запитів в хвилину

// Функція для перевірки реферера
function checkReferer() {
    global $allowed_referers;
    
    // Якщо список дозволених рефереров порожній, пропускаємо перевірку
    if (empty($allowed_referers)) {
        return true;
    }
    
    // Якщо HTTP_REFERER відсутній, блокуємо доступ
    if (!isset($_SERVER['HTTP_REFERER'])) {
        return false;
    }
    
    $referer = $_SERVER['HTTP_REFERER'];
    
    // Перевіряємо, чи починається реферер з будь-якого з дозволених
    foreach ($allowed_referers as $allowed) {
        if (strpos($referer, $allowed) === 0) {
            return true;
        }
    }
    
    return false;
}

// Функція для валідації параметрів
function validateParams() {
    global $allowed_endpoints;
    
    // Перевіряємо обов'язкові параметри
    if (!isset($_GET['endpoint']) || empty($_GET['endpoint'])) {
        return false;
    }
    
    // Перевіряємо, чи є ендпоінт в списку дозволених
    $endpoint = trim($_GET['endpoint']);
    $endpoint_allowed = false;
    
    foreach ($allowed_endpoints as $allowed) {
        if (strpos($endpoint, $allowed) !== false) {
            $endpoint_allowed = true;
            break;
        }
    }
    
    if (!$endpoint_allowed) {
        return false;
    }
    
    return true;
}

// Функція для отримання унікального ідентифікатора запиту
function getCacheKey() {
    return md5(serialize($_GET));
}

// Функція для перевірки кешу
function getCache($key) {
    global $cache_dir, $cache_time;
    
    $file = $cache_dir . $key . '.json';
    
    if (file_exists($file)) {
        $file_time = filemtime($file);
        
        // Перевіряємо, чи кеш ще актуальний
        if (time() - $file_time < $cache_time) {
            return file_get_contents($file);
        }
    }
    
    return false;
}

// Функція для запису в кеш
function saveCache($key, $data) {
    global $cache_dir;
    
    // Створюємо директорію кешу, якщо вона не існує
    if (!is_dir($cache_dir)) {
        mkdir($cache_dir, 0755, true);
    }
    
    $file = $cache_dir . $key . '.json';
    file_put_contents($file, $data);
}

// Перевіряємо реферер
if (!checkReferer()) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode(['status' => 'error', 'message' => 'Access denied']);
    exit;
}

// Валідуємо параметри
if (!validateParams()) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['status' => 'error', 'message' => 'Invalid parameters']);
    exit;
}

// Отримуємо ендпоінт та параметри
$endpoint = trim($_GET['endpoint']);
unset($_GET['endpoint']); // Видаляємо ендпоінт з GET параметрів

// Додаємо API ключ
$_GET['application_id'] = $api_key;

// Перевіряємо кеш, якщо увімкнено
$cache_key = getCacheKey();
$cached_data = false;

if ($cache_enabled) {
    $cached_data = getCache($cache_key);
    
    if ($cached_data !== false) {
        // Відправляємо кешовані дані
        header('Content-Type: application/json');
        header('X-Cache: HIT');
        echo $cached_data;
        exit;
    }
}

// Формуємо URL для запиту до API
$base_url = 'https://api.worldoftanks.eu/';

// Будуємо повний URL
$url = $base_url . $endpoint . '/?';

// Додаємо параметри
foreach ($_GET as $key => $value) {
    $url .= urlencode($key) . '=' . urlencode($value) . '&';
}

$url = rtrim($url, '&');

// Виконуємо запит
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 5);
curl_setopt($curl, CURLOPT_TIMEOUT, 10);
curl_setopt($curl, CURLOPT_USERAGENT, 'G_UA Alliance API Proxy');

$response = curl_exec($curl);
$http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

// Перевіряємо успішність запиту
if ($http_code !== 200 || $response === false) {
    header('HTTP/1.1 ' . ($http_code ?: 500) . ' Error');
    echo json_encode(['status' => 'error', 'message' => 'API request failed']);
    exit;
}

// Зберігаємо результат в кеш, якщо увімкнено
if ($cache_enabled) {
    saveCache($cache_key, $response);
}

// Відправляємо відповідь клієнту
header('Content-Type: application/json');
header('X-Cache: MISS');
echo $response;
