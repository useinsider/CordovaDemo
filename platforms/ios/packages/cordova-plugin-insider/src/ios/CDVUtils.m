#import "CDVUtils.h"

@implementation CDVUtils

+ (InsiderEvent *)parseEventFromEventName:(NSString *)eventName
                            andParameters:(NSArray *)parameters {

    InsiderEvent *event = [Insider tagEvent:eventName];

    if (![parameters isKindOfClass:[NSArray class]]) {
        return event;
    }

    for (id item in parameters) {
        if (![item isKindOfClass:[NSDictionary class]]) continue;

        NSDictionary *parameter = (NSDictionary *)item;

        NSString *type = parameter[@"type"];
        NSString *key  = parameter[@"key"];
        if (![type isKindOfClass:[NSString class]] || ![key isKindOfClass:[NSString class]]) continue;

        id value = parameter[@"value"];

        if ([type isEqualToString:@"string"] && [value isKindOfClass:[NSString class]]) {
            NSString *stringValue = value;
            event.addParameterWithString(key, stringValue);
        }
        else if ([type isEqualToString:@"integer"] && [value isKindOfClass:[NSNumber class]]) {
            NSNumber *numberValue = value;

            // addParameterWithInt takes an int; the cast below would wrap a larger value silently.
            if ([self isOutOfIntRange:numberValue]) {
                [self reportRefusedValueWithReason:@"addParameterWithInt: value is outside the int range"
                                              desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
                continue;
            }

            int integerValue = (int)(numberValue != nil ? numberValue.integerValue : 0);
            event.addParameterWithInt(key, integerValue);
        }
        else if ([type isEqualToString:@"double"] && [value isKindOfClass:[NSNumber class]]) {
            NSNumber *numberValue = value;
            double doubleValue = (numberValue != nil ? numberValue.doubleValue : 0.0);
            event.addParameterWithDouble(key, doubleValue);
        }
        else if ([type isEqualToString:@"boolean"] && [value isKindOfClass:[NSNumber class]]) {
            NSNumber *numberValue = value;
            BOOL booleanValue = (numberValue != nil ? numberValue.boolValue : NO);
            event.addParameterWithBoolean(key, booleanValue);
        }
        else if ([type isEqualToString:@"date"] && [value isKindOfClass:[NSString class]]) {
            long long epochMillis = [(NSString *)value longLongValue];
            NSTimeInterval seconds = ((NSTimeInterval)epochMillis) / 1000.0;
            NSDate *dateValue = [NSDate dateWithTimeIntervalSince1970:seconds];
            event.addParameterWithDate(key, dateValue);
        }
        else if ([type isEqualToString:@"strings"] && [value isKindOfClass:[NSArray class]]) {
            NSArray * stringsValue = value;
            event.addParameterWithStringArray(key, stringsValue);
        }
        else if ([type isEqualToString:@"numbers"] && [value isKindOfClass:[NSArray class]]) {
            NSArray * numbersValue = value;
            event.addParameterWithNumericArray(key, numbersValue);
        }
        else if ([type isEqualToString:@"objects"]) {
            // A malformed value decodes to an empty list. A list with nothing to insert is
            // skipped for this parameter alone, as the JS layer and Android do.
            NSArray<NSDictionary<NSString *, id> *> *eventObjects = [self parseCustomParametersList:value];
            if (eventObjects.count == 0) {
                [self reportRefusedValueWithReason:@"addParameterWithObjectArray: nothing to insert"
                                              desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
                continue;
            }

            event.addParameterWithObjectArray(key, eventObjects);
        }
    }

    return event;
}

+ (nonnull InsiderProduct *)parseProductFromRequiredFields:(nonnull NSDictionary *)requiredFields
                                         andOptionalFields:(nullable NSDictionary *)optionalFields
                                       andCustomParameters:(nullable NSArray *)customParameters {

    /// Apply required fields
    NSString *productId = requiredFields[@"product_id"];
    NSString *name = requiredFields[@"name"];
    NSArray *taxonomy = requiredFields[@"taxonomy"];
    NSString *imageURL = requiredFields[@"image_url"];
    NSNumber *priceNumber = requiredFields[@"unit_price"];
    double price = [priceNumber isKindOfClass:[NSNumber class]] ? priceNumber.doubleValue : 0.0;
    NSString *currency = requiredFields[@"currency"];

    InsiderProduct *product = [Insider createNewProductWithID:productId name:name taxonomy:taxonomy imageURL:imageURL price:price currency:currency];

    /// Apply optional fields
    for (NSString *key in optionalFields) {
        id value = optionalFields[key];

        if ([key isEqualToString:@"color"]) {
            NSString *color = (NSString *)value;
            product.setColor(color);
        }
        else if ([key isEqualToString:@"voucher_name"]) {
            NSString *voucherName = (NSString *)value;
            product.setVoucherName(voucherName);
        }
        else if ([key isEqualToString:@"promotion_name"]) {
            NSString *promotionName = (NSString *)value;
            product.setPromotionName(promotionName);
        }
        else if ([key isEqualToString:@"size"]) {
            NSString *size = (NSString *)value;
            product.setSize(size);
        }
        else if ([key isEqualToString:@"sale_price"]) {
            NSNumber *salePriceNumber = (NSNumber *)value;
            double salePrice = salePriceNumber.doubleValue;
            product.setSalePrice(salePrice);
        }
        else if ([key isEqualToString:@"shipping_cost"]) {
            NSNumber *shippingCostNumber = (NSNumber *)value;
            double shippingCost = shippingCostNumber.doubleValue;
            product.setShippingCost(shippingCost);
        }
        else if ([key isEqualToString:@"voucher_discount"]) {
            NSNumber *voucherDiscountNumber = (NSNumber *)value;
            double voucherDiscount = voucherDiscountNumber.doubleValue;
            product.setVoucherDiscount(voucherDiscount);
        }
        else if ([key isEqualToString:@"promotion_discount"]) {
            NSNumber *promotionDiscountNumber = (NSNumber *)value;
            double promotionDiscount = promotionDiscountNumber.doubleValue;
            product.setPromotionDiscount(promotionDiscount);
        }
        else if ([key isEqualToString:@"stock"]) {
            NSNumber *stockNumber = (NSNumber *)value;
            int stock = stockNumber.intValue;
            product.setStock(stock);
        }
        else if ([key isEqualToString:@"quantity"]) {
            NSNumber *quantityNumber = (NSNumber *)value;
            int quantity = quantityNumber.intValue;
            product.setQuantity(quantity);
        }
        else if ([key isEqualToString:@"groupcode"]) {
            NSString *groupCode = (NSString *)value;
            product.setGroupCode(groupCode);
        }
        else if ([key isEqualToString:@"brnd"]) {
            NSString *brand = (NSString *)value;
            product.setBrand(brand);
        }
        else if ([key isEqualToString:@"sku"]) {
            NSString *sku = (NSString *)value;
            product.setSku(sku);
        }
        else if ([key isEqualToString:@"ge"]) {
            NSString *gender = (NSString *)value;
            product.setGender(gender);
        }
        else if ([key isEqualToString:@"mlt"]) {
            NSString *multipack = (NSString *)value;
            product.setMultipack(multipack);
        }
        else if ([key isEqualToString:@"pt"]) {
            NSString *productType = (NSString *)value;
            product.setProductType(productType);
        }
        else if ([key isEqualToString:@"gt"]) {
            NSString *gtin = (NSString *)value;
            product.setGtin(gtin);
        }
        else if ([key isEqualToString:@"desc"]) {
            NSString *desc = (NSString *)value;
            product.setDescription(desc);
        }
        else if ([key isEqualToString:@"tags"]) {
            NSArray *tagsArray = (NSArray *)value;
            product.setTags(tagsArray);
        }
        else if ([key isEqualToString:@"iis"]) {
            NSNumber *inStockNumber = (NSNumber *)value;
            BOOL inStock = inStockNumber.boolValue;
            product.setInStock(inStock);
        }
        else if ([key isEqualToString:@"product_url"]) {
            NSString *productURL = (NSString *)value;
            product.setProductURL(productURL);
        }
    }

    /// Apply custom parameters
    for (id item in customParameters) {
        if (![item isKindOfClass:[NSDictionary class]]) continue;

        NSDictionary *parameter = (NSDictionary *)item;

        NSString *type = parameter[@"type"];
        NSString *key  = parameter[@"key"];
        if (![type isKindOfClass:[NSString class]] || ![key isKindOfClass:[NSString class]]) continue;

        id value = parameter[@"value"];

        if ([type isEqualToString:@"string"] && [value isKindOfClass:[NSString class]]) {
            NSString *stringValue = (NSString *)value;
            product.setCustomAttributeWithString(key, stringValue);
        }
        else if ([type isEqualToString:@"integer"] && [value isKindOfClass:[NSNumber class]]) {
            NSNumber *numberValue = (NSNumber *)value;

            // setCustomAttributeWithInt takes an int; the cast below would wrap a larger value silently.
            if ([self isOutOfIntRange:numberValue]) {
                [self reportRefusedValueWithReason:@"setCustomAttributeWithInt: value is outside the int range"
                                              desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
                continue;
            }

            int intValue = (int)numberValue.integerValue;
            product.setCustomAttributeWithInt(key, intValue);
        }
        else if ([type isEqualToString:@"double"] && [value isKindOfClass:[NSNumber class]]) {
            NSNumber *numberValue = (NSNumber *)value;
            double doubleValue = numberValue.doubleValue;
            product.setCustomAttributeWithDouble(key, doubleValue);
        }
        else if ([type isEqualToString:@"boolean"] && [value isKindOfClass:[NSNumber class]]) {
            NSNumber *numberValue = (NSNumber *)value;
            BOOL booleanValue = numberValue.boolValue;
            product.setCustomAttributeWithBoolean(key, booleanValue);
        }
        else if ([type isEqualToString:@"date"] && [value isKindOfClass:[NSString class]]) {
            // Epoch millis passed as string from RN
            NSString *epochString = (NSString *)value;
            long long epochMillis = epochString.longLongValue;
            NSTimeInterval seconds = ((NSTimeInterval)epochMillis) / 1000.0;
            NSDate *dateValue = [NSDate dateWithTimeIntervalSince1970:seconds];
            product.setCustomAttributeWithDate(key, dateValue);
        }
        else if ([type isEqualToString:@"strings"] && [value isKindOfClass:[NSArray class]]) {
            NSArray *stringsValue = (NSArray *)value;
            product.setCustomAttributeWithStringArray(key, stringsValue);
        }
        else if ([type isEqualToString:@"numbers"] && [value isKindOfClass:[NSArray class]]) {
            NSArray *numbersValue = (NSArray *)value;
            product.setCustomAttributeWithNumericArray(key, numbersValue);
        }
    }

    return product;
}

+ (nonnull NSDictionary<NSString *, id> *)parseCustomParameters:(nonnull NSArray *)customParameters {
    NSMutableDictionary<NSString *, id> *mappedCustomParameters = [NSMutableDictionary dictionary];

    for (id item in customParameters) {
        if (![item isKindOfClass:[NSDictionary class]]) continue;

        NSDictionary *parameter = (NSDictionary *)item;
        NSString *type = parameter[@"type"];
        NSString *key  = parameter[@"key"];

        if (![type isKindOfClass:[NSString class]] || ![key isKindOfClass:[NSString class]]) continue;

        id value = parameter[@"value"];

        if ([type isEqualToString:@"string"] && [value isKindOfClass:[NSString class]]) {
            NSString *stringValue = (NSString *)value;
            mappedCustomParameters[key] = stringValue;
        }
        else if (([type isEqualToString:@"integer"] || [type isEqualToString:@"double"] || [type isEqualToString:@"boolean"]) && [value isKindOfClass:[NSNumber class]]) {
            NSNumber *numberValue = (NSNumber *)value;
            mappedCustomParameters[key] = numberValue;
        }
        else if ([type isEqualToString:@"date"] && [value isKindOfClass:[NSNumber class]]) {
            NSNumber *numberValue = (NSNumber *)value;
            long long epochMillis = numberValue.longLongValue;
            NSTimeInterval seconds = ((NSTimeInterval)epochMillis) / 1000.0;
            NSDate *dateValue = [NSDate dateWithTimeIntervalSince1970:seconds];
            mappedCustomParameters[key] = dateValue;
        }
        else if (([type isEqualToString:@"numeric_array"] || [type isEqualToString:@"string_array"]) && [value isKindOfClass:[NSArray class]]) {
            NSArray *arrayValue = (NSArray *)value;
            mappedCustomParameters[key] = arrayValue;
        }
        else if ([type isEqualToString:@"object"] && [value isKindOfClass:[NSArray class]]) {
            mappedCustomParameters[key] = [self parseCustomParameters:(NSArray *)value];
        }
    }

    return mappedCustomParameters;
}

// True when the match decodes with no lost entry at every nesting level. The count check also
// catches an unrecognized `type`, which parseCustomParameters: skips. A widened match would
// rewrite or delete untargeted objects, so callers fail closed even without the JS check.
+ (BOOL)isLosslessMatch:(nullable NSArray *)matchParameters {
    if (![matchParameters isKindOfClass:[NSArray class]]) {
        return NO;
    }

    NSDictionary *decoded = [self parseCustomParameters:matchParameters];
    if (decoded.count != matchParameters.count) {
        return NO;
    }

    for (id item in matchParameters) {
        if (![item isKindOfClass:[NSDictionary class]]) {
            return NO;
        }

        NSDictionary *parameter = (NSDictionary *)item;
        NSString *type = [parameter[@"type"] isKindOfClass:[NSString class]] ? parameter[@"type"] : nil;

        if ([type isEqualToString:@"object"]) {
            id nested = parameter[@"value"];
            if (![nested isKindOfClass:[NSArray class]] || ![self isLosslessMatch:(NSArray *)nested]) {
                return NO;
            }
        }
    }

    return YES;
}

+ (nonnull NSArray<NSDictionary<NSString *, id> *> *)parseCustomParametersList:(nullable NSArray *)list {
    NSMutableArray<NSDictionary<NSString *, id> *> *objects = [NSMutableArray array];

    if (![list isKindOfClass:[NSArray class]]) {
        return objects;
    }

    for (id item in list) {
        if (![item isKindOfClass:[NSArray class]]) continue;

        // An object that decodes to nothing would be written as an empty object.
        NSDictionary<NSString *, id> *object = [self parseCustomParameters:(NSArray *)item];
        if (object.count == 0) continue;

        [objects addObject:object];
    }

    return objects;
}

// doubleValue, not longLongValue: converting a double beyond the long long range is undefined.
+ (BOOL)isOutOfIntRange:(nullable NSNumber *)number {
    if (![number isKindOfClass:[NSNumber class]]) {
        return NO;
    }

    double value = number.doubleValue;
    return value < INT_MIN || value > INT_MAX;
}

// A refused value is reported to the native SDK instead of being dropped silently.
+ (void)reportRefusedValueWithReason:(NSString *)reason desc:(NSString *)desc {
    [Insider sendError:[NSException exceptionWithName:NSInvalidArgumentException reason:reason userInfo:nil] desc:desc];
}

+ (NSDictionary *)dictionaryFromJSONString:(NSString *)jsonString {
    if (!jsonString || jsonString.length == 0) {
        return nil;
    }
    
    NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    
    if (!jsonData) {
        return nil;
    }
    
    NSError *parseError = nil;
    NSDictionary *dictionary = [NSJSONSerialization JSONObjectWithData:jsonData 
                                                                options:NSJSONReadingMutableContainers 
                                                                  error:&parseError];
    
    if (parseError || ![dictionary isKindOfClass:[NSDictionary class]]) {
        return nil;
    }
    
    return dictionary;
}

+ (NSString *)mapAppCardsErrorCode:(NSError *)error {
    if ([error.domain isEqualToString:InsiderAppCardsErrorDomain]) {
        switch (error.code) {
            case InsiderAppCardsErrorCodeSdkNotInitialized: return @"sdkNotInitialized";
            case InsiderAppCardsErrorCodeInvalidParameter: return @"invalidParameter";
            case InsiderAppCardsErrorCodeNetworkError: return @"networkError";
            case InsiderAppCardsErrorCodeServerError: return @"serverError";
            case InsiderAppCardsErrorCodeParseError: return @"parseError";
            default: return @"unknown";
        }
    }
    return @"unknown";
}

+ (NSDictionary *)appCardsErrorToDictionary:(NSError *)error {
    NSString *code = [self mapAppCardsErrorCode:error];
    NSString *message = error.localizedDescription ?: @"An unexpected error occurred.";
    return @{@"code": code, @"message": message};
}

/**
 * Makes an SDK event-parameter dictionary safe to hand to CDVPluginResult.
 *
 * CDVPluginResult serialises via NSJSONSerialization, which accepts ONLY NSString, NSNumber,
 * NSNull, NSArray and NSDictionary. An NSDate parameter value - which the SDK does deliver -
 * is not a valid JSON object, so serialisation of the WHOLE event fails and the event is lost
 * silently. Values are therefore converted rather than passed through.
 *
 * NSDate becomes epoch MILLISECONDS, matching CDVUtils.java convertValueToJSON (Date ->
 * getTime()) and the repo-wide "dates cross the bridge as epoch-ms" convention. Note this is
 * deliberately NOT the unit of the top-level event.timestamp, which stays in whole SECONDS for
 * parity with the native SDKs.
 *
 * Anything still unrepresentable falls back to its description string so one odd value degrades
 * a single parameter instead of dropping the entire event.
 */
+ (NSDictionary<NSString *, id> *)sanitizeEventParameters:(NSDictionary<NSString *, id> *)parameters {
    if (parameters == nil) {
        return @{};
    }

    NSMutableDictionary<NSString *, id> *sanitized = [NSMutableDictionary dictionaryWithCapacity:parameters.count];

    [parameters enumerateKeysAndObjectsUsingBlock:^(NSString *key, id value, BOOL *stop) {
        if (![key isKindOfClass:[NSString class]]) {
            return;
        }

        sanitized[key] = [self sanitizeEventParameterValue:value];
    }];

    return sanitized;
}

+ (id)sanitizeEventParameterValue:(id)value {
    if (value == nil || [value isKindOfClass:[NSNull class]]) {
        return [NSNull null];
    }

    if ([value isKindOfClass:[NSDate class]]) {
        // Epoch milliseconds - same representation as the Android bridge.
        return @((long long)([(NSDate *)value timeIntervalSince1970] * 1000.0));
    }

    if ([value isKindOfClass:[NSString class]]) {
        return value;
    }

    if ([value isKindOfClass:[NSNumber class]]) {
        double doubleValue = [(NSNumber *)value doubleValue];

        // NSJSONSerialization rejects NaN / infinity; represent them as null instead of failing.
        if (isnan(doubleValue) || isinf(doubleValue)) {
            return [NSNull null];
        }

        return value;
    }

    if ([value isKindOfClass:[NSDictionary class]]) {
        return [self sanitizeEventParameters:(NSDictionary *)value];
    }

    if ([value isKindOfClass:[NSArray class]]) {
        NSMutableArray *sanitized = [NSMutableArray arrayWithCapacity:((NSArray *)value).count];

        for (id element in (NSArray *)value) {
            [sanitized addObject:[self sanitizeEventParameterValue:element]];
        }

        return sanitized;
    }

    return [value description];
}

+ (InsiderGender)genderFromInt:(int)gender {
    switch (gender) {
        case 0:
            return InsiderGenderMale;
        case 1:
            return InsiderGenderFemale;
        default:
            return InsiderGenderOther;
    }
}

+ (void)setGender:(int)gender {
    @try {
        [Insider getCurrentUser].setGender([self genderFromInt:gender]);
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

+ (NSString *)dictToJson:(NSDictionary *)dict {
    @try {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dict options:NSJSONWritingPrettyPrinted error:nil];
        if (!jsonData) {
            return @"{}";
        }
        return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
        return @"{}";
    }
}

+ (void)getMessageCenterDataWithLimit:(NSInteger)limit
                       startDateEpoch:(NSInteger)startDateEpoch
                         endDateEpoch:(NSInteger)endDateEpoch
                              success:(void (^)(NSArray *))completionBlock {
    @try {
        NSDate *startDate = [NSDate dateWithTimeIntervalSince1970:startDateEpoch / 1000.0];
        NSDate *endDate = [NSDate dateWithTimeIntervalSince1970:endDateEpoch / 1000.0];

        [Insider getMessageCenterDataWithLimit:limit startDate:startDate endDate:endDate success:^(NSArray *messageCenterData) {
            completionBlock(@[@{@"data": messageCenterData ?: @[]}]);
        }];
    } @catch (NSException *e) {
        [Insider sendError:e desc:[NSString stringWithFormat:@"%s:%d", __func__, __LINE__]];
    }
}

@end

