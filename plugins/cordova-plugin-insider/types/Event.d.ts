export interface Event {
    addParameterWithString(key: string, value: string): Event;
    addParameterWithInt(key: string, value: number): Event;
    addParameterWithDouble(key: string, value: number): Event;
    addParameterWithBoolean(key: string, value: boolean): Event;
    addParameterWithDate(key: string, value: string): Event;
    addParameterWithArray(key: string, value: object): Event;
    build(): void;
}