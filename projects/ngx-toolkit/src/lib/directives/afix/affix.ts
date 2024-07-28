import { Directive, HostListener } from "@angular/core";

@Directive()
export class Affix {
    @HostListener('click', ['$event'])
    protected onClick(event: MouseEvent): void {
        event.stopPropagation();
    }
}