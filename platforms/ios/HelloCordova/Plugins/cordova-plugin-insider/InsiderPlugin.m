#import <Cordova/CDV.h>
#import "InsiderPlugin.h"
#import "CDVUtils.h"

@class InsiderPlugin;

/**
 * Dedicated InsiderEventListener implementation.
 *
 * WHY A SEPARATE CLASS: the SDK stores observers WEAKLY. If the plugin registered itself,
 * nothing outside the SDK would guarantee the observer stayed alive beyond Cordova's own
 * retain of the plugin, and the weak SDK reference would nil out silently the moment the
 * plugin was released - the listener would simply stop firing with no error.
 *
 * The plugin therefore holds this object STRONGLY (see the eventObserver ivar below), which
 * is what keeps the SDK's weak reference valid. The back-pointer to the plugin is weak so
 * the pair cannot form a retain cycle.
 */
@interface InsiderEventObserver : NSObject <InsiderEventListener>

@property (nonatomic, weak) InsiderPlugin *plugin;

@end

@interface InsiderPlugin ()
{
    InsiderEventObserver *eventObserver;
    NSString *eventObserverCallbackId;

    /**
     * Guards the two ivars above. They are written on the Cordova thread by
     * addEventObserver: / removeEventObserver: / dispose and read on the SDK's own listener
     * thread by handleRecordedEvent:. Without the lock that read is an unsynchronised
     * cross-thread access with no guarantee of ever observing the write.
     *
     * The lock is held only around the ivar read/write, never around sendPluginResult or a
     * dispatch onto eventQueue, so event delivery is not serialised behind it and the lock can
     * never be held while waiting on the queue (which is what would deadlock).
     */
    NSLock *eventObserverLock;

    /**
     * Dedicated SERIAL queue owning every event-observer side effect: addObserver,
     * removeObserver, and delivery of recorded events to JS.
     *
     * WHY SERIAL AND NOT commandDelegate runInBackground: that runs blocks on a CONCURRENT
     * queue. For delivery that would let two events recorded back to back reach JS in either
     * order - a product_detail_page_view landing after the purchase it preceded produces a
     * garbage funnel, and event order is the entire point of this feature. For add/remove it
     * would let a rapid remove-then-add re-subscribe execute out of order and leave the SDK
     * with no observer while JS believes one is registered. One serial queue fixes both, and
     * putting add/remove/delivery on the SAME queue additionally orders registration against
     * delivery instead of only ordering each class of work within itself.
     *
     * This mirrors the Android side, which uses a single-thread executor for the same reason.
     */
    dispatch_queue_t eventQueue;
}

- (void)handleRecordedEvent:(NSString *)name parameters:(NSDictionary<NSString *, id> *)parameters timestamp:(NSTimeInterval)timestamp;

@end

@implementation InsiderEventObserver

