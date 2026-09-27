import {computed, inject, Service, Signal, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../environment";
import {UserData} from "../core/models/data";
import {catchError, EMPTY, map, Observable, of, tap, throwError} from "rxjs";
import {LogInParams, SignInParams} from "../core/parameters/auth";

@Service()
export class AuthService {
    private readonly http = inject(HttpClient);
    private uri: string = environment.apiUrl;

    private readonly currentArtistState: WritableSignal<UserData | null> = signal<UserData | null>(null);
    readonly currentArtist: Signal<UserData | null> = this.currentArtistState.asReadonly();
    readonly isAuthenticated: Signal<boolean> = computed<boolean>(() => this.currentArtistState() !== null);
    readonly isAdmin: Signal<boolean> = computed<boolean>(() => this.currentArtistState()?.is_admin ?? false);

    signIn(params: SignInParams): Observable<UserData> {
        return this.http.post<UserData>(`${this.uri}/auth/signin`, params).pipe(
            tap((user) => {
                this.currentArtistState.set(user);
            }),
            catchError((err: unknown) => {
                this.currentArtistState.set(null);
                return throwError(() => err);
            })
        );
    }

    login(params: LogInParams): Observable<UserData> {
        return this.http.post<UserData>(`${this.uri}/auth/login`, params).pipe(
            tap((artist) => {
                this.currentArtistState.set(artist);
            }),
            catchError((err: unknown) => {
                this.currentArtistState.set(null);
                return throwError(() => err);
            })
        );
    }

    loadCurrentArtist(): Observable<UserData> {
        return this.http.post<UserData>(`${this.uri}/auth/me`, null).pipe(
            tap((artist) => {
                this.currentArtistState.set(artist);
            }),
            catchError((err: unknown) => {
                this.currentArtistState.set(null);
                return throwError(() => err);
            })
        );
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${this.uri}/auth/logout`, null).pipe(
            tap(() => {
                this.currentArtistState.set(null);
            }),
            catchError((err: unknown) => {
                this.currentArtistState.set(null);
                return throwError(() => err);
            })
        );
    }

    restoreSession(): Observable<void> {
        return this.loadCurrentArtist().pipe(
            map(() => undefined),
            catchError((error: unknown) => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    this.currentArtistState.set(null);

                    // No valid session is a normal application state.
                    return of(undefined);
                }

                return throwError(() => error);
            }),
        );
    }
}
