import {inject, Injectable, Signal, signal, WritableSignal} from "@angular/core";
import {WrapperState} from "../widgets/page-wrapper/page-wrapper";
import {ApiService} from "../services/api-service";
import {WywwMovieData} from "../core/models/data";
import {toSignal} from "@angular/core/rxjs-interop";
import {catchError, EMPTY, finalize, Subject, switchMap, tap} from "rxjs";
import {FilterItem} from "../core/models/filters";
import {SortParameters} from "../core/models/sorting";
import {RecommendationData, RecommendedData, WatchedData, WatchlistData} from "../core/models/custom";


export interface RecommendationParams {
    filters: FilterItem[];
    sorting?: SortParameters;
}

@Injectable()
export class RecommendationController {
    private api: ApiService = inject(ApiService);

    readonly state: WritableSignal<WrapperState> = signal<WrapperState>({status: "idle"});

    private readonly recommendation$: Subject<void | string> = new Subject<void | string>();
    readonly recommendation: Signal<RecommendationData | undefined> = toSignal(
        this.recommendation$.pipe(
            tap(() => {
                this.state.update(() => {
                    return {status: "submitting"}
                })
            }),
            catchError(params => {
                console.error("error", params);
                return EMPTY;
            }),
            switchMap((params) => {
                    if (params == null) {
                        return this.api.newMovieRecommendation().pipe(
                            tap(() => {
                                this.state.set({status: 'success'});
                            }),

                            catchError(err => {
                                const message: string = err.error?.client_error ?? 'Could not log in';
                                this.state.set({status: 'error', message});

                                return EMPTY;
                            }),
                        )
                    } else {
                        return this.api.swapMovieRecommendation(params).pipe(
                            tap(() => {
                                this.state.set({status: 'success'});
                            }),

                            catchError(err => {
                                const message: string = err.error?.client_error ?? 'Could not log in';
                                this.state.set({status: 'error', message});

                                return EMPTY;
                            }),
                        )
                    }

                }
            ),
        ),
        {initialValue: undefined}
    );

    private readonly watchlist$: Subject<string> = new Subject<string>();
    readonly watchlist: Signal<WatchlistData | undefined> = toSignal(
        this.watchlist$.pipe(
            tap(() => {
                this.state.update(() => {
                    return {status: "submitting"}
                })
            }),
            catchError(params => {
                console.error("error", params);
                return EMPTY;
            }),
            switchMap((params) =>
                this.api.watchlist(params).pipe(
                    tap(() => {
                        this.state.set({status: 'success'});
                    }),

                    catchError(err => {
                        const message: string = err.error?.client_error ?? 'Could not log in';
                        this.state.set({status: 'error', message});

                        return EMPTY;
                    }),
                )
            ),
        ),
        {initialValue: undefined}
    );

    private readonly recommendToggle$: Subject<string> = new Subject<string>();
    private readonly recommendToggle: Signal<RecommendedData | undefined> = toSignal(
        this.recommendToggle$.pipe(
            tap(() => {
                this.state.update(() => {
                    return {status: "submitting"}
                })
            }),
            catchError(params => {
                console.error("error", params);
                return EMPTY;
            }),
            switchMap((params) =>
                this.api.toggleRecommended(params).pipe(
                    tap(() => {
                        this.state.set({status: 'success'});
                        this.watchlist$.next(params);
                    }),

                    catchError(err => {
                        const message: string = err.error?.client_error ?? 'Could not log in';
                        this.state.set({status: 'error', message});

                        return EMPTY;
                    }),
                )
            ),
        ),
        {initialValue: undefined}
    );

    private readonly watchToggle$: Subject<string> = new Subject<string>();
    private readonly watchToggle: Signal<WatchedData | undefined> = toSignal(
        this.watchToggle$.pipe(
            tap(() => {
                this.state.update(() => {
                    return {status: "submitting"}
                })
            }),
            catchError(params => {
                console.error("error", params);
                return EMPTY;
            }),
            switchMap((params) =>
                this.api.toggleWatched(params).pipe(
                    tap(() => {
                        this.state.set({status: 'success'});
                        this.watchlist$.next(params);
                    }),

                    catchError(err => {
                        const message: string = err.error?.client_error ?? 'Could not log in';
                        this.state.set({status: 'error', message});

                        return EMPTY;
                    }),
                )
            ),
        ),
        {initialValue: undefined}
    );

    find(): void {
        this.state.set({status: "idle"});
        this.recommendation$.next();
    }

    swap(id: string): void {
        this.state.set({status: "idle"});
        this.recommendation$.next(id);
    }

    getWatchlist(id: string): void {
        this.state.set({status: "idle"});
        this.watchlist$.next(id);
    }

    toggleWatched(id: string): void {
        this.state.set({status: "idle"});
        this.watchToggle$.next(id);
    }

    toggleRecommended(id: string): void {
        this.state.set({status: "idle"});
        this.recommendToggle$.next(id);
    }
}