import {inject, Injectable, Signal, signal, WritableSignal} from "@angular/core";
import {AuthService} from "../services/auth-service";
import {WrapperState} from "../widgets/page-wrapper/page-wrapper";
import {catchError, EMPTY, Subject, switchMap, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";

@Injectable()
export class LogOutController {
    private auth: AuthService = inject(AuthService);

    readonly state: WritableSignal<WrapperState> = signal<WrapperState>({status: "idle"});

    private readonly user$: Subject<void> = new Subject<void>();
    readonly isAuthenticated: Signal<boolean> = this.auth.isAuthenticated;

    readonly user: Signal<void> = toSignal(
        this.user$.pipe(
            tap(() => {
                this.state.update(() => {return {status: "submitting"}})
            }),
            catchError(params => {
                console.error("error", params);
                return EMPTY;
            }),
            switchMap(() =>
                this.auth.logout().pipe(
                    tap(() => {
                        this.state.set({
                            status: 'success',
                        });
                    }),

                    catchError(err => {
                        const message: string =
                            err.error?.client_error
                            ?? 'Could not log in';

                        this.state.set({
                            status: 'error',
                            message,
                        });

                        return EMPTY;
                    }),
                )
            ),
        ),
        { initialValue: undefined }
    );

    logout(): void {
        this.state.update(() => {return {status: "idle"}})
        this.user$.next();
    }
}
