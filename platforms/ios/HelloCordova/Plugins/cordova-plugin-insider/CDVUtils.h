#import <Foundation/Foundation.h>
#import <InsiderMobile/Insider.h>
#import <InsiderHybrid/InsiderHybrid.h>

@interface CDVUtils : NSObject

+ (InsiderEvent *)parseEventFromEventName:(NSString *)eventName andParameters:(NSArray *)parameters;

+ (InsiderProduct *)parseProductFromRequiredFields:(NSDictionary *)requiredFields 
                                 andOptionalFields:(NSDictionary *)optionalFields 
                               andCustomParameters:(NSArray *)customParameters;

@end

