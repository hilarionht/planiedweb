import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { RoutesModule } from './routes/routes.module';
import { ServiceModule } from './services/service.module';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
defineLocale('es', esLocale);
// https://github.com/ocombe/ng2-translate/issues/218
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
export function getDatepickerConfig(): BsDatepickerConfig {
    return Object.assign(new BsDatepickerConfig(), {
        containerClass: 'theme-angle',
        dateInputFormat: 'DD-MM-YYYY'
    });
}
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        HttpClientModule,
        BrowserAnimationsModule, // required for ng2-tag-input
        CoreModule,
        LayoutModule,
        SharedModule.forRoot(),
        RoutesModule,
        ServiceModule,
        NgbModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    providers: [{ provide: BsDatepickerConfig, useFactory: getDatepickerConfig }],
    bootstrap: [AppComponent]
})
export class AppModule { }
