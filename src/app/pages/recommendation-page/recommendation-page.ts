import {Component, computed, effect, inject, OnInit, Signal} from '@angular/core';
import {RecommendationController} from "../../controllers/recommendation-controller";
import {ColorData, ImageData, WywwGenreData, WywwMovieData} from "../../core/models/data";
import {PageWrapper, WrapperState} from "../../widgets/page-wrapper/page-wrapper";
import {BackgroundGradientOptions} from "../../core/ui/backgrounds";
import {evalImageSource} from "../../core/ui/files";
import {BackgroundImageGradient} from "../../directives/background-image-gradient";
import {selectBackgroundColor} from "../../core/ui/colors";
import {formatDuration} from "../../core/ui/dates";
import {NgOptimizedImage} from "@angular/common";
import {TagList} from "../../widgets/tag-list/tag-list";
import {RecommendationData, WatchlistData} from "../../core/models/custom";
import {MovieCard} from "../../widgets/movie-card/movie-card";
import {ContentRating} from "../../widgets/content-rating/content-rating";
import {MovieRating} from "../../widgets/movie-rating/movie-rating";
import {IconDefinition} from "@fortawesome/angular-fontawesome";
import {faThumbsUp} from "@fortawesome/free-regular-svg-icons";
import {ImportantButton} from "../../widgets/important-button/important-button";
import {faEye} from "@fortawesome/free-solid-svg-icons";

interface SecondaryRecommendation {
    genre: string,
    movies: WywwMovieData[]
}

@Component(
    {
        imports: [
            PageWrapper,
            BackgroundImageGradient,
            NgOptimizedImage,
            TagList,
            MovieCard,
            ContentRating,
            MovieRating,
            ImportantButton
        ],
        selector: 'recommendation-page',
        providers: [RecommendationController],
        styles: `
            .card-container {
                border-radius: var(--radius-lg);
                padding: 8rem var(--pad-lg) var(--pad-lg);
                @media (max-width: 768px) {
                    padding: var(--pad-lg) var(--pad-lg);
                }
            }

            .left-col {
                grid-column: span 3;
                @media (max-width: 768px) {
                    grid-column: span 12;
                }
            }

            .drawer-label {
                font-size: 0.65rem;
                color: var(--on-surface-variant-color);
                font-weight: 700;
                mix-blend-mode: multiply;
            }

            .drawer-text {
                font-size: 1.25rem;
                font-weight: 800;
            }

            .right-col {
                grid-column: span 9;
                @media (max-width: 768px) {
                    grid-column: span 12;
                }
            }

            .grid-video {
                display: grid;
                justify-content: center;
                grid-template-columns: repeat(auto-fill, minmax(256px, 500px));
                gap: var(--gap-md);
            }

            .poster {
                width: 100%;
                height: auto;
                border: 1rem solid #f9efcf;
                box-sizing: border-box;
            }

            h1 {
                margin-block-start: 0;
                margin-block-end: 0.5rem;
            }
        `,
        template: `
            <page-wrapper [state]="state()">
                @if (movie(); as mv) {

                    <div class="card-container"
                         BackgroundImageGradient
                         [backgroundImage]="banner().src"
                         [gradient1]="colorGradient()">
                        <div class="grid-12 gap-lg">
                            <div class="left-col">
                                <img [ngSrc]="poster().src"
                                     [alt]="mv.movie_title"
                                     [width]="poster().w"
                                     [height]="poster().h"
                                     priority
                                     class="poster">
                            </div>

                            <div class="right-col">
                                <h1>{{ mv.movie_title }}</h1>

                                <tag-list [tags]="genres()"/>
                                <br>

                                <div class="grid-9 justify-center">
                                    <span></span>

                                    <div class="flex-center flex-col">
                                        <span class="drawer-label">RELEASED YEAR</span><br>
                                        <span class="drawer-text">{{ mv.released_year }}</span>
                                    </div>

                                    <span class="divider-v"></span>

                                    <div class="flex-center flex-col">
                                        <span class="drawer-label">DURATION</span><br>
                                        <span class="drawer-text">{{ duration() }}</span>
                                    </div>

                                    <span class="divider-v"></span>

                                    <div class="flex-center flex-col">
                                        <span class="drawer-label">CONTENT</span><br>
                                        <content-rating [rating]="mv.content_rating"/>
                                    </div>

                                    <span class="divider-v"></span>

                                    <div class="flex-center flex-col">
                                        <span class="drawer-label">RATING</span><br>
                                        <movie-rating [score]="mv.rating"/>
                                    </div>

                                    <span></span>
                                </div>

                                <br><span class="divider-h"></span>

                                <p>{{ mv.description }}</p>

                                <br>
                                <div class="flex gap-md">
                                    <important-button [icon]="recommendIcon"
                                                      [checked]="!!watchlist()?.recommended"
                                                      (click)="onToggleRecommendedClicked(mv.id)">
                                        Recommend
                                    </important-button>
                                    <important-button [icon]="watchedIcon"
                                                      [checked]="!!watchlist()?.watched"
                                                      (click)="onToggleWatchedClicked(mv.id)">
                                        Watched
                                    </important-button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <br><br>

                    @for (genreItem of secondaryRecommendations(); track genreItem.genre) {
                        <span class="divider-h"></span>
                        <br>
                        <h2>{{ genreItem.genre }}</h2>
                        <div class="grid-video">
                            @for (movieItem of genreItem.movies; track movieItem.id) {
                                <movie-card [movieData]="movieItem" (cardClicked)="onMovieClicked($event)"></movie-card>
                            }
                        </div>
                        <br><br>
                    }
                }

            </page-wrapper>
        `,
    }
)