- (void)onEventRecorded:(NSString *)name
             parameters:(NSDictionary<NSString *, id> *)parameters
              timestamp:(NSTimeInterval)timestamp {
    @try {
        [self.plugin handleRecordedEvent:name parameters:parameters timestamp:timestamp];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

@end

@implementation InsiderPlugin

- (void) pluginInitialize {
    eventObserverLock = [[NSLock alloc] init];
    eventQueue = dispatch_queue_create("com.useinsider.cordova.events", DISPATCH_QUEUE_SERIAL);
}

- (void)dispose {
    @try {
        InsiderEventObserver *observerToRemove = nil;

        // @finally guarantees the unlock even if an exception is raised while the lock is
        // held, which would otherwise deadlock every later access to these ivars.
        [eventObserverLock lock];
        @try {
            observerToRemove = eventObserver;

            eventObserver = nil;
            eventObserverCallbackId = nil;
        } @finally {
            [eventObserverLock unlock];
        }

        if (observerToRemove != nil) {
            [[Insider events] removeObserver:observerToRemove];
        }
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }

    [super dispose];
}

- (NSString *)resolveAppIdentifier:(CDVInvokedUrlCommand *)command {
    if (command.arguments.count <= 4)
        return nil;

    id appIdentifier = [command.arguments objectAtIndex:4];

    return [appIdentifier isKindOfClass:[NSString class]] && [appIdentifier length] > 0 ? appIdentifier : nil;
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
        NSString *appIdentifier = [self resolveAppIdentifier:command];

        if (appIdentifier)
            [Insider initWithLaunchOptions:nil partnerName:[command.arguments objectAtIndex:0] appGroup:[command.arguments objectAtIndex:2] appIdentifier:appIdentifier];
        else
            [Insider initWithLaunchOptions:nil partnerName:[command.arguments objectAtIndex:0] appGroup:[command.arguments objectAtIndex:2]];

        [Insider applicationDidBecomeActive];
        
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
        NSString *appIdentifier = [self resolveAppIdentifier:command];

        if (appIdentifier)
            [Insider initWithLaunchOptions:nil partnerName:[command.arguments objectAtIndex:0] appGroup:[command.arguments objectAtIndex:2] customEndpoint:[command.arguments objectAtIndex:3] appIdentifier:appIdentifier];
        else
            [Insider initWithLaunchOptions:nil partnerName:[command.arguments objectAtIndex:0] appGroup:[command.arguments objectAtIndex:2] customEndpoint:[command.arguments objectAtIndex:3]];

        [Insider applicationDidBecomeActive];
        
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
            case InsiderCallbackTypeSessionStarted:{
                NSString * data = [NSString stringWithFormat:@"{""action"":'SESSION_STARTED',""result"":""%@""}", callbackData];
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
- (void) setMobileAppAccess:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            NSString* booleanValueByString = [[command arguments] objectAtIndex:0];
            [Insider setMobileAppAccess:[booleanValueByString isEqualToString: @"true"]];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        }];
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:@"Insider.m - setMobileAppAccess"];
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

- (void)setAllowsBackgroundLocationUpdates:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [self.commandDelegate runInBackground:^{
            [InsiderGeofence setAllowsBackgroundLocationUpdates:[[command.arguments objectAtIndex:0] boolValue]];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        }];
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
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
            NSArray* parameters = [[command arguments] objectAtIndex:1];
            
            InsiderEvent *event = [CDVUtils parseEventFromEventName:eventName andParameters:parameters];
            if (event) {
                [event build];
            }
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
            [Insider applicationDidBecomeActive];
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
            [self sendSuccessResultWithBool:coResult andCommand:command];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)getContentStringWithoutCache:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2]) return;
        [self.commandDelegate runInBackground:^{
            NSString *coResult = [Insider getContentStringWithoutCache:[command.arguments objectAtIndex:0] defaultString:[command.arguments objectAtIndex:1] dataType:[[command.arguments objectAtIndex:2] intValue]];
            [self sendSuccessResultWithString:coResult andCommand:command];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)getContentIntWithoutCache:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2]) return;
        [self.commandDelegate runInBackground:^{
            int coResult = [Insider getContentIntWithoutCache:[command.arguments objectAtIndex:0] defaultInt:[[command.arguments objectAtIndex:1] intValue] dataType:[[command.arguments objectAtIndex:2] intValue]];
            [self sendSuccessResultWithInt:coResult andCommand:command];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)getContentBoolWithoutCache:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2]) return;
        [self.commandDelegate runInBackground:^{
            bool coResult = [Insider getContentBoolWithoutCache:[command.arguments objectAtIndex:0] defaultBool:[[command.arguments objectAtIndex:1] boolValue] dataType:[[command.arguments objectAtIndex:2] intValue]];
            [self sendSuccessResultWithBool:coResult andCommand:command];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)markContentOptimizerAsSeen:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [Insider markContentOptimizerAsSeen:[command.arguments objectAtIndex:0]];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)visitHomePage:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            NSDictionary *mappedCustomParameters = [CDVUtils parseCustomParameters:[command.arguments objectAtIndex:0]];
            
            if (mappedCustomParameters.count > 0) {
                [Insider visitHomepageWithCustomParameters:mappedCustomParameters];
            } else {
                [Insider visitHomepage];
            }
            
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
    }
}

- (void)visitListingPage:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (![command.arguments objectAtIndex:0]) {
                [self sendErrorResultWithString:@"Taxonomy is required" andCommand:command];
                return;
            };
            
            NSDictionary *mappedCustomParameters = [CDVUtils parseCustomParameters:[command.arguments objectAtIndex:1]];
            
            if (mappedCustomParameters.count > 0) {
                [Insider visitListingPageWithTaxonomy:[command.arguments objectAtIndex:0] customParameters:mappedCustomParameters];
            } else {
                [Insider visitListingPageWithTaxonomy:[command.arguments objectAtIndex:0]];
            }
            
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
    }
}

- (void)visitProductDetailPage:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2]) {
                [self sendErrorResultWithString:@"Required fields, optional fields and custom product parameters are required" andCommand:command];
                return;
            };
            
            NSDictionary *requiredFields = [command.arguments objectAtIndex:0];
            NSDictionary *optionalFields = [command.arguments objectAtIndex:1];
            NSArray *customParameters = [command.arguments objectAtIndex:2];
            NSDictionary *mappedCustomParameters = [CDVUtils parseCustomParameters:[command.arguments objectAtIndex:3]];
            InsiderProduct* product = [CDVUtils parseProductFromRequiredFields:requiredFields andOptionalFields:optionalFields andCustomParameters:customParameters];
            
            if (mappedCustomParameters.count > 0) {
                [Insider visitProductDetailPageWithProduct:product customParameters:mappedCustomParameters];
            } else {
                [Insider visitProductDetailPageWithProduct:product];
            }
            
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
    }
}

