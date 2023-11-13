#import <Cordova/CDV.h>
#import "InsiderPlugin.h"

@interface InsiderPlugin (){
}

@end

@implementation InsiderPlugin

- (void) pluginInitialize {
}

- (void) init:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2])
            return;

        NSString* partnerName = [[command arguments] objectAtIndex:0];
        NSString* appGroup = [[command arguments] objectAtIndex:1];

        [Insider initWithLaunchOptions:nil partnerName:partnerName appGroup:appGroup];

        [self sendSuccessResultWithString:@"Insider Cordova Plugin: Initialized" andCommand:command];
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:@"Insider.m - init"];
    }
}


- (void)initWithLaunchOptions:(CDVInvokedUrlCommand *)command {
    @try{
        if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2])
            return;

        [Insider registerInsiderCallbackWithSelector:@selector(registerCallback:) sender:self];
        [Insider setHybridSDKVersion:[command.arguments objectAtIndex:1]];
        [Insider initWithLaunchOptions:nil partnerName:[command.arguments objectAtIndex:0] appGroup:[command.arguments objectAtIndex:2]];
        [Insider hybridApplicationDidBecomeActive];

        [self sendSuccessResultWithString:@"Insider Cordova Plugin: initWithLaunchOptions" andCommand:command];
    } @catch (NSException *exception){
        [Insider sendError:exception desc:@"Insider Cordova Plugin - initWithLaunchOptions"];
    }
}

- (void)initWithCustomEndpoint:(CDVInvokedUrlCommand *)command {
    @try{
        if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2] || ![command.arguments objectAtIndex:3]) {
            return;
        }

        [Insider registerInsiderCallbackWithSelector:@selector(registerCallback:) sender:self];
        [Insider setHybridSDKVersion:[command.arguments objectAtIndex:1]];
        [Insider initWithLaunchOptions:nil partnerName:[command.arguments objectAtIndex:0] appGroup:[command.arguments objectAtIndex:2] customEndpoint:[command.arguments objectAtIndex:3]];
        [Insider hybridApplicationDidBecomeActive];

        [self sendSuccessResultWithString:@"Insider Cordova Plugin: initWithCustomEndpoint" andCommand:command];
    } @catch (NSException *exception){
        [Insider sendError:exception desc:@"Insider Cordova Plugin.m - initWithCustomEndpoint"];
    }
}

- (void) reinitWithPartnerName:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0])
            return;

        [self.commandDelegate runInBackground:^{
            NSString* partnerName = [[command arguments] objectAtIndex:0];

            [Insider reinitWithPartnerName:partnerName];

            [self sendSuccessResultWithString:@"Insider Cordova Plugin: Re-Initialized." andCommand:command];
        }];
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:@"Insider.m - init"];
    }
}

-(void)registerCallback:(NSDictionary *)callbackDictionary {
    @try {
        if (!callbackDictionary || [callbackDictionary count] == 0)
            return;
        InsiderCallbackType type = (InsiderCallbackType)[[callbackDictionary objectForKey:@"type"] intValue];
        NSString* callbackData = [InsiderHybrid dictToJson:callbackDictionary];

        NSString *js;
        switch (type) {
            case InsiderCallbackTypeNotificationOpen:{
                NSString * data = [NSString stringWithFormat:@"{""action"":'NOTIFICATION_OPEN',""result"":""%@""}", callbackData];
                js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('ins_notification_handle',%@);", data];
                [self.commandDelegate evalJs:js];
                break;
            }
            case InsiderCallbackTypeInappButtonClick:{
                NSString * data = [NSString stringWithFormat:@"{""action"":'INAPP_BUTTON_CLICK',""result"":""%@""}", callbackData];
                js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('ins_notification_handle',%@);", data];
                [self.commandDelegate evalJs:js];
                break;
            }
            case InsiderCallbackTypeTempStorePurchase:{
                NSString * data = [NSString stringWithFormat:@"{""action"":'TEMP_STORE_PURCHASE',""result"":""%@""}", callbackData];
                js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('ins_notification_handle',%@);", data];
                [self.commandDelegate evalJs:js];
                break;
            }
            case InsiderCallbackTypeTempStoreAddedToCart:{
                NSString * data = [NSString stringWithFormat:@"{""action"":'TEMP_STORE_ADDED_TO_CART',""result"":""%@""}", callbackData];
                js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('ins_notification_handle',%@);", data];
                [self.commandDelegate evalJs:js];
                break;
            }
            case InsiderCallbackTypeTempStoreCustomAction:{
                NSString * data = [NSString stringWithFormat:@"{""action"":'TEMP_STORE_CUSTOM_ACTION',""result"":""%@""}", callbackData];
                js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('ins_notification_handle',%@);", data];
                [self.commandDelegate evalJs:js];
                break;
            }
            case InsiderCallbackTypeInAppSeen:{
                NSString * data = [NSString stringWithFormat:@"{""action"":'INAPP_SEEN',""result"":""%@""}", callbackData];
                js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('ins_notification_handle',%@);", data];
                [self.commandDelegate evalJs:js];
                break;
            }
            default:
                break;
        }
    } @catch (NSException *e){
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void) enableIDFACollection:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            [[IDFAHelper alloc] requestPermission];
            NSString* booleanValueByString = [[command arguments] objectAtIndex:0];
            [Insider enableIDFACollection:[booleanValueByString isEqualToString: @"true"]];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        }];
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:@"Insider.m - enableIDFACollection"];
    }
}


