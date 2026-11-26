import type { InsiderObject } from './InsiderObject';

export interface User {
    setGender(gender: number): User;
    setBirthday(birthday: Date): User;
    setName(name: string): User;
    setSurname(surname: string): User;
    setAge(age: number): User;
    setEmail(email: string): User;
    setPhoneNumber(phone: string): User;
    setLanguage(language: string): User;
    setLocale(locale: string): User;
    setFacebookID(facebookID: string): User;
    setTwitterID(twitterID: string): User;
    setEmailOptin(emailOptIn: boolean): User;
    setSMSOptin(smsOptIn: boolean): User;
    setPushOptin(pushOptIn: boolean): User;
    setLocationOptin(locationOptIn: boolean): User;
    setWhatsappOptin(whatsappOptin: boolean): User;
    setPromotionalOptin(promotionalOptin: boolean): User;
    login(identifiers: object, insiderIDResult?: Function): void;
    logout(): void;
    logoutResettingInsiderID(identifiers?: object[] | null, insiderIDResult?: (insiderID: string) => void): void;
    setCustomAttributeWithString(key: string, value: string): User;
    /** A value outside the 32-bit integer range is ignored with a console warning. */
    setCustomAttributeWithInt(key: string, value: number): User;
    setCustomAttributeWithDouble(key: string, value: number): User;
    setCustomAttributeWithBoolean(key: string, value: boolean): User;
    setCustomAttributeWithDate(key: string, value: Date): User;
    setCustomAttributeWithArray(key: string, value: object): User;
    /**
     * Appends objects to an array-of-objects custom attribute.
     * Keys that cannot be sent are dropped from their object and named in a console warning;
     * whatever survived is still sent. Non-object elements and objects left with no sendable key
     * are excluded; if nothing survives, the call is refused with a console warning.
     */
    addObjectsToCustomAttribute(key: string, objects: InsiderObject[]): User;
    /**
     * Merges `value` into every object of the attribute that matches `match`.
     * If `match` loses any key during serialization the whole call is refused, because a widened
     * match would rewrite objects that were never targeted.
     * An explicit empty `match` (`{}`) is rejected as invalid input — merge has no wildcard.
     * Keys of `value` that cannot be sent are dropped and named in a console warning; a `value`
     * that is empty or left with no sendable key refuses the call instead of merging nothing.
     */
    mergeObjectsInCustomAttribute(key: string, match: InsiderObject, value: InsiderObject): User;
    /**
     * Removes every object of the attribute that matches `match`.
     * Omitting `match` (or passing `null`) removes EVERY object of the attribute and cannot be undone.
     * An explicit empty object (`{}`) is rejected as invalid input — it is NOT a wildcard; only an
     * omitted or `null` match removes everything.
     */
    removeObjectsFromCustomAttribute(key: string, match?: InsiderObject | null): User;
    unsetCustomAttribute(key: string): User;
}