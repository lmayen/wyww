import {Directive, input, InputSignal} from '@angular/core';

type ButtonSeverity =
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'danger';

type ButtonVariant =
    | 'filled'
    | 'outlined'
    | 'text';

@Directive(
    {
        selector: '[Bt]',
        host: {
            'class': 'button',

            '[class.button-primary]': 'severity() === "primary"',
            '[class.button-secondary]': 'severity() === "secondary"',
            '[class.button-accent]': 'severity() === "accent"',
            '[class.button-success]': 'severity() === "success"',
            '[class.button-warning]': 'severity() === "warning"',
            '[class.button-danger]': 'severity() === "danger"',

            '[class.button-filled]': 'variant() === "filled"',
            '[class.button-outlined]': 'variant() === "outlined"',
            '[class.button-text]': 'variant() === "text"',

            '[class.button-rounded]': 'rounded()',

            '[class.button-circle]': 'circle()',
        },
    }
)


export class Bt {
    severity: InputSignal<ButtonSeverity> = input<ButtonSeverity>('primary');
    variant: InputSignal<ButtonVariant> = input<ButtonVariant>('filled');
    rounded: InputSignal<boolean> = input<boolean>(false);
    circle: InputSignal<boolean> = input<boolean>(false);
}
