import {inject, Injectable, signal, Signal, WritableSignal} from "@angular/core";
import {AuthService} from "../services/auth-service";
import {catchError, EMPTY, Subject, switchMap, tap} from "rxjs";
import {SignInParams} from "../core/parameters/auth";
import {UserData} from "../core/models/data";
import {toSignal} from "@angular/core/rxjs-interop";
import {WrapperState} from "../widgets/page-wrapper/page-wrapper";

@Injectable()
export class SignInController {
    private auth: AuthService = inject(AuthService);

    readonly state: WritableSignal<WrapperState> = signal<WrapperState>({status: "idle"});

    private readonly user$: Subject<SignInParams> = new Subject<SignInParams>();
    readonly user: Signal<UserData|undefined> = toSignal(
        this.user$.pipe(
            tap(() => {
                this.state.update(() => {return {status: "submitting"}})
            }),
            catchError(params => {
                console.error("error", params);
                return EMPTY;
            }),
            switchMap(params =>
                this.auth.signIn(params).pipe(
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

    signIn(params: SignInParams): void {
        this.state.update(() => {return {status: "idle"}})
        this.user$.next(params);
    }
}