export class RecommendationPage implements OnInit {

    private controller: RecommendationController = inject(RecommendationController);

    recommendIcon: IconDefinition = faThumbsUp;
    watchedIcon: IconDefinition = faEye;

    protected state: Signal<WrapperState> = this.controller.state.asReadonly();
    protected movie: Signal<WywwMovieData|undefined> = computed<WywwMovieData|undefined>(() => {
        const recommendation: RecommendationData | undefined = this.controller.recommendation();
        if (typeof recommendation !== 'undefined') {
            return recommendation.main;
        }

        return undefined;
    });
    protected watchlist: Signal<WatchlistData|undefined> = this.controller.watchlist;

    protected readonly movieColor: Signal<string> = computed<string>(() => {
        const movie: WywwMovieData | undefined = this.controller.recommendation()?.main;

        const bannerIndex: number | undefined = movie?.images?.findIndex(x => x.kind == 'banner');
        if (typeof bannerIndex !== 'undefined' && bannerIndex !== -1) {
            const colors: ColorData[] | undefined = movie?.images?.at(bannerIndex)?.colors;
            if (typeof colors !== 'undefined' && colors.length > 0) {
                return selectBackgroundColor(colors);
            }
        }

        const posterIndex: number | undefined = movie?.images?.findIndex(x => x.kind == 'poster');
        if (typeof posterIndex !== 'undefined' && posterIndex !== -1) {
            const colors: ColorData[] | undefined = movie?.images?.at(posterIndex)?.colors;
            if (typeof colors !== 'undefined' && colors.length > 0) {
                return selectBackgroundColor(colors);
            }
        }

        return "#FFFFFF";
    });

    protected readonly colorGradient: Signal<BackgroundGradientOptions> = computed<BackgroundGradientOptions>(() => {
        return {
            direction: "to bottom",
            from: 'transparent',
            to: this.movieColor(),
            fromAt: '-40%',
            toAt: '110%',
        };
    });

    protected readonly banner: Signal<{ src: string, w: number, h: number }> = computed<{ src: string, w: number, h: number }>(() => {
        const movie: WywwMovieData | undefined = this.controller.recommendation()?.main;
        const posterIndex: number | undefined = movie?.images?.findIndex(x => x.kind == 'banner');

        if (typeof posterIndex !== 'undefined' && posterIndex !== -1) {
            const poster: ImageData | undefined = movie?.images?.at(posterIndex)
            if (typeof poster !== 'undefined') {
                return {
                    src: evalImageSource(poster.id),
                    w: poster.width,
                    h: poster.height,
                }
            }
        }

        return { src: '', w: 0, h: 0 }
    })

    protected readonly poster: Signal<{ src: string, w: number, h: number }> = computed<{ src: string, w: number, h: number }>(() => {
        const movie: WywwMovieData | undefined = this.controller.recommendation()?.main;
        const posterIndex: number | undefined = movie?.images?.findIndex(x => x.kind == 'poster');

        if (typeof posterIndex !== 'undefined' && posterIndex !== -1) {
            const poster: ImageData | undefined = movie?.images?.at(posterIndex)
            if (typeof poster !== 'undefined') {
                return {
                    src: evalImageSource(poster.id),
                    w: poster.width,
                    h: poster.height,
                }
            }
        }

        return { src: '/images/missingPoster.webp', w: 672, h: 1008 }
    })

    protected readonly duration: Signal<string> = computed<string>(() => {
        const movie: WywwMovieData | undefined = this.controller.recommendation()?.main;
        if (typeof movie !== 'undefined') {
            return formatDuration(movie.runtime);
        }
        return ''
    })

    protected readonly genres: Signal<string[]> = computed<string[]>(() => {
        const movie: WywwMovieData | undefined = this.controller.recommendation()?.main;
        if (typeof movie !== 'undefined') {
            if (typeof movie.genres !== 'undefined') {
                return movie.genres?.map(x => x.name);
            }
        }
        return []
    })

    protected readonly secondaryRecommendations: Signal<SecondaryRecommendation[]> = computed<SecondaryRecommendation[]>(() => {
        const moviePerGenres: { [p: string]: WywwMovieData[] } | undefined = this.controller.recommendation()?.genres;
        const result: SecondaryRecommendation[] = []
        if (typeof moviePerGenres !== 'undefined') {
            Object.keys(moviePerGenres).forEach(genre => {
                result.push({
                    genre: genre,
                    movies: moviePerGenres[genre]
                })
            })
        }
        return result
    })

    ngOnInit() {
        this.controller.find();
    }

    onMovieClicked(id: string): void {
        this.controller.swap(id);
    }

    onToggleRecommendedClicked(id: string): void {
        this.controller.toggleRecommended(id);
    }

    onToggleWatchedClicked(id: string): void {
        this.controller.toggleWatched(id);
    }

    constructor() {
        effect(() => {
            console.log(this.watchlist())
        });
    }
}
