import {Directive, input, InputSignal} from '@angular/core';

@Directive(
    {
        selector: '[BackgroundColor]',
        host: {
            '[style.background-color]': 'color()',
        },
    }
)


export class BackgroundColor {
    color: InputSignal<string> = input.required<string>();
}
