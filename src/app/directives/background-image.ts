import {computed, Directive, input, InputSignal, Signal} from '@angular/core';
import {buildBackgroundImage} from "../core/ui/backgrounds";

export type BackgroundSize =
    | 'cover'
    | 'contain'
    | 'auto';

export type BackgroundPosition =
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top left'
    | 'top center'
    | 'top right'
    | 'center left'
    | 'center center'
    | 'center right'
    | 'bottom left'
    | 'bottom center'
    | 'bottom right';

export type BackgroundRepeat =
    | 'no-repeat'
    | 'repeat'
    | 'repeat-x'
    | 'repeat-y';

@Directive(
    {
        selector: '[BackgroundImage]',
        host: {
            '[style.background-image]': 'image()',
            '[style.background-size]': 'size()',
            '[style.background-position]': 'position()',
            '[style.background-repeat]': 'repeat()',
        },
    }
)


export class BackgroundImage {

    source: InputSignal<string> = input.required<string>();

    size: InputSignal<BackgroundSize> = input<BackgroundSize>('cover');
    position: InputSignal<BackgroundPosition> = input<BackgroundPosition>('center');
    repeat: InputSignal<BackgroundRepeat> = input<BackgroundRepeat>('no-repeat');

    protected readonly image: Signal<string> = computed(
        () => buildBackgroundImage(this.source())
    );

}
