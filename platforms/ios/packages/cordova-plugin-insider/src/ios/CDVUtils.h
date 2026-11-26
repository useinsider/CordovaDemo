#import <Foundation/Foundation.h>
#import <InsiderMobile/Insider.h>
#import <InsiderMobile/InsiderAppCardsError.h>

@interface CDVUtils : NSObject

+ (InsiderEvent *)parseEventFromEventName:(NSString *)eventName andParameters:(NSArray *)parameters;

+ (InsiderProduct *)parseProductFromRequiredFields:(NSDictionary *)requiredFields
                                 andOptionalFields:(NSDictionary *)optionalFields
                               andCustomParameters:(NSArray *)customParameters;

+ (NSDictionary<NSString *, id> *)parseCustomParameters:(NSArray *)customParameters;
+ (NSArray<NSDictionary<NSString *, id> *> *)parseCustomParametersList:(NSArray *)list;
+ (BOOL)isLosslessMatch:(NSArray *)matchParameters;
+ (BOOL)isOutOfIntRange:(NSNumber *)number;
+ (void)reportRefusedValueWithReason:(NSString *)reason desc:(NSString *)desc;
+ (NSDictionary *)dictionaryFromJSONString:(NSString *)jsonString;

+ (NSString *)mapAppCardsErrorCode:(NSError *)error;
+ (NSDictionary *)appCardsErrorToDictionary:(NSError *)error;

+ (NSDictionary<NSString *, id> *)sanitizeEventParameters:(NSDictionary<NSString *, id> *)parameters;

+ (InsiderGender)genderFromInt:(int)gender;
+ (void)setGender:(int)gender;
+ (NSString *)dictToJson:(NSDictionary *)dict;
+ (void)getMessageCenterDataWithLimit:(NSInteger)limit
                       startDateEpoch:(NSInteger)startDateEpoch
                         endDateEpoch:(NSInteger)endDateEpoch
                              success:(void (^)(NSArray *))completionBlock;

@end

