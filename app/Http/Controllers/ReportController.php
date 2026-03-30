<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request, ReportService $reportService): Response
    {
        abort_unless($request->user()->can('reports.view'), 403);

        return Inertia::render('Reports/Index', $reportService->overview($request->only([
            'from',
            'to',
            'branch_id',
        ])));
    }
}
