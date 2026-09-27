import {Directive} from '@angular/core';

@Directive(
    {
        selector: 'input[Inp], textarea[Inp]',
        host: {
            'class': 'input',
        }
    }
)

export class Inp {
}
