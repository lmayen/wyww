import {computed, Directive, input, InputSignal, Signal} from '@angular/core';
import {BackgroundRepeat, BackgroundSize} from "./background-image";
import {BackgroundGradientOptions, buildBackgroundImage, buildGradient} from "../core/ui/backgrounds";

@Directive(
    {
        selector: '[BackgroundImageGradient]',
        host: {
            '[style.background-color]': 'backgroundColor()',
            '[style.background-image]': 'background()',
            '[style.background-size]': 'backgroundSize()',
            '[style.background-position]': 'backgroundPosition()',
            '[style.background-repeat]': 'backgroundRepeat()',
        },
    }
)


export class BackgroundImageGradient {
    backgroundImage: InputSignal<string> = input.required<string>();
    backgroundColor: InputSignal<string> = input<string>('transparent');

    gradient1: InputSignal<BackgroundGradientOptions | undefined> = input<BackgroundGradientOptions>();
    gradient2: InputSignal<BackgroundGradientOptions | undefined> = input<BackgroundGradientOptions>();

    backgroundSize: InputSignal<BackgroundSize> = input<BackgroundSize>('cover');
    backgroundPosition: InputSignal<string> = input<string>('center');
    backgroundRepeat: InputSignal<BackgroundRepeat> = input<BackgroundRepeat>('no-repeat');

    protected readonly background: Signal<string> = computed(() => {
        const layers: string[] = [];

        const gradient1: BackgroundGradientOptions | undefined = this.gradient1();
        const gradient2: BackgroundGradientOptions | undefined = this.gradient2();

        if (typeof gradient1 !== 'undefined') {
            layers.push(buildGradient(gradient1));
        }

        if (typeof gradient2 !== 'undefined') {
            layers.push(buildGradient(gradient2));
        }

        layers.push(
            buildBackgroundImage(this.backgroundImage())
        );

        return layers.join(', ');
    });
}
