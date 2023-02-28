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
    login(identifiers:object, insiderIDResult: Function): void;
    logout(): void;
    setCustomAttributeWithString(key: string, value: string): User;
    setCustomAttributeWithInt(key: string, value: number): User;
    setCustomAttributeWithDouble(key: string, value: number): User;
    setCustomAttributeWithBoolean(key: string, value: boolean): User;
    setCustomAttributeWithDate(key: string, value: string): User;
    setCustomAttributeWithArray(key: string, value: object): User;
    unsetCustomAttribute(key: string): User;
}