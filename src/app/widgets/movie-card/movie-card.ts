import {
    Component, computed,
    ElementRef,
    EventEmitter,
    input,
    InputSignal,
    Output, signal,
    Signal,
    viewChild,
    WritableSignal
} from '@angular/core';
import {WywwMovieData, ImageData, ColorData} from "../../core/models/data";
import {evalImageSource} from "../../core/ui/files";
import {NgStyle} from "@angular/common";
import {TagList} from "../tag-list/tag-list";
import {BackgroundImage} from "../../directives/background-image";
import {selectBackgroundColor} from "../../core/ui/colors";
import {BackgroundColor} from "../../directives/background-color";

@Component(
    {
        imports: [
            NgStyle,
            TagList,
            BackgroundImage,
            BackgroundColor,
        ],
        selector: 'movie-card',
        styles: `            
            .card-container {
                position: relative;
                aspect-ratio: 1.78;
                border-radius: var(--radius-md);
                padding: var(--pad-sm);
                cursor: pointer;
            }

            .card-thumbnail {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                flex-grow: 1;
                border-radius: var(--radius-md);
            }

            .card-overlay {
                position: fixed;
                animation: ease 1s;
                border-radius: var(--radius-lg);
                box-shadow: 3px 6px 19px 3px rgba(0, 0, 0, 0.15);
                -webkit-box-shadow: 6px 6px 19px 8px rgba(0, 0, 0, 0.15);
                z-index: 5;
                overflow: hidden;
            }

            /* Animation */
            @keyframes popIn {
                from {
                    opacity: 0;
                    transform: scale(0.85);
                    filter: blur(4px);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                    filter: blur(0px);
                }
            }

            .pop-enter {
                animation: popIn 0.2s ease-out forwards;
            }

            .pop-leave {
                animation: popIn 0.15s ease-in reverse forwards;
            }
        `,
        template: `
            <div class="card-container" #container
                 (mouseover)="enterPreviewMode()"
                 (mouseleave)="leavePreviewMode()" 
                 (click)="cardClicked.emit(movieData().id)">
                <div class="card-thumbnail" BackgroundImage [source]="bannerUrl()" size="cover"></div>
                @if (focusMode()) {
                    <div class="card-overlay pad-sm"
                         animate.enter="pop-enter"
                         animate.leave="pop-leave"
                         [ngStyle]="overlayStyle()" BackgroundColor [color]="movieColor()">

                        <div class="grid-12 full-height">
                            <div class="span-7">
                                <h2>{{ movieData().movie_title }}</h2>
                                @if (genres(); as genreLabels) {
                                    <tag-list [tags]="genreLabels"/>
                                }
                            </div>
                            <div class="span-5" >
                                <div class="full-width full-height" BackgroundImage [source]="posterUrl()" [size]="'contain'" [position]="'top right'"></div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        `,
    }
)


export class MovieCard {
    movieData: InputSignal<WywwMovieData> = input.required<WywwMovieData>()

    @Output() cardClicked: EventEmitter<string> = new EventEmitter<string>();

    previewElement: Signal<ElementRef<HTMLVideoElement> | undefined> = viewChild<ElementRef<HTMLVideoElement>>('preview');
    containerElement: Signal<ElementRef<HTMLDivElement> | undefined> = viewChild<ElementRef<HTMLDivElement>>('container');

    focusMode: WritableSignal<boolean> = signal<boolean>(false);
    overlayStyle: WritableSignal<{ [p: string]: any } | null | undefined> = signal<{[p: string]: any} | null | undefined>(null);

    posterUrl: Signal<string> = computed<string>(() => {
        const movie: WywwMovieData = this.movieData();
        if (typeof movie.images !== "undefined" && movie.images !== null) {
            const index: number = movie.images.findIndex(x => x.kind === 'poster')
            if (index !== -1) {
                const data: ImageData | undefined = movie.images.at(index);
                if (typeof data !== "undefined") {
                    return evalImageSource(data.id);
                }
            }
        }

        return '/images/missingPoster.webp'
    });

