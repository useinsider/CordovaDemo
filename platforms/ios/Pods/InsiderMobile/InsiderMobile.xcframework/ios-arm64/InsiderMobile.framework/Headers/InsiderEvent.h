//
//  InsiderEvent.h
//  InsiderShop
//
//  Created by Insider on 20.06.2019.
//  Copyright © 2019 Insider. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface InsiderEvent : NSObject <NSCopying>

- (instancetype)initWithName:(NSString *)name;
- (instancetype)initInternalWithName:(NSString *)name;

/**
 Adds a string type parameter to the `InsiderEvent` object.

 @return A block that takes:
   - key: The key for the parameter.
   - value: The string value to associate with the key.

 @warning Keys must be lowercase and must not contain special or non-Latin characters.
          Otherwise, the entire event may be ignored. Check our documentation for more details.
 */
- (InsiderEvent * (^)(NSString *key, NSString *value))addParameterWithString;

/**
 Adds an integer type parameter to the `InsiderEvent` object.

 @return A block that takes:
   - key: The key for the parameter.
   - value: The integer value to associate with the key.

 @warning Keys must be lowercase and must not contain special or non-Latin characters.
          Otherwise, the entire event may be ignored. Check our documentation for more details.
 */
- (InsiderEvent * (^)(NSString *key, NSInteger value))addParameterWithInt;

/**
 Adds a double type parameter to the `InsiderEvent` object.

 @return A block that takes:
   - key: The key for the parameter.
   - value: The double value to associate with the key.

 @warning Keys must be lowercase and must not contain special or non-Latin characters.
          Otherwise, the entire event may be ignored. Check our documentation for more details.
 */
- (InsiderEvent * (^)(NSString *key, double value))addParameterWithDouble;

/**
 Adds a boolean type parameter to the `InsiderEvent` object.

 @return A block that takes:
   - key: The key for the parameter.
   - value: The boolean value to associate with the key.

 @warning Keys must be lowercase and must not contain special or non-Latin characters.
          Otherwise, the entire event may be ignored. Check our documentation for more details.
 */
- (InsiderEvent * (^)(NSString *key, BOOL value))addParameterWithBoolean;

/**
 Adds a date type parameter to the `InsiderEvent` object.

 @return A block that takes:
   - key: The key for the parameter.
   - value: The date object to associate with the key.

 @warning Keys must be lowercase and must not contain special or non-Latin characters.
          Otherwise, the entire event may be ignored. Check our documentation for more details.
 */
- (InsiderEvent * (^)(NSString *key, NSDate *value))addParameterWithDate;

/**
 Adds an array parameter to the `InsiderEvent` object.

 @discussion This method is now deprecated.
             Use `addParameterWithStringArray` which behaves exactly like this one.

 @warning Keys must be lowercase and must not contain special or non-Latin characters.
          Otherwise, the entire event may be ignored. Check our documentation for more details.
 */
- (InsiderEvent * (^)(NSString *key, NSArray *value))addParameterWithArray __attribute__((deprecated("Use 'addParameterWithStringArray' instead.")));

/**
 Adds a string array parameter to the `InsiderEvent` object.

 @return A block that takes:
   - key: The key for the parameter.
   - value: The array object to associate with the key (all elements must be valid strings, all non-string elements will be ignored).

 @warning Keys must be lowercase and must not contain special or non-Latin characters.
          Otherwise, the entire event may be ignored. Check our documentation for more details.
 */
- (InsiderEvent * (^)(NSString *key, NSArray<NSString *> *value))addParameterWithStringArray;

/**
 Adds a numeric array parameter to the `InsiderEvent` object.

 @return A block that takes:
   - key: The key for the parameter.
   - value: The array object to associate with the key (all elements must be valid numbers, all non-number elements will be ignored).

 @warning Keys must be lowercase and must not contain special or non-Latin characters.
          Otherwise, the entire event may be ignored. Check our documentation for more details.
 */
- (InsiderEvent * (^)(NSString *key, NSArray<NSNumber *> *value))addParameterWithNumericArray;

/**
 Adds multiple parameters to the `InsiderEvent` object at once.

 @return A block that takes a dictionary of parameters to add.
         The dictionary keys must be lowercase and contain only Latin characters.
         Values can be strings, numbers, or booleans.

 @warning Keys must be lowercase and must not contain special or non-Latin characters.
          Otherwise, the entire event may be ignored. Check our documentation for more details.
 */
- (InsiderEvent * (^)(NSDictionary<NSString *, id> *parameters))addParameters;

/**
 Builds and sends the event. This is the way of saying to InsiderSDK that this event is actually triggered.
 @discussion You must call this method after setting all parameters. otherwise the event will not be triggered.
 */
- (void)build;

/**
 Gets the name of the event.
 @return The event name.
 */
- (NSString *)getName;

/**
 Gets all parameters of the `InsiderEvent` object.
 @return The parameters dictionary.
 @discussion Deprecated. Use `dictionaryValue` property instead.
 */
- (NSDictionary<NSString *, id> *)getParameters;

@end

NS_ASSUME_NONNULL_END