- (void)visitCartPage:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (![command.arguments objectAtIndex:0]) {
                [self sendErrorResultWithString:@"Products array is required" andCommand:command];
                return;
            };
            
            NSArray *productsArray = [command.arguments objectAtIndex:0];
            NSMutableArray *insiderProducts = [NSMutableArray array];

            for (NSDictionary *productDict in productsArray) {
                if (![productDict isKindOfClass:[NSDictionary class]]) continue;
                NSDictionary *requiredFields = [productDict objectForKey:@"requiredFields"];
                NSDictionary *optionalFields = [productDict objectForKey:@"optionalFields"];
                NSArray *customParameters = [productDict objectForKey:@"customParameters"];

                if (requiredFields) {
                    InsiderProduct *product = [CDVUtils parseProductFromRequiredFields:requiredFields andOptionalFields:optionalFields andCustomParameters:customParameters];
                    if (product) {
                        [insiderProducts addObject:product];
                    }
                }
            }

            NSString *saleID = (command.arguments.count > 1 && ![[command.arguments objectAtIndex:1] isKindOfClass:[NSNull class]]) ? [command.arguments objectAtIndex:1] : nil;
            NSArray *customParamsArray = (command.arguments.count > 2 && ![[command.arguments objectAtIndex:2] isKindOfClass:[NSNull class]]) ? [command.arguments objectAtIndex:2] : @[];
            NSDictionary *mappedCustomParameters = [CDVUtils parseCustomParameters:customParamsArray];

            if (saleID.length > 0) {
                [Insider visitCartPageWithProducts:[insiderProducts copy] saleID:saleID customParameters:mappedCustomParameters];
            } else if (mappedCustomParameters.count > 0) {
                [Insider visitCartPageWithProducts:[insiderProducts copy] customParameters:mappedCustomParameters];
            } else {
                [Insider visitCartPageWithProducts:[insiderProducts copy]];
            }
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
    }
}

- (void)itemPurchased:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2] || ![command.arguments objectAtIndex:3]) {
                [self sendErrorResultWithString:@"Required fields, optional fields, custom product parameters and custom parameters are required" andCommand:command];
                return;
            };
            
            NSDictionary *requiredFields = [command.arguments objectAtIndex:1];
            NSDictionary *optionalFields = [command.arguments objectAtIndex:2];
            NSArray *customParameters = [command.arguments objectAtIndex:3];
            InsiderProduct *product = [CDVUtils parseProductFromRequiredFields:requiredFields andOptionalFields:optionalFields andCustomParameters:customParameters];
            NSDictionary *mappedCustomParameters = [CDVUtils parseCustomParameters:[command.arguments objectAtIndex:4]];
            
            if (mappedCustomParameters.count > 0) {
                [Insider itemPurchasedWithSaleID:[command.arguments objectAtIndex:0] product:product customParameters:mappedCustomParameters];
            } else {
                [Insider itemPurchasedWithSaleID:[command.arguments objectAtIndex:0] product:product];
            }
            
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
    }
}

- (void)itemAddedToCart:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2]) {
                [self sendErrorResultWithString:@"Required fields, optional fields and custom product parameters are required" andCommand:command];
                return;
            };
            
            NSDictionary *requiredFields = [command.arguments objectAtIndex:0];
            NSDictionary *optionalFields = [command.arguments objectAtIndex:1];
            NSArray *customParameters = [command.arguments objectAtIndex:2];
            InsiderProduct *product = [CDVUtils parseProductFromRequiredFields:requiredFields andOptionalFields:optionalFields andCustomParameters:customParameters];
            NSDictionary *mappedCustomParameters = [CDVUtils parseCustomParameters:[command.arguments objectAtIndex:3]];
            
            if (mappedCustomParameters.count > 0) {
                [Insider itemAddedToCartWithProduct:product customParameters:mappedCustomParameters];
            } else {
                [Insider itemAddedToCartWithProduct:product];
            }
            
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
    }
}

- (void)itemRemovedFromCart:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (![command.arguments objectAtIndex:0]) return;
            NSString *productID = [command.arguments objectAtIndex:0];
            NSString *saleID = (command.arguments.count > 1 && ![[command.arguments objectAtIndex:1] isKindOfClass:[NSNull class]]) ? [command.arguments objectAtIndex:1] : nil;
            NSArray *customParamsArray = (command.arguments.count > 2 && ![[command.arguments objectAtIndex:2] isKindOfClass:[NSNull class]]) ? [command.arguments objectAtIndex:2] : @[];
            NSDictionary *mappedCustomParameters = [CDVUtils parseCustomParameters:customParamsArray];

            if (saleID.length > 0) {
                [Insider itemRemovedFromCartWithProductID:productID saleID:saleID customParameters:mappedCustomParameters];
            } else if (mappedCustomParameters.count > 0) {
                [Insider itemRemovedFromCartWithProductID:productID customParameters:mappedCustomParameters];
            } else {
                [Insider itemRemovedFromCartWithProductID:productID];
            }
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
    }
}

