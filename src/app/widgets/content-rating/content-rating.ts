import {Component, input, InputSignal} from '@angular/core';
import {WywwMovieContentRatingEnum} from "../../core/models/data";

@Component(
    {
        imports: [],
        selector: 'content-rating',
        styles: `
            .rating {
                display: inline-flex;
                align-items: center;

                padding: var(--pad-sm) var(--pad-md);

                border-radius: var(--radius-md);

                background-color: var(--on-background-color);
                color: var(--surface-color);

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
            <span class="rating"> 
                {{ rating() }}
            </span>
        `,
    }
)


export class ContentRating {
    rating: InputSignal<WywwMovieContentRatingEnum> = input.required<WywwMovieContentRatingEnum>();

}
