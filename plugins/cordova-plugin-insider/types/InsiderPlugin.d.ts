import { User } from './User';
import { Event } from './Event';
import { Product } from './Product';
import { Identifier } from './Identifier';
import { Gender } from './Gender';
import { CallbackType } from './CallbackType';
import { ContentOptimizerDataType } from './ContentOptimizerDataType';

interface InsiderPlugin {
    init(partnerName: string, appGroup: string, handleNotificationCallback: Function): void;
    initWithCustomEndpoint(partnerName: string, appGroup: string, endpoint: string, handleNotificationCallback: Function): void;
    tagEvent(eventName: string): Event;
    getCurrentUser(): User;
    createNewProduct(productId: string, name: string, taxonomy: object, imageURL: string, price: number, currency: string): Product
    itemPurchased(uniqueSaleID: string, product: object): void;
    itemAddedToCart(product: object): void;
    itemRemovedFromCart(productID: string): void;
    cartCleared(): void;
    getMessageCenterData(limit: number, startDate: Date, endDate: Date): Promise <any>;
    getSmartRecommendation(recommendationID: number, locale: string, currency: string): Promise <any>;
    getSmartRecommendationWithProduct(product: object, recommendationID: number, locale: string): Promise <any>;
    getSmartRecommendationWithProductIDs(product: Array<string>, recommendationID: number, locale: string): Promise <any>;
    clickSmartRecommendationProduct(product: object, recommendationID: number);
    getContentStringWithName(variableName: string, defaultValue: any, contentOptimizerDataType: number): Promise <any>;
    getContentBoolWithName(variableName: string, defaultValue: boolean, contentOptimizerDataType: number): Promise <any>;
    getContentIntWithName(variableName: string, defaultValue: number, contentOptimizerDataType: number): Promise <any>;
    visitHomePage(): void;
    visitListingPage(taxonomy: object): void;
    visitProductDetailPage(product: object): void;
    visitCartPage(products: object): void;
    startTrackingGeofence(): void;
    setGDPRConsent(gdprConsent: boolean): void;
    enableIDFACollection(idfaCollection: boolean): void;
    removeInapp(): void;
    registerWithQuietPermission(booleanValue: boolean): void;
    setPushToken(token: string): void;
    enableLocationCollection(locationCollection: boolean): void;
    enableIpCollection(ipCollection: boolean): void;
    enableCarrierCollection(carrierCollection: boolean): void;
    signUpConfirmation(): void;
    setActiveForegroundPushView(): void;
    setForegroundPushCallback(): void;
    handleNotification(userInfo: object): void;

    gender: Gender;
    callbackType: CallbackType;
    contentOptimizerDataType: ContentOptimizerDataType;
    identifier(): Identifier;
}

declare const Insider: InsiderPlugin;
export default Insider;
