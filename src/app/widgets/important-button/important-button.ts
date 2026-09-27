import {Component, EventEmitter, input, InputSignal, Output} from '@angular/core';
import {FaIconComponent, IconDefinition} from "@fortawesome/angular-fontawesome";

@Component(
    {
        imports: [
            FaIconComponent
        ],
        selector: 'important-button',
        styles: `
            .action-toggle {
                position: relative;
                display: inline-flex;
                align-items: center;
                
                gap: var(--gap-md);
                padding: var(--pad-sm) 3rem var(--pad-sm) var(--pad-lg);
                border-radius: var(--radius-md);

                border: 0;
                background-color: var(--primary-color);
                color: var(--on-primary-color);

                font: inherit;
                font-weight: 600;

                cursor: pointer;

                transition: transform 150ms ease,
                        background-color 150ms ease,
                        box-shadow 150ms ease;
            }

            .action-toggle:active:not(:disabled) {
                transform: translateY(0);
            }

            .action-toggle:focus-visible {
                outline: 2px solid var(--primary-color);
                outline-offset: 3px;
            }

            .action-toggle:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            /* Toggle */
            .action-toggle-switch {
                position: relative;
                flex: 0 0 auto;
                width: 2rem;
                height: 1.125rem;
                border: 1px solid var(--on-primary-color);
                border-radius: 9999px;
                background-color: transparent;
            }

            .action-toggle-switch-thumb {
                position: absolute;
                top: 50%;
                left: 0.1875rem;
                width: 0.625rem;
                height: 0.625rem;
                border-radius: 50%;
                background-color: var(--on-primary-color);
                transform: translateY(-50%);
                transition: left 180ms ease, transform 180ms ease;
            }

            .action-toggle-checked .action-toggle-switch-thumb {
                left: calc(100% - 0.8125rem);
            }


            /* Label */
            .action-toggle-label {
                line-height: 1;
            }


            /* External icon */
            .action-toggle-icon {
                position: absolute;
                right: -0.5rem;
                top: 50%;

                display: flex;
                align-items: center;
                justify-content: center;

                width: 3rem;
                height: 3rem;
                border-radius: 50%;
                color: var(--on-primary-color);

                transform: translateY(-50%) scale(1);
                transition: transform 180ms ease, background-color 180ms ease;
            }

            .action-toggle:hover:not(:disabled)
            .action-toggle-icon {
                transform: translate(-0.4rem, -50%) scale(1.1);
            }

            .action-toggle:active:not(:disabled)
            .action-toggle-icon {
                transform: translate(-0.4rem, -50%) scale(0.96);
            }
        `,
        template: `
            <button class="action-toggle" type="button"
                    [class.action-toggle-checked]="checked()"
                    [attr.aria-pressed]="checked()"
                    [disabled]="disabled()"
                    (click)="toggle()">
                <span class="action-toggle-switch" aria-hidden="true" >
                    <span class="action-toggle-switch-thumb"></span>
                </span>

                <span class="action-toggle-label">
                    <ng-content />
                </span>

                <span class="action-toggle-icon" aria-hidden="true">
                    <fa-icon [icon]="icon()" />
                </span>
            </button>
        `,
    }
)


export class ImportantButton {
    icon: InputSignal<IconDefinition> = input.required<IconDefinition>();
    checked: InputSignal<boolean> = input<boolean>(false);
    @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    disabled = input<boolean>(false);

    protected toggle(): void {
        if (this.disabled()) {
            return;
        }

        this.checkedChange.emit(!this.checked());
    }

    protected change(event: Event): void {
        const input = event.target as HTMLInputElement;

        this.checkedChange.emit(input.checked);
    }
}
