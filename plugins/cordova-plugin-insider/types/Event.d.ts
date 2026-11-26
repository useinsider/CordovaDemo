import type { InsiderObject } from './InsiderObject';

export interface Event {
    addParameterWithString(key: string, value: string): Event;
    /** A value outside the 32-bit integer range is ignored with a console warning. */
    addParameterWithInt(key: string, value: number): Event;
    addParameterWithDouble(key: string, value: number): Event;
    addParameterWithBoolean(key: string, value: boolean): Event;
    addParameterWithDate(key: string, value: Date): Event;
    /**
     * @deprecated Use `addParameterWithStringArray` instead.
     */
    addParameterWithArray(key: string, value: object): Event;
    addParameterWithStringArray(key: string, value: Array<string>): Event;
    addParameterWithNumericArray(key: string, value: Array<number>): Event;
    /**
     * Adds an array-of-objects parameter. These are insert-only: they cannot be updated later
     * and cannot be used as a filter. Non-object elements and objects left with no sendable key
     * are excluded; if nothing survives, the parameter is not added and a console warning is logged.
     */
    addParameterWithObjectArray(key: string, value: InsiderObject[]): Event;
    build(): void;
}