<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ToolsController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/compress-image', [ToolsController::class, 'compressImage']);
Route::post('/merge-pdf', [ToolsController::class, 'mergePdf']);