- (void)cartCleared:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            NSDictionary *mappedCustomParameters = [CDVUtils parseCustomParameters:[command.arguments objectAtIndex:0]];
            
            if (mappedCustomParameters.count > 0) {
                [Insider cartClearedWithCustomParameters:mappedCustomParameters];
            } else {
                [Insider cartCleared];
            }
            
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
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
            if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2] || ![command.arguments objectAtIndex:3] || ![command.arguments objectAtIndex:4]) return;
            NSDictionary *requiredFields = [command.arguments objectAtIndex:0];
            NSDictionary *optionalFields = [command.arguments objectAtIndex:1];
            NSArray *customParameters = [command.arguments objectAtIndex:2];
            InsiderProduct *product = [CDVUtils parseProductFromRequiredFields:requiredFields andOptionalFields:optionalFields andCustomParameters:customParameters];
            [Insider getSmartRecommendationWithProduct:product recommendationID:[[command.arguments objectAtIndex:3] intValue] locale:[command.arguments objectAtIndex:4] smartRecommendation:^(NSDictionary *recommendation) {
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
            if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2] || ![command.arguments objectAtIndex:3]) return;
            NSDictionary *requiredFields = [command.arguments objectAtIndex:0];
            NSDictionary *optionalFields = [command.arguments objectAtIndex:1];
            NSArray *customParameters = [command.arguments objectAtIndex:2];
            InsiderProduct *product = [CDVUtils parseProductFromRequiredFields:requiredFields andOptionalFields:optionalFields andCustomParameters:customParameters];
            [Insider clickSmartRecommendationProductWithID:[[command.arguments objectAtIndex:3] intValue] product:product];
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)getMessageCenterData:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2]) return;
            
            NSInteger startDateEpoch = [[command.arguments objectAtIndex:1] integerValue];
            NSInteger endDateEpoch = [[command.arguments objectAtIndex:2] integerValue];
            
            [InsiderHybrid getMessageCenterDataWithLimit:[[command.arguments objectAtIndex:0] intValue] startDate:startDateEpoch endDate:endDateEpoch success:^(NSArray *messageCenterData) {
                [self sendSuccessResultWithArray:messageCenterData andCommand:command];
            }];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)getMessageCenterDataWithIdentifiers:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2] || ![command.arguments objectAtIndex:3]) return;

            NSTimeInterval startDateEpoch = [[command.arguments objectAtIndex:1] doubleValue] / 1000.0;
            NSTimeInterval endDateEpoch = [[command.arguments objectAtIndex:2] doubleValue] / 1000.0;
            NSDate *startDate = [NSDate dateWithTimeIntervalSince1970:startDateEpoch];
            NSDate *endDate = [NSDate dateWithTimeIntervalSince1970:endDateEpoch];

            InsiderIdentifiers *insiderIdentifiers = [self buildInsiderIdentifiersFromMap:[command.arguments objectAtIndex:3]];

            [Insider getMessageCenterDataWithLimit:[[command.arguments objectAtIndex:0] integerValue]
                                         startDate:startDate
                                           endDate:endDate
                                       identifiers:insiderIdentifiers
                                           success:^(NSArray *messageCenterData) {
                [self sendSuccessResultWithArray:messageCenterData andCommand:command];
            }];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)getAppCardsCampaigns:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            [[Insider appCards] getCampaigns:^(InsiderAppCardCampaignsResponseModel *inbox, NSError *error) {
                if (error) {
                    [self sendErrorResultWithDictionary:[CDVUtils appCardsErrorToDictionary:error] andCommand:command];
                } else {
                    NSDictionary *inboxDict = [inbox toDictionary] ?: @{};
                    [self sendSuccessResultWithDictionary:inboxDict andCommand:command];
                }
            }];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)markAppCardAsRead:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            if (![command.arguments objectAtIndex:0]) {
                [self sendErrorResultWithString:@"appCardIds argument is required" andCommand:command];
                return;
            }

            NSArray *appCardIdsArray = [command.arguments objectAtIndex:0];
            NSSet<NSString *> *appCardIds = [NSSet setWithArray:appCardIdsArray];
            [[Insider appCards] markAsRead:appCardIds completion:^(NSError *error) {
                if (error) {
                    [self sendErrorResultWithDictionary:[CDVUtils appCardsErrorToDictionary:error] andCommand:command];
                } else {
                    [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
                }
            }];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
    }
}

- (void)markAppCardAsUnread:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            if (![command.arguments objectAtIndex:0]) {
                [self sendErrorResultWithString:@"appCardIds argument is required" andCommand:command];
                return;
            }

            NSArray *appCardIdsArray = [command.arguments objectAtIndex:0];
            NSSet<NSString *> *appCardIds = [NSSet setWithArray:appCardIdsArray];
            [[Insider appCards] markAsUnread:appCardIds completion:^(NSError *error) {
                if (error) {
                    [self sendErrorResultWithDictionary:[CDVUtils appCardsErrorToDictionary:error] andCommand:command];
                } else {
                    [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
                }
            }];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
    }
}

- (void)viewAppCard:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) {
            [self sendErrorResultWithString:@"app card data argument is required" andCommand:command];
            return;
        }

        NSDictionary *data = [CDVUtils dictionaryFromJSONString:[command.arguments objectAtIndex:0]];

        if (!data) {
            [self sendErrorResultWithString:@"Invalid app card data JSON" andCommand:command];
            return;
        }

        InsiderAppCardModel *model = [[InsiderAppCardModel alloc] initWithDictionary:data error:nil];

        if (model) {
            [model view];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        } else {
            [self sendErrorResultWithString:@"Failed to create app card model" andCommand:command];
        }
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
    }
}

