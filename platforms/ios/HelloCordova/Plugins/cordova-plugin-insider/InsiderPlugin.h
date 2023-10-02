#import <InsiderMobile/Insider.h>
#import <InsiderHybrid/InsiderHybrid.h>
#import <InsiderMobile/InsiderCallbackTypeEnum.h>
#import <InsiderGeofence/InsiderGeofence.h>
#import "IDFAHelper.h"
#import <UserNotifications/UserNotifications.h>

@interface InsiderPlugin : CDVPlugin

- (void) init:(CDVInvokedUrlCommand *)command;
- (void) initWithLaunchOptions:(CDVInvokedUrlCommand *)command;
- (void) reinitWithPartnerName:(CDVInvokedUrlCommand *)command;
- (void) registerWithQuietPermission:(CDVInvokedUrlCommand *)command;
- (void) enableIDFACollection:(CDVInvokedUrlCommand *)command;
- (void) setGDPRConsent:(CDVInvokedUrlCommand *)command;
- (void) startTrackingGeofence:(CDVInvokedUrlCommand *)command;
- (void) tagEvent:(CDVInvokedUrlCommand *)command;
- (void) enableLocationCollection:(CDVInvokedUrlCommand *)command;
- (void) enableIpCollection:(CDVInvokedUrlCommand *)command;
- (void) enableCarrierCollection:(CDVInvokedUrlCommand *)command;
- (void) removeInapp:(CDVInvokedUrlCommand *)command;
- (void) getContentStringWithName:(CDVInvokedUrlCommand *)command;
- (void) getContentIntWithName:(CDVInvokedUrlCommand *)command;
- (void) getContentBoolWithName:(CDVInvokedUrlCommand *)command;
- (void) visitHomePage:(CDVInvokedUrlCommand *)command;
- (void) visitListingPage:(CDVInvokedUrlCommand *)command;
- (void) visitProductDetailPage:(CDVInvokedUrlCommand *)command;
- (void) visitCartPage:(CDVInvokedUrlCommand *)command;
- (void) itemPurchased:(CDVInvokedUrlCommand *)command;
- (void) itemAddedToCart:(CDVInvokedUrlCommand *)command;
- (void) itemRemovedFromCart:(CDVInvokedUrlCommand *)command;
- (void) cartCleared:(CDVInvokedUrlCommand *)command;
- (void) getSmartRecommendation:(CDVInvokedUrlCommand *)command;
- (void) getSmartRecommendationWithProduct:(CDVInvokedUrlCommand *)command;
- (void) getSmartRecommendationWithProductIDs:(CDVInvokedUrlCommand *)command;
- (void) clickSmartRecommendationProduct:(CDVInvokedUrlCommand *)command;
- (void) getMessageCenterData:(CDVInvokedUrlCommand *)command;
- (void) setGender:(CDVInvokedUrlCommand *)command;
- (void) setSurname:(CDVInvokedUrlCommand *)command;
- (void) setAge:(CDVInvokedUrlCommand *)command;
- (void) setSMSOptin:(CDVInvokedUrlCommand *)command;
- (void) setEmailOptin:(CDVInvokedUrlCommand *)command;
- (void) setPushOptin:(CDVInvokedUrlCommand *)command;
- (void) setLocationOptin:(CDVInvokedUrlCommand *)command;
- (void) setWhatsappOptin:(CDVInvokedUrlCommand *)command;
- (void) setLocale:(CDVInvokedUrlCommand *)command;
- (void) setFacebookID:(CDVInvokedUrlCommand *)command;
- (void) setTwitterID:(CDVInvokedUrlCommand *)command;
- (void) setCustomAttributeWithString:(CDVInvokedUrlCommand *)command;
- (void) setCustomAttributeWithInt:(CDVInvokedUrlCommand *)command;
- (void) setCustomAttributeWithDouble:(CDVInvokedUrlCommand *)command;
- (void) setCustomAttributeWithBoolean:(CDVInvokedUrlCommand *)command;
- (void) setCustomAttributeWithDate:(CDVInvokedUrlCommand *)command;
- (void) setCustomAttributeWithArray:(CDVInvokedUrlCommand *)command;
- (void) unsetCustomAttribute:(CDVInvokedUrlCommand *)command;
- (void) login:(CDVInvokedUrlCommand *)command;
- (void) logout:(CDVInvokedUrlCommand *)command;
- (void) signUpConfirmation:(CDVInvokedUrlCommand *)command;
- (void) putException:(CDVInvokedUrlCommand *)command;
- (void) handleNotification:(CDVInvokedUrlCommand *)command;
@end
