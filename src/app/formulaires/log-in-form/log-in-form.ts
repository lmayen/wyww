import {Component, effect, inject} from '@angular/core';
import {Bt} from "../../directives/bt";
import {Inp} from "../../directives/inp";
import {SignInController} from "../../controllers/sign-in-controller";
import {Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LogInController} from "../../controllers/log-in-controller";

@Component(
    {
        imports: [
            Bt,
            Inp,
            ReactiveFormsModule
        ],
        selector: 'log-in-form',
        providers: [LogInController],
        styles: `
            .half-span-sm {
                grid-column: span 1;
                @media (max-width: 768px) {
                    grid-column: span 3;
                }
            }

            .half-span-lg {
                grid-column: span 5;
                @media (max-width: 768px) {
                    grid-column: span 9;
                }
            }
        `,
        template: `
            <form [formGroup]="formGrp">
                <h2>Log in</h2>
                <div class="grid-12 gap-md align-center">
                    <label class="half-span-sm" for="username">User Name</label>
                    <input class="half-span-lg" id="username" type="text" Inp formControlName="username">

                    <label class="half-span-sm" for="password">Password</label>
                    <input class="half-span-lg" id="password" type="password" Inp formControlName="password">
                </div>
                <br>
                <button type="submit" Bt (click)="onSubmitClicked()">
                    Log in
                </button>
            </form>
        `,
    }
)


export class LogInForm {
    controller: LogInController = inject(LogInController);
    router: Router = inject(Router);

    formGrp: FormGroup = new FormGroup({
        username: new FormControl<string|null>(null, [Validators.required]),
        password: new FormControl<string|null>(null, [Validators.required]),
    });

    constructor() {
        effect(() => {
            if (typeof this.controller.user() !== 'undefined') {
                this.router.navigate(['/recommendation']);
            }
        });
    }

    onSubmitClicked(): void {
        this.formGrp.markAllAsTouched();
        if (this.formGrp.valid) {
            const username: string|null = this.formGrp.controls['username'].value;
            const password: string|null = this.formGrp.controls['password'].value;

            if (username && password) {
                this.controller.logIn({ username: username, password: password});
            }
        }
    }
}