    bannerUrl: Signal<string> = computed<string>(() => {
        const movie: WywwMovieData = this.movieData();
        if (typeof movie.images !== "undefined" && movie.images !== null) {
            const index: number = movie.images.findIndex(x => x.kind === 'banner')
            if (index !== -1) {
                const data: ImageData | undefined = movie.images.at(index);
                if (typeof data !== "undefined") {
                    return evalImageSource(data.id);
                }
            }
        }

        return '/images/missingBanner.webp'
    });

    protected readonly movieColor: Signal<string> = computed<string>(() => {
        const movie: WywwMovieData = this.movieData();

        const posterIndex: number | undefined = movie?.images?.findIndex(x => x.kind == 'poster');
        if (typeof posterIndex !== 'undefined' && posterIndex !== -1) {
            const colors: ColorData[] | undefined = movie?.images?.at(posterIndex)?.colors;
            if (typeof colors !== 'undefined' && colors.length > 0) {
                return selectBackgroundColor(colors);
            }
        }

        const bannerIndex: number | undefined = movie?.images?.findIndex(x => x.kind == 'banner');
        if (typeof bannerIndex !== 'undefined' && bannerIndex !== -1) {
            const colors: ColorData[] | undefined = movie?.images?.at(bannerIndex)?.colors;
            if (typeof colors !== 'undefined' && colors.length > 0) {
                return selectBackgroundColor(colors);
            }
        }

        return "#FFFFFF";
    });

    genres: Signal<string[]|null> = computed<string[]|null>(() => {
        const movie: WywwMovieData | undefined = this.movieData();
        if (typeof movie !== 'undefined') {
            if (typeof movie.genres !== 'undefined') {
                return movie.genres?.map(x => x.name);
            }
        }
        return []
    });

    enterPreviewMode(): void {
        if (!this.focusMode()) {
            // Set Mode
            this.focusMode.update(() => true);

            // Start preview
            const videoEl: ElementRef<HTMLVideoElement> | undefined = this.previewElement();
            try {
                if (typeof videoEl !== "undefined") {
                    videoEl.nativeElement.load();
                    videoEl.nativeElement.muted = true;
                    videoEl.nativeElement.loop = true;
                    videoEl.nativeElement.currentTime = 0;
                    videoEl.nativeElement.play().then(() => {
                    });
                }
            } catch (_) {
            }

            // Compute overlay position
            const containerEl: ElementRef<HTMLDivElement> | undefined = this.containerElement();
            try {
                if (typeof containerEl !== "undefined") {
                    const rect: DOMRect = containerEl.nativeElement.getBoundingClientRect();

                    const overlayWidth: number = rect.width * 1.35;
                    let overlayHeight: number = rect.height * 1.4;
                    // let overlayHeight: number = rect.height * 1.1;
                    // overlayHeight = rect.height * 1.4;

                    const viewportWidth: number = window.innerWidth;
                    const viewportHeight: number = window.innerHeight;

                    const centerX: number = rect.left + rect.width / 2;
                    const centerY: number = rect.top + rect.height / 2;

                    // Default position
                    let leftPos = centerX - overlayWidth / 2;
                    let topPos = centerY - overlayHeight / 2;

                    // Boundary Checks
                    const padding = 10; // Gap from window edge
                    const paddingTop = 60; // Gap from window top edge

                    if (leftPos < padding) {
                        leftPos = padding;
                    } else if (leftPos + overlayWidth > viewportWidth - padding) {
                        leftPos = viewportWidth - overlayWidth - padding;
                    }

                    if (topPos < paddingTop) {
                        topPos = paddingTop;
                    } else if (topPos + overlayHeight > viewportHeight - padding) {
                        topPos = viewportHeight - overlayHeight - padding;
                    }

                    this.overlayStyle.update(() => {
                        return {
                            'left.px': leftPos,
                            'top.px': topPos,
                            'width.px': overlayWidth,
                            'height.px': overlayHeight,
                        }
                    });
                }
            } catch (_) {
            }
        }
    }

    leavePreviewMode(): void {
        // Set Mode
        this.focusMode.update(() => false);

        // Stop preview
        const videoEL: ElementRef<HTMLVideoElement> | undefined = this.previewElement();
        try {
            if (typeof videoEL !== "undefined") {
                videoEL.nativeElement.loop = false;
                videoEL.nativeElement.pause();
                videoEL.nativeElement.load();
            }
        } catch (_) {
        }
    }
}
