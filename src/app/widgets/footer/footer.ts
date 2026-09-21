import {Component} from '@angular/core';

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
                    <div class="bar-flex">
                        <h4>What You Wanna Watch</h4>
                        <span class="spacer"></span>
                        <span>This is a fake site made for learning purposes</span>
                    </div>
                </div>

            </div> 
        `,
    }
)

export class Footer {

}