- (void)clickAppCard:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) {
            [self sendErrorResultWithString:@"app card data argument is required" andCommand:command];
            return;
        }

        NSDictionary *data = [CDVUtils dictionaryFromJSONString:[command.arguments objectAtIndex:0]];

        if (!data) {
            [self sendErrorResultWithString:@"Invalid app card data JSON" andCommand:command];
            return;
        }

        InsiderAppCardModel *model = [[InsiderAppCardModel alloc] initWithDictionary:data error:nil];

        if (model) {
            [model click];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        } else {
            [self sendErrorResultWithString:@"Failed to create app card model" andCommand:command];
        }
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
    }
}

- (void)clickAppCardButton:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1]) {
            [self sendErrorResultWithString:@"appCardId and button data arguments are required" andCommand:command];
            return;
        }

        NSDictionary *data = [CDVUtils dictionaryFromJSONString:[command.arguments objectAtIndex:1]];

        if (!data) {
            [self sendErrorResultWithString:@"Invalid button data JSON" andCommand:command];
            return;
        }

        InsiderAppCardButtonModel *model = [[InsiderAppCardButtonModel alloc] initWithDictionary:data error:nil];

        if (model) {
            [model setAppCardId:[command.arguments objectAtIndex:0]];
            [model click];

            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        } else {
            [self sendErrorResultWithString:@"Failed to create button model" andCommand:command];
        }
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
    }
}

- (void)deleteAppCards:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            if (![command.arguments objectAtIndex:0]) {
                [self sendErrorResultWithString:@"appCardIds argument is required" andCommand:command];
                return;
            }

            NSArray *appCardIdsArray = [command.arguments objectAtIndex:0];
            NSSet<NSString *> *appCardIds = [NSSet setWithArray:appCardIdsArray];
            [[Insider appCards] deleteAppCards:appCardIds completion:^(NSError *error) {
                if (error) {
                    [self sendErrorResultWithDictionary:[CDVUtils appCardsErrorToDictionary:error] andCommand:command];
                } else {
                    [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
                }
            }];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
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
        // value is epoch milliseconds as string
        NSString *epochString = [command.arguments objectAtIndex:0];
        long long epochMillis = [epochString longLongValue];
        NSTimeInterval seconds = ((NSTimeInterval)epochMillis) / 1000.0;
        NSDate *birthday = [NSDate dateWithTimeIntervalSince1970:seconds];
        
        [Insider getCurrentUser].setBirthday(birthday);
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

- (void)setPhoneNumber:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        
        [Insider getCurrentUser].setPhoneNumber([command.arguments objectAtIndex:0]);
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

- (void)setEmail:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        
        [Insider getCurrentUser].setEmail([command.arguments objectAtIndex:0]);
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

- (void)setPromotionalOptin:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;
        [Insider getCurrentUser].setPromotionalOptin([[command.arguments objectAtIndex:0] boolValue]);
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
        // value is epoch milliseconds as string
        NSString *epochString = [command.arguments objectAtIndex:1];
        long long epochMillis = [epochString longLongValue];
        NSTimeInterval seconds = ((NSTimeInterval)epochMillis) / 1000.0;
        NSDate *dateValue = [NSDate dateWithTimeIntervalSince1970:seconds];
        [Insider getCurrentUser].setCustomAttributeWithDate([command.arguments objectAtIndex:0], dateValue);
        
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
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            id identifiers = command.arguments.count > 0 ? [command.arguments objectAtIndex:0] : nil;

            if (![identifiers isKindOfClass:[NSDictionary class]]) return;

            InsiderIdentifiers *insiderIdentifiers = [self buildInsiderIdentifiersFromMap:identifiers];
            
            if ([command.arguments count] > 1) {
                [[Insider getCurrentUser] login:insiderIdentifiers insiderIDResult:^(NSString *insiderID) {
                    [self sendSuccessResultWithString:insiderID andCommand:command];
                }];
            } else {
                [[Insider getCurrentUser] login:insiderIdentifiers];
            }
        } @catch (NSException *e) {
            [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        }
    });
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

- (void)logoutResettingInsiderID:(CDVInvokedUrlCommand *)command {
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            NSArray *identifiersArray = nil;
            if ([command.arguments count] > 0 && [command.arguments objectAtIndex:0] != [NSNull null]) {
                identifiersArray = [command.arguments objectAtIndex:0];
            }
            
            NSArray<InsiderIdentifiers *> *identifiers = [self convertArrayToInsiderIdentifiersArray:identifiersArray];
            
            if ([command.arguments count] > 1) {
                [[Insider getCurrentUser] logoutResettingInsiderID:identifiers insiderIDResult:^(NSString *insiderID) {
                    NSString *insiderIDToPass = insiderID ? insiderID : @"";
                    [self sendSuccessResultWithString:insiderIDToPass andCommand:command];
                }];
            } else {
                [[Insider getCurrentUser] logoutResettingInsiderID:identifiers];
                [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
            }
        } @catch (NSException *e) {
            [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        }
    });
}

