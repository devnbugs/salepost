<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    /**
     * Handle the incoming request to load the public live homepage.
     */
    public function __invoke(): Response
    {
        $homepageData = $this->dashboardService->getPublicHomepageStats();

        return Inertia::render('welcome', [
            'stats' => $homepageData['stats'],
            'materials' => $homepageData['materials'],
        ]);
    }
}
