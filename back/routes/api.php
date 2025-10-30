<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::post('/create', function () {
    $room = strtoupper(substr(md5(uniqid()), 0, 5));
    $data = ['fen' => 'start', 'turn' => 'white'];
    Storage::put("games/{$room}.json", json_encode($data));
    return response()->json(['room' => $room]);
});

Route::get('/game/{room}', function ($room) {
    if (!Storage::exists("games/{$room}.json")) {
        return response()->json(['error' => 'Not found'], 404);
    }
    return response()->json(json_decode(Storage::get("games/{$room}.json"), true));
});

Route::post('/game/{room}/move', function (Request $request, $room) {
    if (!Storage::exists("games/{$room}.json")) {
        return response()->json(['error' => 'Not found'], 404);
    }

    $payload = $request->validate([
        'fen'  => 'required|string',
        'turn' => 'nullable|string'
    ]);

    Storage::put("games/{$room}.json", json_encode([
        'fen'  => $payload['fen'],
        'turn' => $payload['turn'] ?? 'white',
    ]));

    return response()->json(['status' => 'ok']);
});
