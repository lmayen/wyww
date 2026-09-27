import {computed, Directive, input, InputSignal, Signal} from '@angular/core';
import {BackgroundGradientOptions, buildGradient} from "../core/ui/backgrounds";

@Directive(
    {
        selector: '[BackgroundGradient]',
        host: {
            '[style.background-image]': 'background()',
        },
    }
)


export class BackgroundGradient {
    gradient: InputSignal<BackgroundGradientOptions> = input.required<BackgroundGradientOptions>();

    protected readonly background: Signal<string> = computed(
        () => buildGradient(this.gradient())
    );
}
