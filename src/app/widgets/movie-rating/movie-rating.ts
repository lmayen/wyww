import {Component, computed, input, InputSignal, Signal} from '@angular/core';
import {FaIconComponent, FaStackComponent, IconDefinition} from "@fortawesome/angular-fontawesome";
import {faStar as faStarRegular} from '@fortawesome/free-regular-svg-icons';
import {faStar as faStarSolid} from '@fortawesome/free-solid-svg-icons';


@Component(
    {
        imports: [
            FaIconComponent
        ],
        selector: 'movie-rating',
        styles: `
            :host {
                display: inline-block;
            }

            .rating {
                display: inline-flex;
                flex-direction: column;
                //align-items: flex-start;
                align-items: center;

                color: var(--on-background-color);
            }

            .rating-score {
                display: flex;
                align-items: baseline;
                gap: 0.3rem;

                line-height: 1;
            }

            .rating-value {
                font-size: 1.75rem;
                font-weight: 700;
                letter-spacing: -0.04em;
            }

            .rating-max {
                color: var(--on-surface-variant-color);

                font-size: 0.875rem;
                font-weight: 400;
            }

            .rating-stars {
                display: flex;
                align-items: center;
                gap: 0.2rem;

                margin-top: 0.35rem;

                font-size: 0.75rem;
                line-height: 1;
            }
        `,
        template: `
            <div class="rating" [attr.aria-label]="formattedScore() + ' out of ' + max()">
                <div class="rating-score">
                    <span class="rating-value">{{ formattedScore() }}</span>
                    <span class="rating-max">/{{ max() }}</span>
                </div>

                <div class="rating-stars" aria-hidden="true">
                    @for (star of stars(); track star) {
                        <fa-icon [icon]="star < filledStars() ? solidStar : regularStar" />
                    }
                </div>
            </div>
        `,
    }
)


export class MovieRating {
    score: InputSignal<number> = input.required<number>();

    max: InputSignal<number> = input<number>(10);
    starCount: InputSignal<number> = input<number>(5);

    // protected readonly faStarIcon: IconDefinition = faStar;
    protected readonly solidStar: IconDefinition = faStarSolid;
    protected readonly regularStar = faStarRegular;

    protected readonly formattedScore: Signal<string> = computed<string>(() =>
        this.score().toFixed(1)
    );

    protected readonly filledStars: Signal<number> = computed<number>(() => {
        const ratio = this.score() / this.max();
        return Math.round(Math.max(0, Math.min(1, ratio)) * this.starCount()
        );
    });

    protected readonly stars: Signal<readonly number[]> = computed<readonly number[]>(() =>
        Array.from({ length: this.starCount() }, (_, index) => index)
    );
}