- (void)signUpConfirmation:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            NSDictionary *mappedCustomParameters = [CDVUtils parseCustomParameters:[command.arguments objectAtIndex:0]];
            
            if (mappedCustomParameters.count > 0) {
                [Insider signUpConfirmationWithCustomParameters:mappedCustomParameters];
            } else {
                [Insider signUpConfirmation];
            }
            
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
        id notification = command.arguments.count > 0 ? [command.arguments objectAtIndex:0] : nil;

        if (![notification isKindOfClass:[NSDictionary class]]) return;

        NSMutableDictionary *mutableNotification = [notification mutableCopy];

        // APNs delivers nested Insider fields (push_buttons, ...) as JSON strings and the SDK parses
        // them as strings; a raw array/object there makes it hand a garbage callback payload back.
        for (id key in [notification allKeys]) {
            id value = notification[key];

            if (![value isKindOfClass:[NSArray class]] && ![value isKindOfClass:[NSDictionary class]]) continue;

            NSData *jsonData = [NSJSONSerialization isValidJSONObject:value] ? [NSJSONSerialization dataWithJSONObject:value options:0 error:nil] : nil;

            if (jsonData) {
                mutableNotification[key] = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            } else {
                [mutableNotification removeObjectForKey:key];
            }
        }
        
        mutableNotification[@"aps"] = @"insider";
        
        [Insider handlePushLogWithUserInfo:mutableNotification];
        [Insider trackInteractiveLogWithUserInfo:mutableNotification];
    } @catch (NSException *exception){
        [Insider sendError:exception desc:@"Insider.m - handleNotification"];
    }
}

- (void) triggerPushProcessWithNotificationData:(CDVInvokedUrlCommand *) command {
    [self handleNotification:command];
}

- (void)getInsiderID:(CDVInvokedUrlCommand *)command {
    @try {
        [self sendSuccessResultWithString:[Insider getInsiderID] andCommand:command];
    } @catch (NSException *exception){
        [Insider sendError:exception desc:@"Insider.m - getInsiderID"];
        
        [self sendSuccessResultWithString:nil andCommand:command];
    }
}

- (void)registerInsiderIDListener:(CDVInvokedUrlCommand *)command {
    @try {
        [Insider registerInsiderIDListenerWithSelector:@selector(insiderIDChangeListener:) sender:self];
    } @catch (NSException *exception){
        [Insider sendError:exception desc:@"Insider.m - registerInsiderIDListener"];
    }
}

-(void)insiderIDChangeListener:(NSString *)insiderID {
    @try {
        if (insiderID == nil) return;
        
        NSString *data = [NSString stringWithFormat:@"{""insiderID"":""'%@'""}", insiderID];
        NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('ins_insider_id_listener',%@);", data];
        
        [self.commandDelegate evalJs:js];
    } @catch (NSException *e){
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)disableInAppMessages:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            [Insider disableInAppMessages];
            
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:@"Insider.m - tagEvent"];
    }
}

- (void)enableInAppMessages:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            [Insider enableInAppMessages];
            
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:@"Insider.m - tagEvent"];
    }
}

- (void)showNativeAppReview:(CDVInvokedUrlCommand *)command {
    @try {
        dispatch_async(dispatch_get_main_queue(), ^{
            [Insider showNativeAppReview];
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        });
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:@"Insider.m - showNativeAppReview"];
    }
}

- (void)handleURL:(CDVInvokedUrlCommand *)command {
    @try {
        if (![command.arguments objectAtIndex:0]) return;

        NSString *value = [command.arguments objectAtIndex:0];
        NSURL *url = [NSURL URLWithString:value];

        if (url == nil) {
            return;
        }

        [Insider handleUrl:url];
        [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
    } @catch (NSException *exception) {
        [Insider sendError:exception desc:@"Insider.m - handleURL"];
    }
}

- (void)itemAddedToWishlist:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            if (![command.arguments objectAtIndex:0] || ![command.arguments objectAtIndex:1] || ![command.arguments objectAtIndex:2]) {
                [self sendErrorResultWithString:@"Required fields, optional fields and custom product parameters are required" andCommand:command];
                return;
            };
            
            NSDictionary *requiredFields = [command.arguments objectAtIndex:0];
            NSDictionary *optionalFields = [command.arguments objectAtIndex:1];
            NSArray *customParameters = [command.arguments objectAtIndex:2];
            InsiderProduct *product = [CDVUtils parseProductFromRequiredFields:requiredFields andOptionalFields:optionalFields andCustomParameters:customParameters];
            NSDictionary *mappedCustomParameters = [CDVUtils parseCustomParameters:[command.arguments objectAtIndex:3]];
            
            if (mappedCustomParameters.count > 0) {
                [Insider itemAddedToWishlistWithProduct:product customParameters:mappedCustomParameters];
            } else {
                [Insider itemAddedToWishlistWithProduct:product];
            }
            
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
    }
}

