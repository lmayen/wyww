import {Component, input, InputSignal, model, ModelSignal, signal, WritableSignal} from '@angular/core';
import {
    CdkOverlayOrigin, ConnectedOverlayPositionChange,
    ConnectedPosition, ConnectionPositionPair,
    FlexibleConnectedPositionStrategyOrigin,
    OverlayModule
} from "@angular/cdk/overlay";

type DropdownPlacement =
    | 'below-start'
    | 'below-end'
    | 'above-start'
    | 'above-end';

@Component(
    {
        imports: [
            OverlayModule
        ],
        selector: 'dropdown-menu',
        styles: `
            .dropdown-shell {
                --dropdown-background-color: #ffffff;
                --dropdown-color: var(--on-surface-color);
                --dropdown-border-color: var(--outline-variant-color);

                --dropdown-shadow-color: rgb(0 0 0 / 0.12);
                position: relative;
            }

            .dropdown-menu {
                min-width: 10rem;
                max-width: min(20rem, calc(100vw - 1rem));

                max-height: calc(100vh - 1rem);
                overflow-y: auto;

                padding: var(--pad-sm);

                border: 1px solid var(--dropdown-border-color);
                border-radius: var(--radius-md);

                background-color: var(--dropdown-background-color);
                color: var(--dropdown-color);

                box-shadow: 0 4px 8px var(--dropdown-shadow-color), 0 12px 24px var(--dropdown-shadow-color);
            }

            .dropdown-arrow {
                position: absolute;
                z-index: 1;

                width: 0.625rem;
                height: 0.625rem;

                background-color: var(--dropdown-background-color);

                transform: rotate(45deg);
            }

            .dropdown-shell.below-start .dropdown-arrow {
                top: -0.3125rem;
                left: 1rem;

                border-top: 1px solid var(--dropdown-border-color);
                border-left: 1px solid var(--dropdown-border-color);
            }

            .dropdown-shell.below-end .dropdown-arrow {
                top: -0.3125rem;
                right: 1rem;

                border-top: 1px solid var(--dropdown-border-color);
                border-left: 1px solid var(--dropdown-border-color);
            }

            .dropdown-shell.above-start .dropdown-arrow {
                bottom: -0.3125rem;
                left: 1rem;

                border-right: 1px solid var(--dropdown-border-color);
                border-bottom: 1px solid var(--dropdown-border-color);
            }

            .dropdown-shell.above-end .dropdown-arrow {
                right: 1rem;
                bottom: -0.3125rem;

                border-right: 1px solid var(--dropdown-border-color);
                border-bottom: 1px solid var(--dropdown-border-color);
            }
        `,
        template: `
            <ng-template cdkConnectedOverlay

                         [cdkConnectedOverlayOrigin]="origin()"
                         [cdkConnectedOverlayOpen]="visible()"

                         [cdkConnectedOverlayPositions]="positions"
                         [cdkConnectedOverlayPush]="true"
                         [cdkConnectedOverlayViewportMargin]="8"

                         [cdkConnectedOverlayHasBackdrop]="true"
                         cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"

                         (positionChange)="positionChanged($event)"
                         (backdropClick)="close()"
                         (overlayKeydown)="keydown($event)">
                <div class="dropdown-shell" [class]="placement()">
                    <span class="dropdown-arrow"></span>
                    <div class="dropdown-menu" role="menu">
                        <div class="flex flex-col gap-sm">
                            <ng-content/>
                        </div>
                    </div>
                </div>
            </ng-template>
        `,
    }
)

export class DropdownMenu {

    protected readonly visible: WritableSignal<boolean> = signal<boolean>(false);
    protected readonly placement: WritableSignal<DropdownPlacement> = signal<DropdownPlacement>('below-start');
    protected readonly origin: WritableSignal<FlexibleConnectedPositionStrategyOrigin> = signal<FlexibleConnectedPositionStrategyOrigin>({
        x: 0,
        y: 0,
    });

    protected readonly positions: ConnectedPosition[] = [
        {
            originX: 'start',
            originY: 'bottom',

            overlayX: 'start',
            overlayY: 'top',

            offsetY: 8,
        },
        {
            originX: 'end',
            originY: 'bottom',

            overlayX: 'end',
            overlayY: 'top',

            offsetY: 8,
        },
        {
            originX: 'start',
            originY: 'top',

            overlayX: 'start',
            overlayY: 'bottom',

            offsetY: -8,
        },
        {
            originX: 'end',
            originY: 'top',

            overlayX: 'end',
            overlayY: 'bottom',

            offsetY: -8,
        },
    ];

    open(event: MouseEvent): void {
        if (event.currentTarget instanceof HTMLElement) {
            this.origin.set(event.currentTarget);
        } else {
            this.origin.set({
                x: event.clientX,
                y: event.clientY,
            });
        }

        this.visible.set(true);
    }

    close(): void {
        this.visible.set(false);
    }

    protected positionChanged(event: ConnectedOverlayPositionChange): void {
        const position: ConnectionPositionPair = event.connectionPair;

        const vertical: 'above' | 'below' =
            position.overlayY === 'top'
                ? 'below'
                : 'above';

        const horizontal: 'start' | 'end' =
            position.overlayX === 'start'
                ? 'start'
                : 'end';

        this.placement.set(`${vertical}-${horizontal}`);
    }

    protected keydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.close();
        }
    }
}
