export interface Event {
    addParameterWithString(key: string, value: string): Event;
    addParameterWithInt(key: string, value: number): Event;
    addParameterWithDouble(key: string, value: number): Event;
    addParameterWithBoolean(key: string, value: boolean): Event;
    addParameterWithDate(key: string, value: string): Event;
    /**
     * @deprecated Use `addParameterWithStringArray` instead.
     */
    addParameterWithArray(key: string, value: object): Event;
    addParameterWithStringArray(key: string, value: Array<string>): Event;
    addParameterWithNumericArray(key: string, value: Array<number>): Event;
    build(): void;
}