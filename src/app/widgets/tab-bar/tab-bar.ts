import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {FaIconComponent, IconDefinition} from "@fortawesome/angular-fontawesome";

export interface TabItem {
    label: string;
    value: string;
    icon?: IconDefinition;
}

@Component(
    {
        imports: [
            FaIconComponent
        ],
        selector: 'tab-bar',
        styles: `
            :host {
                display: block;
                width: 100%;
            }

            .tab-bar {
                display: flex;
                width: 100%;

                border-bottom: 1px solid var(--outline-variant-color);
            }

            .tab {
                position: relative;

                appearance: none;

                margin: 0 0 -1px;
                padding: var(--pad-sm) var(--pad-md);

                border: 0;

                background-color: transparent;
                color: var(--on-surface-variant-color);

                font: inherit;
                font-weight: 500;

                cursor: pointer;

                transition:
                        color 150ms ease,
                        font-weight 150ms ease;
            }

            .tab::after {
                content: '';

                position: absolute;
                right: 0;
                bottom: 0;
                left: 0;

                height: 2px;

                background-color: var(--primary-color);

                opacity: 0;
                transform: scaleX(0.4);
                transform-origin: center;

                transition:
                        opacity 150ms ease,
                        transform 180ms ease;
            }

            .tab:hover {
                color: var(--on-surface-color);
            }

            .tab[aria-selected='true'] {
                color: var(--on-surface-color);
            }

            .tab[aria-selected='true']::after {
                opacity: 1;
                transform: scaleX(1);
            }
        `,
        template: `
            <div class="tab-bar" role="tablist">
                @for (tab of tabs(); track tab.value) {
                    <button type="button"
                            class="tab"
                            role="tab"
                            [attr.aria-selected]="activeTab() === tab.value"
                            (click)="selectTab(tab.value)">
                        {{ tab.label }}
                        @if (tab.icon) {
                            <fa-icon [icon]="tab.icon"/>
                        }
                    </button>
                }
            </div>
        `,
    }
)


export class TabBar {
    tabs: InputSignal<readonly TabItem[]> = input.required<readonly TabItem[]>();
    activeTab: InputSignal<string> = input.required<string>();

    activeTabChange: OutputEmitterRef<string> = output<string>();

    selectTab(value: string): void {
        this.activeTabChange.emit(value);
    }
}
