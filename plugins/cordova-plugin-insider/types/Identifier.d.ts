export interface Identifier {
    addEmail(email: string): Identifier;
    addPhoneNumber(phoneNumber: string): Identifier;
    addUserID(userID: string): Identifier;
    addCustomIdentifier(key: string, value: string): Identifier;
    getIdentifiers(): Object;
}