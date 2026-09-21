import {Component} from '@angular/core';
import {Bt} from "../../directives/bt";

@Component(
    {
        imports: [
            Bt
        ],
        selector: 'nav-bar',
        styles: `
            h2 {
                margin-block: 0;
            }

            .container {
                border-bottom: 1px solid var(--outline-variant-color);
                position: sticky;
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
                        <h2>What You Wanna Watch</h2>
                        <span class="spacer"></span>
                        <button Bt [variant]="'text'" [rounded]="true">Browse</button>
                        <button Bt [severity]="'primary'" [rounded]="true">Recommend me</button>
                        <button Bt [severity]="'primary'" [variant]="'circle'">LM</button>
                    </div>
                </div>

            </div>
        `,
    }
)
export class NavBar {

}
