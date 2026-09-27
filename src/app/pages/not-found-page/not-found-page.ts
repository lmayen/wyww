import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component(
    {
        imports: [
            NgOptimizedImage
        ],
        selector: 'not-found-page',
        styles: `
            img {
                //width: auto;
                //height: 75vh;
                width: 100%;
                height: auto;
            }
        `,
        template: `
            <div class="grid-12 gap-md">
                <div class="span-6">
                    <img ngSrc="/images/404.webp" alt="404 poster" height="1024" width="768">
                </div>
                <div class="span-6">
                    <h1>Error 404:</h1>
                    <p>Page not found</p>
                </div>
            </div>
        `,
    }
)


export class NotFoundPage {
}
