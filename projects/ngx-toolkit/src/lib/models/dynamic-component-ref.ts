import { OverlayRef } from "@angular/cdk/overlay";
import { ComponentRef } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { DynamicComponentConfig } from "./dynamic-component-config";

export class DynamicComponentRef<T> {
    public instance!: T;
    public componentRef!: ComponentRef<T> | null;
    private _afterClosed = new Subject<any>();
    private _beforeClosed = new Subject<any>();
    private _afterOpened = new Subject<void>();
    private _backdropClick = new Subject<MouseEvent>();
    private _keydownEvents = new Subject<KeyboardEvent>();

    constructor(private overlayRef: OverlayRef, private config?: DynamicComponentConfig) {
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
        this._beforeClosed.next(result);
        this.overlayRef.detach();
        this.overlayRef.dispose();
        this._afterClosed.next(result);
    }




    public beforeClosed(): Observable<any> {
        return this._beforeClosed.asObservable();
    }




    public afterClosed(): Observable<any> {
        return this._afterClosed.asObservable();
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