- (void) setGDPRConsent:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            NSString* booleanValueByString = [[command arguments] objectAtIndex:0];
            [Insider setGDPRConsent:[booleanValueByString isEqualToString: @"true"]];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        }];
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:@"Insider.m - setGDPRConsent"];
    }
}

- (void) startTrackingGeofence:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            [InsiderGeofence startTracking];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        }];
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:@"Insider.m - startTrackingGeofence"];
    }
}

- (void)registerWithQuietPermission:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [self.commandDelegate runInBackground:^{
            [Insider registerWithQuietPermission:[[command.arguments objectAtIndex:0] boolValue]];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)enableCarrierCollection:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [self.commandDelegate runInBackground:^{
            [Insider enableCarrierCollection:[[command.arguments objectAtIndex:0] boolValue]];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        }];
    } @catch (NSException *e){
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)enableIpCollection:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [self.commandDelegate runInBackground:^{
            [Insider enableIpCollection:[[command.arguments objectAtIndex:0] boolValue]];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        }];
    } @catch (NSException *e){
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)enableLocationCollection:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [self.commandDelegate runInBackground:^{
            [Insider enableLocationCollection:[[command.arguments objectAtIndex:0] boolValue]];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        }];
    } @catch (NSException *e){
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}


- (void) tagEvent:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            NSString* eventName = [[command arguments] objectAtIndex:0];
            NSDictionary* parameters = [[command arguments] objectAtIndex:1];
            [[Insider tagEvent:eventName].addParameters(parameters) build];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:@"Insider.m - tagEvent"];
    }
}


- (void) removeInapp:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            [Insider removeInapp];
        }];
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:@"Insider.m - tagEvent"];
    }
}


