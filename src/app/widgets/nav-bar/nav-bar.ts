import {Component, inject, signal, Signal, WritableSignal} from '@angular/core';
import {Bt} from "../../directives/bt";
import {FaIconComponent, IconDefinition} from "@fortawesome/angular-fontawesome";
import {
    faBars,
    faBurger, faImagePortrait,
    faRightFromBracket,
    faRightToBracket,
    faUser,
    faUserCog,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {BreakpointObserver} from "@angular/cdk/layout";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {AuthService} from "../../services/auth-service";
import {DropdownMenu} from "../dropdown-menu/dropdown-menu";
import {LogOutController} from "../../controllers/log-out-controller";

@Component(
    {
        imports: [
            Bt,
            FaIconComponent,
            DropdownMenu,
        ],
        selector: 'nav-bar',
        providers: [LogOutController],
        styles: `
            h1, h2, h3, h4 {
                margin-block: 0;
                text-align: center;
            }

            .menu-bt {
                @media (max-width: 768px) {
                    width: 60vw;
                }
            }

            .container {
                border-bottom: 1px solid var(--outline-variant-color);
                position: sticky;
                top: 0;
                left: 0;
                background-color: var(--background-color);
                z-index: 50;
            }

            .bar {
                width: min(var(--page-min-pixels), 100vw - var(--page-padding));
                margin-inline: auto;
            }

            .bar-flex {
                display: flex;
                width: 100%;
                gap: var(--gap-md);
                padding-top: var(--pad-sm);
                padding-bottom: var(--pad-sm);
                align-items: center;
            }

            .overlay {
                width: calc(100vw - var(--pad-lg) * 2);
                height: calc(100vh - var(--pad-lg) * 2);
                position: absolute;
                top: 0;
                left: 0;
                z-index: 500;
                background-color: var(--accent-container-color);
                color: var(--on-accent-container-color);
                gap: var(--gap-md);
                padding: var(--pad-lg);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .close-bt-container {
                position: absolute;
                top: var(--pad-lg);
                right: var(--pad-lg);
                width: 38px;
                height: 38px;

                button {
                    width: auto;
                }
            }

            // ANIMATIONS
            .slide-in {
                animation: slide-in 200ms ease-out;
            }

            @keyframes slide-in {
                from {
                    transform: translateY(-100vh);
                }

                to {
                    transform: translateY(0);
                }
            }

            .slide-out {
                animation: slide-out 200ms ease-out;
            }

            @keyframes slide-out {
                from {
                    transform: translateY(0);
                }

                to {
                    transform: translateY(-100vh);
                }
            }
        `,
        template: `
            @if (menuOverlayVisibility()) {
                <div class="overlay" animate.enter="slide-in" animate.leave="slide-out">
                    <h1>What You Wanna Watch</h1>
                    <br>

                    <button Bt [variant]="'outlined'" [rounded]="true" class="menu-bt">Browse</button>
                    <button Bt [severity]="'primary'" [rounded]="true" class="menu-bt">Recommend me</button>

                    <span class="divider-v"></span>

                    <button Bt [severity]="'secondary'"
                            [variant]="'outlined'"
                            [rounded]="true" class="menu-bt"
                            (click)="onLogoutClicked()">
                        <fa-icon [icon]="faLogout"/>
                        Log out
                    </button>

                    <div class="close-bt-container">
                        <button Bt [severity]="'secondary'"
                                [variant]="'outlined'"
                                [circle]="true"
                                (click)="toggleMenuOverlay()">
                            <fa-icon [icon]="faClose"/>
                        </button>
                    </div>
                </div>
            }

            <div class="container">
                <div class="bar">
                    <div class="bar-flex">
                        @if (isCompact()) {
                            <h3>WYWW</h3>
                            @if (isAuthenticated()) {
                                <span class="spacer"></span>
                                <button Bt [severity]="'primary'"
                                        [variant]="'text'"
                                        [circle]="true"
                                        (click)="toggleMenuOverlay()">
                                    <fa-icon [icon]="faMenuBars"/>
                                </button>
                            }
                        } @else {
                            <h2>What You Wanna Watch</h2>
                            @if (isAuthenticated()) {
                                <span class="spacer"></span>
                                <button Bt [variant]="'text'" [rounded]="true">Browse</button>
                                <button Bt [severity]="'primary'" [rounded]="true">Recommend me</button>
                                <button Bt [severity]="'primary'"
                                        [variant]="'outlined'"
                                        [circle]="true" (click)="menu.open($event)">
                                    <fa-icon [icon]="faUser"/>
                                </button>
                                <dropdown-menu #menu>
                                    <button Bt [severity]="'secondary'" [variant]="'text'" (click)="onLogoutClicked()">
                                        <fa-icon [icon]="faLogout"/>
                                        Log out
                                    </button>
                                </dropdown-menu>
                            }
                        }
                    </div>
                </div>
            </div>
        `,
    }
)
export class NavBar {
    protected readonly faUser: IconDefinition = faUser;
    protected readonly faMenuBars: IconDefinition = faBars;
    protected readonly faLogout: IconDefinition = faRightFromBracket;
    protected readonly faClose: IconDefinition = faXmark;

    private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
    private logoutController: LogOutController = inject(LogOutController);

    protected isAuthenticated: Signal<boolean> = this.logoutController.isAuthenticated;

    isCompact: Signal<boolean> = toSignal(
        this.breakpointObserver
            .observe('(max-width: 768px)')
            .pipe(map(result => result.matches)),
        { initialValue: false }
    );

    protected menuOverlayVisibility: WritableSignal<boolean> = signal<boolean>(false);
    toggleMenuOverlay(): void {
        this.menuOverlayVisibility.update(x => !x);
    }

    onLogoutClicked(): void {
        this.logoutController.logout();
    }
}
