import {Component, effect, inject} from '@angular/core';
import {Inp} from "../../directives/inp";
import {Bt} from "../../directives/bt";
import {SignInController} from "../../controllers/sign-in-controller";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PageWrapper} from "../../widgets/page-wrapper/page-wrapper";
import {Router} from "@angular/router";

@Component(
    {
        imports: [
            Inp,
            Bt,
            ReactiveFormsModule,
            PageWrapper,
        ],
        selector: 'sign-in-form',
        providers: [SignInController],
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

            .span-full-sm {
                grid-column: span 1;
                @media (max-width: 768px) {
                    grid-column: span 3;
                }
            }

            .span-full-lg {
                grid-column: span 11;
                @media (max-width: 768px) {
                    grid-column: span 9;
                }
            }
        `,
        template: `
            <page-wrapper [state]="controller.state()">
                <form [formGroup]="formGrp">
                    <h2>Sign in</h2>
                    <div class="grid-12 gap-md align-center">
                        <label class="half-span-sm" for="username">User Name</label>
                        <input class="half-span-lg"
                               id="username"
                               type="text" Inp
                               formControlName="username">

                        <label class="half-span-sm" for="email">Email</label>
                        <input class="half-span-lg"
                               id="email"
                               type="text" Inp
                               formControlName="email">

                        <label class="span-full-sm" for="password">Password</label>
                        <input class="span-full-lg"
                               id="password"
                               type="password" Inp
                               formControlName="password">
                    </div>
                    <br>
                    <button type="submit" Bt (click)="onSubmitClicked()">
                        Sign in
                    </button>
                </form>
            </page-wrapper>
        `,
    }
)


export class SignInForm {
    controller: SignInController = inject(SignInController);
    router: Router = inject(Router);

    formGrp: FormGroup = new FormGroup({
        username: new FormControl<string|null>(null, [Validators.required]),
        email: new FormControl<string|null>(null, [Validators.required]),
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
            const email: string|null = this.formGrp.controls['email'].value;
            const password: string|null = this.formGrp.controls['password'].value;

            if (username && email && password) {
                this.controller.signIn({ username: username, email: email, password: password, is_admin: false });
            }
        }
    }
}