- (void)hybridIntent:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            [Insider hybridApplicationDidBecomeActive];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)getContentStringWithName:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2]) return;
        [self.commandDelegate runInBackground:^{
            NSString *coResult = [Insider getContentStringWithName:[command.arguments objectAtIndex:0] defaultString:[command.arguments objectAtIndex:1] dataType:[[command.arguments objectAtIndex:2] intValue]];
            [self sendSuccessResultWithString:coResult andCommand:command];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)getContentIntWithName:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2]) return;
        [self.commandDelegate runInBackground:^{
            int coResult = [Insider getContentIntWithName:[command.arguments objectAtIndex:0] defaultInt:[[command.arguments objectAtIndex:1] intValue] dataType:[[command.arguments objectAtIndex:2] intValue]];
            [self sendSuccessResultWithInt:coResult andCommand:command];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)getContentBoolWithName:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2]) return;
        [self.commandDelegate runInBackground:^{
            bool coResult = [Insider getContentBoolWithName:[command.arguments objectAtIndex:0] defaultBool:[[command.arguments objectAtIndex:1] boolValue] dataType:[[command.arguments objectAtIndex:2] intValue]];
            [self sendSuccessResultWithInt:coResult andCommand:command];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)visitHomePage:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            [Insider visitHomepage];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)visitListingPage:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (![command.arguments objectAtIndex:0]) return;
            [Insider visitListingPageWithTaxonomy:[command.arguments objectAtIndex:0]];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)visitProductDetailPage:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1]) return;
            InsiderProduct* product =  (InsiderProduct *)[InsiderHybrid createProduct:[command.arguments objectAtIndex:0] productOptMap:[command.arguments objectAtIndex:1]];
            [Insider visitProductDetailPageWithProduct:product];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)visitCartPage:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (![command.arguments objectAtIndex:0]) return;
            [InsiderHybrid visitCartPage:[command.arguments objectAtIndex:0]];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)itemPurchased:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2]) return;
            InsiderProduct *product = (InsiderProduct *)[InsiderHybrid createProduct:[command.arguments objectAtIndex:1] productOptMap:[command.arguments objectAtIndex:2]];
            [Insider itemPurchasedWithSaleID:[command.arguments objectAtIndex:0] product:product];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)itemAddedToCart:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1]) return;
            InsiderProduct *product = (InsiderProduct *)[InsiderHybrid createProduct:[command.arguments objectAtIndex:0] productOptMap:[command.arguments objectAtIndex:1]];
            [Insider itemAddedToCartWithProduct:product];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)itemRemovedFromCart:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (![command.arguments objectAtIndex:0]) return;
            [Insider itemRemovedFromCartWithProductID:[command.arguments objectAtIndex:0]];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)cartCleared:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            [Insider cartCleared];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)getSmartRecommendation:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2]) return;
            [Insider getSmartRecommendationWithID:[[command.arguments objectAtIndex:0] intValue] locale:[command.arguments objectAtIndex:1] currency:[command.arguments objectAtIndex:2] smartRecommendation:^(NSDictionary *recommendation) {
                [self sendSuccessResultWithDictionary:recommendation andCommand:command];
            }];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)getSmartRecommendationWithProduct:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2] || ![command.arguments objectAtIndex:3]) return;
            InsiderProduct *product = (InsiderProduct *)[InsiderHybrid createProduct:[command.arguments objectAtIndex:0] productOptMap:[command.arguments objectAtIndex:1]];
            [Insider getSmartRecommendationWithProduct:product recommendationID:[[command.arguments objectAtIndex:2] intValue] locale:[command.arguments objectAtIndex:3] smartRecommendation:^(NSDictionary *recommendation) {
                [self sendSuccessResultWithDictionary:recommendation andCommand:command];
            }];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)getSmartRecommendationWithProductIDs:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2] || ![command.arguments objectAtIndex:3]) return;

            [Insider getSmartRecommendationWithProductIDs:[command.arguments objectAtIndex:0] recommendationID:[[command.arguments objectAtIndex:1] intValue] locale:[command.arguments objectAtIndex:2]  currency:[command.arguments objectAtIndex:3] smartRecommendation:^(NSDictionary *recommendation) {
                [self sendSuccessResultWithDictionary:recommendation andCommand:command];
            }];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)clickSmartRecommendationProduct:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2]) return;
            InsiderProduct *product = (InsiderProduct *)[InsiderHybrid createProduct:[command.arguments objectAtIndex:0] productOptMap:[command.arguments objectAtIndex:1]];
            [Insider clickSmartRecommendationProductWithID:[[command.arguments objectAtIndex:2] intValue] product:product];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)getMessageCenterData:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2]) return;
            [InsiderHybrid getMessageCenterDataWithLimit:[[command.arguments objectAtIndex:0] intValue] startDate:[command.arguments objectAtIndex:1] endDate:[command.arguments objectAtIndex:2] success:^(NSArray *messageCenterData) {
                [self sendSuccessResultWithArray:messageCenterData andCommand:command];
            }];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setGender:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            if (![command.arguments objectAtIndex:0]) return;
            [InsiderHybrid setGender:[[command.arguments objectAtIndex:0] intValue]];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setBirthday:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [InsiderHybrid setBirthday:[command.arguments objectAtIndex:0]];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setName:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [Insider getCurrentUser].setName([command.arguments objectAtIndex:0]);
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setSurname:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [Insider getCurrentUser].setSurname([command.arguments objectAtIndex:0]);
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setAge:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [Insider getCurrentUser].setAge([[command.arguments objectAtIndex:0] intValue]);
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setSMSOptin:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [Insider getCurrentUser].setSMSOptin([[command.arguments objectAtIndex:0] boolValue]);
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setEmailOptin:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [Insider getCurrentUser].setEmailOptin([[command.arguments objectAtIndex:0] boolValue]);
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setPushOptin:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [Insider getCurrentUser].setPushOptin([[command.arguments objectAtIndex:0] boolValue]);
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setLocationOptin:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [Insider getCurrentUser].setLocationOptin([[command.arguments objectAtIndex:0] boolValue]);
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setWhatsappOptin:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [Insider getCurrentUser].setWhatsappOptin([[command.arguments objectAtIndex:0] boolValue]);
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setLanguage:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [Insider getCurrentUser].setLanguage([command.arguments objectAtIndex:0]);
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setLocale:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [Insider getCurrentUser].setLocale([command.arguments objectAtIndex:0]);

    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setFacebookID:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [Insider getCurrentUser].setFacebookID([command.arguments objectAtIndex:0]);

    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setTwitterID:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [Insider getCurrentUser].setTwitterID([command.arguments objectAtIndex:0]);

    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setCustomAttributeWithString:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1]) return;
        [Insider getCurrentUser].setCustomAttributeWithString([command.arguments objectAtIndex:0], [command.arguments objectAtIndex:1]);

    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setCustomAttributeWithInt:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1]) return;
        [Insider getCurrentUser].setCustomAttributeWithInt([command.arguments objectAtIndex:0], [[command.arguments objectAtIndex:1] intValue]);

    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setCustomAttributeWithDouble:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1]) return;
        [Insider getCurrentUser].setCustomAttributeWithDouble([command.arguments objectAtIndex:0], [[command.arguments objectAtIndex:1] doubleValue]);

    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setCustomAttributeWithBoolean:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1]) return;
        [Insider getCurrentUser].setCustomAttributeWithBoolean([command.arguments objectAtIndex:0], [[command.arguments objectAtIndex:1] boolValue]);

    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setCustomAttributeWithDate:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1]) return;
        [InsiderHybrid setCustomAttributeWithDate:[command.arguments objectAtIndex:0] value:[command.arguments objectAtIndex:1]];

    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)setCustomAttributeWithArray:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1]) return;
        [Insider getCurrentUser].setCustomAttributeWithArray([command.arguments objectAtIndex:0], [command.arguments objectAtIndex:1]);

    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)unsetCustomAttribute:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [Insider getCurrentUser].unsetCustomAttribute([command.arguments objectAtIndex:0]);

    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)login:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (![command.arguments objectAtIndex:0]) return;
            NSMutableDictionary *identifiers  = [command.arguments objectAtIndex:0];
            InsiderIdentifiers *insiderIdentifiers = [[InsiderIdentifiers alloc] init];
            for (NSString *key in identifiers.allKeys){
                if([key isEqualToString:@"addEmail"]){
                    insiderIdentifiers.addEmail([identifiers objectForKey:key]);
                } else if([key isEqualToString:@"addPhoneNumber"]){
                    insiderIdentifiers.addPhoneNumber([identifiers objectForKey:key]);
                } else if([key isEqualToString:@"addUserID"]){
                    insiderIdentifiers.addUserID([identifiers objectForKey:key]);
                } else {
                    insiderIdentifiers.addCustomIdentifier(key, [identifiers objectForKey:key]);
                }
            }

            if ([command.arguments count] > 1) {
                [[Insider getCurrentUser] login:insiderIdentifiers insiderIDResult:^(NSString *insiderID) {
                    [self sendSuccessResultWithString:insiderID andCommand:command];
                }];
            }

            InsiderUser* currentUser = [Insider getCurrentUser];

            [currentUser login:insiderIdentifiers];

        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)logout:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            [[Insider getCurrentUser] logout];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });

    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)signUpConfirmation:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            [Insider signUpConfirmation];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:@"Insider.m - signUpConfirmation"];
    }
}

