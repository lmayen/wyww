import {Component, inject, Signal} from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";

@Component(
    {
        imports: [],
        selector: 'nav-footer',
        styles: `
            h4 {
                margin-block: 0;
                color: var(--on-surface-variant-color);
            }
            span {
                color: var(--on-surface-variant-color);
                font-size: 0.75rem;
            }

            .container {
                border-top: 1px solid var(--outline-variant-color);
                //position: sticky;
                position: fixed;
                background-color: var(--background-color);
                width: 100%;
                bottom: 0;
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
        `,
        template: `
            <div class="container">
                <div class="bar">
                    @if (isCompact()) {
                        <div class="bar-flex align-center justify-center">
                            <span>This is a fake site made for learning purposes</span>
                        </div>
                    } 
                    @else {
                        <div class="bar-flex">
                            <h4>What You Wanna Watch</h4>
                            <span class="spacer"></span>
                            <span>This is a fake site made for learning purposes</span>
                        </div>
                    }
                </div>

            </div>
        `,
    }
)

export class Footer {

    private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

    isCompact: Signal<boolean> = toSignal(
        this.breakpointObserver
            .observe('(max-width: 768px)')
            .pipe(map(result => result.matches)),
        { initialValue: false }
    );

}
