import {Component, input, InputSignal} from '@angular/core';
import {TagColor} from "../../core/ui/tags";

@Component(
    {
        imports: [],
        selector: 'tag',
        styles: `
            .tag {
                display: inline-flex;
                align-items: center;

                padding: var(--pad-sm) var(--pad-md);

                border-radius: var(--radius-md);

                background-color: var(--tag-background-color);
                color: var(--tag-color);

                font-size: 0.875rem;
                font-weight: 500;
                line-height: 1;
                white-space: nowrap;

                box-shadow: 8px 5px 9px 0px rgba(0,0,0,0.08);
                -webkit-box-shadow: 8px 5px 9px 0px rgba(0,0,0,0.08);
                -moz-box-shadow: 8px 5px 9px 0px rgba(0,0,0,0.08);
            }
        `,
        template: `
            <span class="tag"
                  [style.--tag-background-color]="color().background"
                  [style.--tag-color]="color().color"> 
                {{ label() }}
            </span>
        `,
    }
)


export class Tag {
    label: InputSignal<string> = input.required<string>();
    color: InputSignal<TagColor> = input.required<TagColor>();
}
