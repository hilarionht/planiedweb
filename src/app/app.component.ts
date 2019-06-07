import { LoaderService } from './services/interceptors/loader.service';
import { Component, HostBinding, OnInit, isDevMode } from '@angular/core';

import { SettingsService } from './core/settings/settings.service';
import { ToasterConfig } from 'angular2-toaster';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    @HostBinding('class.layout-fixed') get isFixed() { return this.settings.getLayoutSetting('isFixed'); };
    @HostBinding('class.aside-collapsed') get isCollapsed() { return this.settings.getLayoutSetting('isCollapsed'); };
    @HostBinding('class.layout-boxed') get isBoxed() { return this.settings.getLayoutSetting('isBoxed'); };
    @HostBinding('class.layout-fs') get useFullLayout() { return this.settings.getLayoutSetting('useFullLayout'); };
    @HostBinding('class.hidden-footer') get hiddenFooter() { return this.settings.getLayoutSetting('hiddenFooter'); };
    @HostBinding('class.layout-h') get horizontal() { return this.settings.getLayoutSetting('horizontal'); };
    @HostBinding('class.aside-float') get isFloat() { return this.settings.getLayoutSetting('isFloat'); };
    @HostBinding('class.offsidebar-open') get offsidebarOpen() { return this.settings.getLayoutSetting('offsidebarOpen'); };
    @HostBinding('class.aside-toggled') get asideToggled() { return this.settings.getLayoutSetting('asideToggled'); };
    @HostBinding('class.aside-collapsed-text') get isCollapsedText() { return this.settings.getLayoutSetting('isCollapsedText'); };
    toasterConfig: any;
    toasterconfig: ToasterConfig = new ToasterConfig({
        positionClass: 'toast-top-right',
        showCloseButton: true,
        animation: 'fade'
    });
    bsConfig = {
        containerClass: 'theme-angle',
        dateInputFormat: 'DD-MM-YYYY'
    };
  locale = 'es';
    constructor(public settings: SettingsService, private _localeService: BsLocaleService, loaderService: LoaderService) { }

    ngOnInit() {
        this._localeService.use('es');
        document.addEventListener('click', e => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A') e.preventDefault();
        })
        if (isDevMode()) {
            console.log('👋 Development!');
          } else {
            console.log('💪 Production!');
          }
    }
}
