#import <Foundation/Foundation.h>
#import <InsiderMobile/Insider.h>
#import <InsiderMobile/InsiderAppCardsError.h>
#import <InsiderHybrid/InsiderHybrid.h>

@interface CDVUtils : NSObject

+ (InsiderEvent *)parseEventFromEventName:(NSString *)eventName andParameters:(NSArray *)parameters;

+ (InsiderProduct *)parseProductFromRequiredFields:(NSDictionary *)requiredFields
                                 andOptionalFields:(NSDictionary *)optionalFields
                               andCustomParameters:(NSArray *)customParameters;

+ (NSDictionary<NSString *, id> *)parseCustomParameters:(NSArray *)customParameters;
+ (NSDictionary *)dictionaryFromJSONString:(NSString *)jsonString;

+ (NSString *)mapAppCardsErrorCode:(NSError *)error;
+ (NSDictionary *)appCardsErrorToDictionary:(NSError *)error;

@end

