import {CanActivateFn, Router, Routes} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./services/auth-service";

const AuthGuard: CanActivateFn = (_route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAuthenticated()) {
        return true;
    }

    return (auth.isAuthenticated() && auth.isAdmin())
        ? true
        : router.createUrlTree(['home']); // TODO: to test
};

const AdminGuard: CanActivateFn = (_route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAuthenticated() && auth.isAdmin()) {
        return true;
    }

    return (auth.isAuthenticated() && auth.isAdmin())
        ? true
        : router.createUrlTree(['home']); // TODO: to test
};

export const GuestGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAuthenticated()) {
        return router.createUrlTree(['/recommendation']);
    }

    return true;
};

export const routes: Routes = [
    {
        path: 'home',
        canActivate: [GuestGuard],
        loadComponent: () => import("./pages/home-page/home-page").then(p => p.HomePage)
    },
    {
        path: 'browse',
        canActivate: [AuthGuard],
        loadComponent: () => import("./pages/browse-page/browse-page").then(p => p.BrowsePage)
    },
    {
        path: 'recommendation',
        canActivate: [AuthGuard],
        loadComponent: () => import("./pages/recommendation-page/recommendation-page").then(p => p.RecommendationPage)
    },
    // --- UTILITIES --- //
    {
        path: '',
        redirectTo:'home',
        pathMatch: 'full'
    },
    {
        path: '**',
        loadComponent: () => import('./pages/not-found-page/not-found-page').then(p => p.NotFoundPage),
    },
];
