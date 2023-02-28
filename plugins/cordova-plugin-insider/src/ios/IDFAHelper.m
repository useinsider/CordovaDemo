#import "IDFAHelper.h"
#import <AdSupport/ASIdentifierManager.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>

@implementation IDFAHelper

- (bool)requestPermission{
        if (@available(iOS 14, *)) {
            [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
                NSLog(@"[INSIDER]:[IDFA] requestPermission completed.");
            }];
            return true;
        } else {
            NSLog(@"[INSIDER]:[IDFA] requestPermission is supported only for iOS >= 14");
            return false;
        }
}

@end