- (void)setActiveForegroundPushView:(CDVInvokedUrlCommand *)command {
    @try {
        [Insider setActiveForegroundPushView];
        [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:@"Insider.m - setActiveForegroundPushView"];
    }
}

- (void)setForegroundPushCallback:(CDVInvokedUrlCommand *)command {
    @try {
        [Insider setForegroundPushCallback:@selector(foregroundPushCallback:) sender:self];
        [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:@"Insider.m - setForegroundPushCallback"];
    }
}

- (void)foregroundPushCallback:(UNNotification *) notification {
    @try {
        NSString *jsCode = [NSString stringWithFormat:@"cordova.fireDocumentEvent('ins_foreground_push_callback',%@);", [InsiderHybrid dictToJson:notification.request.content.userInfo]];

        [self.commandDelegate evalJs:jsCode];
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:@"Insider.m - foregroundPushCallback"];
    }
}

- (void) handleNotification:(CDVInvokedUrlCommand *) command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;

        NSMutableDictionary *mutableNotification = [[command.arguments objectAtIndex:0] mutableCopy];

        mutableNotification[@"aps"] = @"insider";

        [Insider handlePushLogWithUserInfo:mutableNotification];
        [Insider trackInteractiveLogWithUserInfo:mutableNotification];
    } @catch (NSException *exception){
        [Insider sendError:exception desc:@"Insider.m - handleNotification"];
    }
}

- (void)putException:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        NSException *e = [NSException exceptionWithName:@"[Insider Cordova Plugin Error]" reason:[command.arguments objectAtIndex:0] userInfo:nil];
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    } @catch (NSException *e) {
    }
}

- (void) sendErrorResultWithString:(NSString *)resultMessage andCommand:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:resultMessage];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) sendSuccessResultWithString:(NSString *)resultMessage andCommand:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:resultMessage];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) sendSuccessResultWithInt:(int)resultMessage andCommand:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:resultMessage];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) sendSuccessResultWithArray:(NSArray *)resultMessage andCommand:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:resultMessage];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) sendSuccessResultWithDictionary:(NSDictionary *)resultMessage andCommand:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:resultMessage];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
