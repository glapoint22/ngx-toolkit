import { Directive, ElementRef, inject, input, OnInit, Renderer2 } from "@angular/core";
import { ColorType } from "../../types/color.type";
import { ColorUtil } from "../../utils/color.util";

@Directive()
export abstract class Button implements OnInit {
    public color = input<ColorType>('primary');
    private el: ElementRef<HTMLButtonElement> = inject(ElementRef<HTMLButtonElement>);
    private renderer: Renderer2 = inject(Renderer2);

    public ngOnInit(): void {
        const colorClass = ColorUtil.getColorClass(this.color(), 'button');

        if (colorClass) this.addClass(colorClass);
        this.addClass('button');
    }


    protected addClass(className: string): void {
        this.renderer.addClass(this.el.nativeElement, className);
    }
}