//
//  InsiderHybrid.h
//  InsiderHybrid
//
//  Created by Insider on 17.12.2019.
//  Copyright © 2019 Insider. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface InsiderHybrid : NSObject
// Insider User
+(void)setGender:(int)value;
+(void)setBirthday:(NSString *)value;
+(void)setCustomAttributeWithDate:(NSString *)key value:(NSString *)value;

// Insider Product
+(NSObject *)createProduct:(NSDictionary *)productMustMap productOptMap:(NSDictionary *)productOptMap;
+(void)visitCartPage:(NSArray *)products;
+(NSArray *)convertArrayToInsiderProductArray:(NSArray *)products;

// Other
+ (void)getMessageCenterDataWithLimit:(NSInteger)limit
                            startDate:(NSInteger)startDateEpoch
                              endDate:(NSInteger)endDateEpoch
                              success:(void (^)(NSArray *))completionBlock;

+(NSArray *)getContentStringWithName:(NSString *)name defaultString:(NSString *)defaultString dataType:(int)dataType;
+(NSArray *)getContentBoolWithName:(NSString *)name defaultBool:(bool)defaultBool dataType:(int)dataType;
+(NSArray *)getContentIntWithName:(NSString *)name defaultInt:(int)defaultInt dataType:(int)dataType;
+(NSArray *)getContentStringWithoutCache:(NSString *)name defaultString:(NSString *)defaultString dataType:(int)dataType;
+(NSArray *)getContentBoolWithoutCache:(NSString *)name defaultBool:(bool)defaultBool dataType:(int)dataType;
+(NSArray *)getContentIntWithoutCache:(NSString *)name defaultInt:(int)defaultInt dataType:(int)dataType;
+(void)handleNotification:(NSDictionary *)notification;
+(NSString *)dictToJson:(NSDictionary *)dict;
@end