- (void)itemRemovedFromWishlist:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            if (![command.arguments objectAtIndex:0]) {
                [self sendErrorResultWithString:@"Product ID is required" andCommand:command];
                return;
            };
            
            NSDictionary *mappedCustomParameters = [CDVUtils parseCustomParameters:[command.arguments objectAtIndex:1]];
            
            if (mappedCustomParameters.count > 0) {
                [Insider itemRemovedFromWishlistWithProductID:[command.arguments objectAtIndex:0] customParameters:mappedCustomParameters];
            } else {
                [Insider itemRemovedFromWishlistWithProductID:[command.arguments objectAtIndex:0]];
            }
            
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
    }
}

- (void)wishlistCleared:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            NSDictionary *mappedCustomParameters = [CDVUtils parseCustomParameters:[command.arguments objectAtIndex:0]];
            
            if (mappedCustomParameters.count > 0) {
                [Insider wishlistClearedWithCustomParameters:mappedCustomParameters];
            } else {
                [Insider wishlistCleared];
            }
            
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
    }
}

- (void)visitWishlistPage:(CDVInvokedUrlCommand *)command {
    @try {
        [self.commandDelegate runInBackground:^{
            if (![command.arguments objectAtIndex:0]) {
                [self sendErrorResultWithString:@"Products array is required" andCommand:command];
                return;
            };
            
            NSArray *productsArray = [command.arguments objectAtIndex:0];
            NSMutableArray *insiderProducts = [NSMutableArray array];
            
            for (NSDictionary *productDict in productsArray) {
                if (![productDict isKindOfClass:[NSDictionary class]]) continue;
                NSDictionary *requiredFields = [productDict objectForKey:@"requiredFields"];
                NSDictionary *optionalFields = [productDict objectForKey:@"optionalFields"];
                NSArray *customParameters = [productDict objectForKey:@"customParameters"];
                
                if (requiredFields) {
                    InsiderProduct *product = [CDVUtils parseProductFromRequiredFields:requiredFields andOptionalFields:optionalFields andCustomParameters:customParameters];
                    if (product) {
                        [insiderProducts addObject:product];
                    }
                }
            }
            
            NSDictionary *mappedCustomParameters = [CDVUtils parseCustomParameters:[command.arguments objectAtIndex:1]];
            
            if (mappedCustomParameters.count > 0) {
                [Insider visitWishlistWithProducts:insiderProducts customParameters:mappedCustomParameters];
            } else {
                [Insider visitWishlistWithProducts:insiderProducts];
            }
            
            [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        [self sendErrorResultWithString:[NSString stringWithFormat:@"Exception: %@", e.reason] andCommand:command];
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

- (void)addEventObserver:(CDVInvokedUrlCommand *)command {
    // Declared outside the @try so the @catch below can still reach it to tear down a
    // half-built registration.
    InsiderEventObserver *observer = nil;

    @try {
        [eventObserverLock lock];
        @try {
            eventObserverCallbackId = command.callbackId;

            if (eventObserver == nil) {
                observer = [[InsiderEventObserver alloc] init];
                observer.plugin = self;

                // Strong ivar retain: the SDK's own reference is weak, so this is what keeps
                // the observer alive. Assign BEFORE registering so the SDK never sees a
                // deallocated object.
                eventObserver = observer;
            }
        } @finally {
            [eventObserverLock unlock];
        }

        // Already registered - only the callbackId needed refreshing.
        if (observer == nil) {
            return;
        }

        NSString *registrationCallbackId = command.callbackId;

        dispatch_async(eventQueue, ^{
            @try {
                [[Insider events] addObserver:observer];
            } @catch (NSException *e) {
                [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];

                [self failEventObserverRegistrationForObserver:observer callbackId:registrationCallbackId reason:e];
            }
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];

        [self failEventObserverRegistrationForObserver:observer callbackId:command.callbackId reason:e];
    }
}

/**
 * Reports a failed native observer registration to JS AND tears the half-built registration
 * back down.
 *
 * Both halves matter. Without the error result JS never learns the stream is dead: its retry
 * state machine only clears isNativeObserverRegistered in its onError handler, so a failed
 * registration would leave JS pointed at a stream that can never deliver. Without the local
 * teardown the eventObserver ivar would stay non-nil and the retried addEventObserver: would
 * take the "already registered" early return and never call addObserver again.
 *
 * The error result deliberately does NOT set keepCallback. Cordova drops the callback entry on
 * a non-keepCallback result, which is exactly right: the JS retry issues a fresh cordova.exec
 * with a NEW callbackId, so keeping the dead one alive would only leak it. A later successful
 * registration is unaffected because it is a different callbackId end to end.
 */
- (void)failEventObserverRegistrationForObserver:(InsiderEventObserver *)failedObserver
                                      callbackId:(NSString *)callbackId
                                          reason:(NSException *)reason {
    @try {
        if (failedObserver == nil) {
            return;
        }

        [eventObserverLock lock];
        @try {
            // Only tear down if this failure belongs to the CURRENT registration. A remove
            // followed by a fresh add could otherwise let a late failure from the old attempt
            // wipe out a newer, healthy observer.
            if (eventObserver == failedObserver) {
                eventObserver = nil;
                eventObserverCallbackId = nil;
            }
        } @finally {
            [eventObserverLock unlock];
        }

        if (callbackId != nil) {
            CDVPluginResult *pluginResult =
                [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                  messageAsString:[NSString stringWithFormat:@"[InsiderCordova] addEventObserver failed: %@", reason.reason]];

            [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
        }
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void)removeEventObserver:(CDVInvokedUrlCommand *)command {
    @try {
        InsiderEventObserver *observerToRemove = nil;

        [eventObserverLock lock];
        @try {
            observerToRemove = eventObserver;

            eventObserver = nil;
            eventObserverCallbackId = nil;
        } @finally {
            [eventObserverLock unlock];
        }

        if (observerToRemove != nil) {
            // Same serial queue as addObserver, so a rapid remove-then-add re-subscribe can
            // never invert and leave the SDK with no observer while JS believes one is live.
            dispatch_async(eventQueue, ^{
                @try {
                    [[Insider events] removeObserver:observerToRemove];
                } @catch (NSException *e) {
                    [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
                }
            });
        }

        [self sendSuccessResultWithString:@"SUCCESS" andCommand:command];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

/**
 * Invoked by InsiderEventObserver on the SDK's own background thread.
 * The payload is built structurally (never string-interpolated) and pushed through the
 * stored callbackId with keepCallback set so the JS handler survives for later events.
 *
 * The send itself is marshalled onto the plugin's serial eventQueue so results never leave the
 * SDK's listener thread and stay in recorded order. See the eventQueue declaration for why the
 * queue must be serial rather than commandDelegate runInBackground.
 */
- (void)handleRecordedEvent:(NSString *)name parameters:(NSDictionary<NSString *, id> *)parameters timestamp:(NSTimeInterval)timestamp {
    @try {
        // Read the callbackId under the lock - it is written on the Cordova thread while this
        // runs on the SDK's listener thread. The lock is released before sending.
        NSString *callbackId = nil;

        [eventObserverLock lock];
        @try {
            callbackId = eventObserverCallbackId;
        } @finally {
            [eventObserverLock unlock];
        }

        if (callbackId == nil || name == nil) {
            return;
        }

        NSDictionary *event = @{
            @"name": name,
            // Sanitised: NSDate and other non-JSON values would make NSJSONSerialization fail
            // and drop the WHOLE event. See sanitizeEventParameters:.
            @"parameters": [CDVUtils sanitizeEventParameters:parameters],
            // Whole seconds since 1970, passed through unchanged for parity with the native SDKs.
            @"timestamp": @((long long)timestamp)
        };

        // The payload is built ABOVE on the SDK's listener thread on purpose - the parameters
        // dictionary is only guaranteed to be valid for the duration of this callback - and only
        // the send is handed to the serial queue. dispatch_async (never _sync) and no lock held
        // here, so the SDK thread is not blocked and no deadlock is possible.
        dispatch_async(eventQueue, ^{
            @try {
                [self sendKeepCallbackResultWithDictionary:event andCallbackId:callbackId];
            } @catch (NSException *e) {
                [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
            }
        });
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

- (void) sendKeepCallbackResultWithDictionary:(NSDictionary *)resultMessage andCallbackId:(NSString *)callbackId {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:resultMessage];
    [pluginResult setKeepCallback:@YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
}

- (void) sendErrorResultWithString:(NSString *)resultMessage andCommand:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:resultMessage];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) sendErrorResultWithDictionary:(NSDictionary *)resultMessage andCommand:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:resultMessage];
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

- (void) sendSuccessResultWithBool:(BOOL)resultMessage andCommand:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:resultMessage];
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

- (InsiderIdentifiers *)buildInsiderIdentifiersFromMap:(NSDictionary *)identifiersMap {
    InsiderIdentifiers *identifiers = [[InsiderIdentifiers alloc] init];
    for (NSString *key in identifiersMap.allKeys) {
        // The SDK identifier setters take NSString only and crash on anything else.
        if (![key isKindOfClass:[NSString class]] || ![[identifiersMap objectForKey:key] isKindOfClass:[NSString class]]) continue;

        if ([key isEqualToString:@"addEmail"]) {
            identifiers.addEmail([identifiersMap objectForKey:key]);
        } else if ([key isEqualToString:@"addPhoneNumber"]) {
            identifiers.addPhoneNumber([identifiersMap objectForKey:key]);
        } else if ([key isEqualToString:@"addUserID"]) {
            identifiers.addUserID([identifiersMap objectForKey:key]);
        } else {
            identifiers.addCustomIdentifier(key, [identifiersMap objectForKey:key]);
        }
    }
    return identifiers;
}

- (NSArray<InsiderIdentifiers *> *)convertArrayToInsiderIdentifiersArray:(NSArray *)identifiersArray {
    if (![identifiersArray isKindOfClass:[NSArray class]] || identifiersArray.count == 0) {
        return nil;
    }
    
    NSMutableArray<InsiderIdentifiers *> *identifiers = [NSMutableArray array];
    for (id identifierDict in identifiersArray) {
        if (![identifierDict isKindOfClass:[NSDictionary class]]) continue;

        [identifiers addObject:[self buildInsiderIdentifiersFromMap:identifierDict]];
    }
    return identifiers;
}

@end
