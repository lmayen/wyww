import {Component, signal, WritableSignal} from '@angular/core';
import {SignInForm} from "../../formulaires/sign-in-form/sign-in-form";
import {Card} from "../../widgets/card/card";
import {TabBar, TabItem} from "../../widgets/tab-bar/tab-bar";
import {faImagePortrait, faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {LogInForm} from "../../formulaires/log-in-form/log-in-form";

@Component(
    {
        imports: [
            SignInForm,
            Card,
            TabBar,
            LogInForm
        ],
        selector: 'app-home-page',
        styles: ``,
        template: `
            <card [variant]="'container'">
                <div card-header class="pad-sm">
                    <tab-bar [tabs]="tabOptions"
                             [activeTab]="selectedTab()"
                             (activeTabChange)="onSelectTabChange($event)"/>
                </div>
                
                <card>
                    @switch (selectedTab()) {
                        @case ('signin') {
                            <sign-in-form></sign-in-form>
                        }
                        @case ('login') {
                            <log-in-form></log-in-form>
                        }
                    }
                </card>
            </card>
        `,
    }
)


export class HomePage {

    tabOptions: TabItem[] = [
        {label: 'Login', value: 'login', icon: faRightToBracket},
        {label: 'Sign in', value: 'signin', icon: faImagePortrait}
    ];

    selectedTab: WritableSignal<'signin' | 'login'> = signal<'signin' | 'login'>('login')

    onSelectTabChange(event: string): void {
        switch (event) {
            case 'signin':
                this.selectedTab.set('signin');
                break;

            case 'login':
                this.selectedTab.set('login');
                break;
        }
    }
}
