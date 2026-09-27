import {Component, input, InputSignal} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

export type WrapperType = 'idle' | 'submitting' | 'success' | 'error';

export interface WrapperState {
    status: WrapperType,
    message?: string,
    title?: string
}

@Component(
    {
        imports: [
            NgOptimizedImage
        ],
        selector: 'page-wrapper',
        styles: `
            .loading-video {
                mix-blend-mode: multiply;
                width: auto;
                height: 64px;
            }
            
            img {
                width: 100%;
                height: auto;
                max-height: 70vh;
            }
        `,
        template: `
            @switch (state().status) {
                @case ("idle") {
                    <ng-content></ng-content>
                }
                @case ("submitting") {
                    <div class="flex-center flex-col full-width full-height">
                        <video class="loading-video" loop autoplay src="/videos/Loading.webm" type="video/webm"></video>
                    </div>
                }
                @case ("error") {
                    <div class="grid-12 gap-md">
                        <div class="span-6">
                            <img ngSrc="/images/error.webp" alt="error poster" height="1024" width="768" priority>
                        </div>
                        <div class="span-6">
                            @if (state().title) {
                                <h1>state().title</h1>
                            } @else {
                                <h1>Error</h1>
                            }

                            @if (state().message) {
                                <p>{{ state().message }}</p>
                            }
                        </div>
                    </div>
                }
                @default {
                    @if (state().status === 'success' && showSuccess()) {
                        <div class="grid-12 gap-md">
                            <div class="span-6">
                                <img ngSrc="/images/success.webp" alt="success poster" height="1024" width="768" priority>
                            </div>
                            <div class="span-6">
                                @if (state().title) {
                                    <h1>state().title</h1>
                                } @else {
                                    <h1>Success</h1>
                                }

                                @if (state().message) {
                                    <p>message</p>
                                }
                            </div>
                        </div>
                    } @else {
                        <ng-content></ng-content>
                    }
                }
            }
        `,
    }
)


export class PageWrapper {
    readonly state: InputSignal<WrapperState> = input.required<WrapperState>();
    readonly showSuccess: InputSignal<boolean> = input<boolean>(false);
}
