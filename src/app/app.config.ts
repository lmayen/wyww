import {ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {routes} from './app.routes';
import {HttpInterceptorFn, provideHttpClient, withInterceptors} from "@angular/common/http";
import {environment} from "./environment";
import {AuthService} from "./services/auth-service";

const apiCredentialsInterceptor: HttpInterceptorFn = (request, next) => {
    const requestOrigin = new URL(request.url, window.location.origin).origin;
    const apiOrigin = new URL(environment.apiUrl).origin;

    // Only attach browser credentials to the VTracker backend
    if (requestOrigin !== apiOrigin) {
        return next(request);
    }

    return next(
        request.clone({
            withCredentials: true,
        }),
    );
};

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withInterceptors([apiCredentialsInterceptor])),
        provideAppInitializer(() => {
            const auth: AuthService = inject(AuthService);
            return auth.restoreSession();
        }),
    ]
};
