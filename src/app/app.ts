import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavBar} from "./widgets/nav-bar/nav-bar";
import {Footer} from "./widgets/footer/footer";

@Component(
    {
        imports: [RouterOutlet, NavBar, Footer],
        selector: 'app-root',
        styles: [],
        template: `
            <nav-bar/>
            <div class="page-container">
                <router-outlet/>
            </div>
            <footer>
                <nav-footer/>
            </footer>
        `,
    }
)


export class App {
    protected readonly title = signal('Wyww');
}
