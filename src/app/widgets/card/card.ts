import {Component, input, InputSignal} from '@angular/core';
import {NgClass} from "@angular/common";

@Component(
    {
        imports: [
            NgClass
        ],
        selector: 'card',
        styles: `
            :host {
                --card-padding: var(--pad-lg);

                --card-background-color: var(--surface-color);
                --card-color: var(--on-surface-color);
                //--card-content-color: var(--on-surface-variant-color);
                --card-border-color: var(--outline-variant-color);

                --card-container-background-color: var(--on-surface-color);
                --card-container-color: var(--surface-color);
                //--card-container-content-color: var(--outline-variant-color);
                --card-container-border-color: var(--on-surface-variant-color);
            }

            .card-container {
                display: flex;
                flex-direction: column;

                overflow: hidden;

                border: 1px solid var(--card-border-color);
                border-radius: var(--radius-xl);

                background-color: var(--card-background-color);
                color: var(--card-color);

                box-shadow: 1px 2px 8px rgb(0 0 0 / 0.04);
            }

            .on-card-container {
                display: flex;
                flex-direction: column;

                overflow: hidden;

                //border: 1px solid var(--card-container-border-color);
                border-radius: var(--radius-xl);

                //background-color: var(--card-container-background-color);
                //background-color: #DCD9D4;
                background-image: linear-gradient(to bottom, rgb(255 236 230 / 0.05) 0%, rgb(13 11 11 / 0.05) 100%), radial-gradient(at 50% 0%, rgb(255 238 230 / 0.05) 0%, rgba(0, 0, 0, 0.050) 50%);
                //background-blend-mode: soft-light,screen;
                background-blend-mode: multiply, multiply;
                //color: var(--card-container-color);
            }

            .card-header {
                width: 100%;
            }

            .card-header:empty {
                display: none;
            }

            .card-title {
                padding: var(--card-padding) var(--card-padding) 0;

                //font-size: 1.25rem;
                //font-weight: 600;
                //line-height: 1.25;
            }

            .card-title:empty {
                display: none;
            }

            .card-content {
                padding: var(--card-padding);

                //color: var(--card-content-color);
                //line-height: 1.5;
            }

            .card-content:empty {
                display: none;
            }

            .card-actions {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: var(--gap-md);

                padding: 0 var(--card-padding) var(--card-padding);
            }

            .card-actions:empty {
                display: none;
            }
        `,
        template: `
            <div [ngClass]="{'card-container': variant() == 'default', 'on-card-container': variant() == 'container', }">
                <div class="card-header">
                    <ng-content select="[card-header]" />
                </div>
                <div class="card-title">
                    <ng-content select="[card-title]" />
                </div>
                <div class="card-content">
                    <ng-content />
                </div>
                <div class="card-actions">
                    <ng-content select="[card-actions]" />
                </div>
            </div>
        `,
    }
)

export class Card {
    variant: InputSignal<'default'|'container'> = input<'default'|'container'>('default');
}
