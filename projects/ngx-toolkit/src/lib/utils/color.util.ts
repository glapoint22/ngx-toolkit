import { ColorType } from "../types/color.type";

export class ColorUtil {
    public static getColorClass(colorType: ColorType, componentName: string): string | null {
        let colorClass: string | null = null;

        // If a color type is set, construct the color class using the color type and component name
        if (colorType) {
            colorClass = colorType + '-' + componentName + '-color';
        }

        return colorClass;
    }
}