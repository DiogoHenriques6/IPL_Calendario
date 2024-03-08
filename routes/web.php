<?php

use App\Http\Controllers\ReactController;
use Felix\RickRoll\Facades\RickRoll;
use Illuminate\Support\Facades\Route;
use Rap2hpoutre\LaravelLogViewer\LogViewerController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Route::get('/', function () {
//    return view('welcome');
//});
/*
 * '.env',
 * '.git',
 * 'wp-admin',
 * 'wp-login.php',
 * 'composer.lock',
 * 'yarn.lock',
 * 'package-lock.json',
 * 'xmlrpc.php',
 * 'typo3',
 **/
RickRoll::routes();
Route::get('/dev/logs-viewer', [LogViewerController::class, 'index']);

/*
Route::get('/mailable/preview', function () {
    $calendar = \App\Models\Calendar::find(1);
    return new App\Mail\CalendarPublishedEmail($calendar);
});
Route::get('/mailable/send', function () {
    $calendar = \App\Models\Calendar::find(1);
    $students = $calendar->course->students()->pluck('email')->join(', ');
    if($students != "") {
        Mail::bcc($students)->send(new CalendarPublishedEmail($calendar));
    }
});
*/
Route::get('/exams/{exam}/calendar-event', [ReactController::class, 'icsDownload']);
Route::get('/calendario/{id}', [ReactController::class, 'index'])->name('calendar-detail');
Route::get('/{any}', [ReactController::class, 'index'])->where('any', '.*');
