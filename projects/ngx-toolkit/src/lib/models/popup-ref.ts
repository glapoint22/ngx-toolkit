import { OverlayRef } from "@angular/cdk/overlay";
import { ComponentRef } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { PopupConfig } from "./popup-config";

export class PopupRef<T> {
    public instance!: T;
    public componentRef!: ComponentRef<T> | null;
    private _onClose = new Subject<any>();
    private _afterOpened = new Subject<void>();
    private _backdropClick = new Subject<MouseEvent>();
    private _keydownEvents = new Subject<KeyboardEvent>();

    constructor(private overlayRef: OverlayRef, private config?: PopupConfig) {
        setTimeout(() => {
            this._afterOpened.next();
        });


        this.overlayRef.backdropClick().subscribe((event: MouseEvent) => {
            this._backdropClick.next(event);
            if (this.config?.disableClose) return;
            this.close();
        });


        this.overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
            this._keydownEvents.next(event);
            if (this.config?.disableClose || event.key !== 'Escape') return;
            this.close();
        });
    }




    public close(result?: any): void {
        this._onClose.next(result);
        this.overlayRef.detach();
        this.overlayRef.dispose();
    }






    public onClose(): Observable<any> {
        return this._onClose.asObservable();
    }




    public afterOpened(): Observable<void> {
        return this._afterOpened.asObservable();
    }




    backdropClick(): Observable<MouseEvent> {
        return this._backdropClick.asObservable();
    }



    
    keydownEvents(): Observable<KeyboardEvent> {
        return this._keydownEvents.asObservable();
    }
}