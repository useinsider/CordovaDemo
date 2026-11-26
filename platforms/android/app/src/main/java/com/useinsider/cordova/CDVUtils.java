package com.useinsider.cordova;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.useinsider.insider.Insider;
import com.useinsider.insider.InsiderGender;
import com.useinsider.insider.InsiderProduct;
import com.useinsider.insider.InsiderEvent;
import com.useinsider.insider.MessageCenterData;

import com.useinsider.insider.AppCardsException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

public class CDVUtils {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static Map<String, Object>  convertJSONToMap(String jsonString) {
        Map<String, Object> convertedData = null;

        try {
            convertedData = objectMapper.readValue(jsonString, HashMap.class);
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }

        return convertedData;
    }

    public static Map<String, String>  convertJSONToStringMap(String jsonString) {
        Map<String, String> convertedData = null;

        try {
            convertedData = objectMapper.readValue(jsonString, HashMap.class);
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }

        return convertedData;
    }


    public static ArrayList<String> convertJSONToArrayList(String jsonString) {
        ArrayList<String> listdata = new ArrayList<String>();

        try {
            listdata = objectMapper.readValue(jsonString, ArrayList.class);
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }

        return listdata;
    }

    public static InsiderEvent parseEvent(String eventName, JSONArray parameters) {
        try {
            InsiderEvent event = Insider.Instance.tagEvent(eventName);
        
            if (parameters != null) {
                for (int i = 0; i < parameters.length(); i++) {
                    JSONObject parameter = parameters.getJSONObject(i);
                    if (parameter == null) continue;
                    
                    String type = parameter.getString("type");
                    String key = parameter.getString("key");
                    if (type == null || key == null) continue;
                    
                    switch (type) {
                        case "string":
                            event.addParameterWithString(key, parameter.getString("value"));
                            break;
                        case "integer":
                            // addParameterWithInt takes an int; getInt would wrap a larger value silently.
                            long eventIntValue = parameter.getLong("value");
                            if (isOutOfIntRange(eventIntValue)) {
                                Insider.Instance.putException(new IllegalArgumentException(
                                        "addParameterWithInt: value is outside the int range"));
                                break;
                            }
                            event.addParameterWithInt(key, (int) eventIntValue);
                            break;
                        case "double":
                            event.addParameterWithDouble(key, parameter.getDouble("value"));
                            break;
                        case "boolean":
                            event.addParameterWithBoolean(key, parameter.getBoolean("value"));
                            break;
                        case "date":
                            // value is epoch milliseconds as string
                            long epochValue = Long.parseLong(parameter.getString("value"));
                            Date dateValue = new Date(epochValue);
                            event.addParameterWithDate(key, dateValue);
                            break;
                        case "strings":
                            JSONArray stringsArray = parameter.getJSONArray("value");
                            String[] stringsValue = convertJSONArrayToStringArray(stringsArray);
                            event.addParameterWithStringArray(key, stringsValue);
                            break;
                        case "numbers":
                            JSONArray numbersArray = parameter.getJSONArray("value");
                            Number[] numbersValue = convertJSONArrayToNumericArray(numbersArray);
                            event.addParameterWithNumericArray(key, numbersValue);
                            break;
                        case "objects":
                            // optJSONArray: a malformed value degrades this parameter alone instead of
                            // throwing inside the method-wide try and losing the whole event. A list
                            // with nothing to insert is skipped, as the JS layer does.
                            List<Map<String, Object>> eventObjects = parseCustomParametersList(parameter.optJSONArray("value"));
                            if (eventObjects.isEmpty()) {
                                Insider.Instance.putException(new IllegalArgumentException(
                                        "addParameterWithObjectArray: nothing to insert"));
                                break;
                            }
                            event.addParameterWithObjectArray(key, eventObjects);
                            break;
                    }
                }
            }
            
            return event;
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }

        return null;
    }

    private static String[] convertJSONArrayToStringArray(JSONArray jsonArray){
        try {
            String[] result = new String[jsonArray.length()];

            for (int i = 0; i < jsonArray.length(); i++) {
                result[i] = jsonArray.getString(i);
            }

            return result;
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }

        return null;
    }

    private static Number[] convertJSONArrayToNumericArray(JSONArray jsonArray) {
        try {
            Number[] result = new Number[jsonArray.length()];

            for (int i = 0; i < jsonArray.length(); i++) {
                Object value = jsonArray.get(i);
                if (value instanceof Number) {
                    result[i] = (Number) value;
                } else if (value instanceof String) {
                    try {
                        result[i] = Double.parseDouble((String) value);
                    } catch (NumberFormatException e) {
                        result[i] = 0;
                    }
                }
            }

            return result;
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }

        return null;
    }

    public static InsiderProduct parseProduct(Map<String, Object> requiredFields, Map<String, Object> optionalFields, JSONArray customParameters) {
        try {
            if (!isProductValid(requiredFields)) return null;

            String[] taxonomy;
            Object taxObject = requiredFields.get(Constants.TAXONOMY);

            if (taxObject.getClass().isArray()) {
                taxonomy = (String[]) taxObject;
            } else {
                taxonomy = ((ArrayList<String>) taxObject).toArray(new String[0]);
            }

            double price = 0;
            if (requiredFields.get(Constants.UNIT_PRICE) instanceof Integer) {
                price = Integer.valueOf((Integer) requiredFields.get(Constants.UNIT_PRICE)).doubleValue();
            } else {
                price = (double) requiredFields.get(Constants.UNIT_PRICE);
            }

            InsiderProduct product = Insider.Instance.createNewProduct(
                    (String) requiredFields.get(Constants.PRODUCT_ID),
                    (String) requiredFields.get(Constants.NAME),
                    taxonomy,
                    (String) requiredFields.get(Constants.IMAGE_URL),
                    price,
                    (String) requiredFields.get(Constants.CURRENCY)
            );

            // Apply optional fields
            if (optionalFields != null && optionalFields.size() > 0) {
                Map<String, Object> validatedMap = validateMap(optionalFields);

                for (Map.Entry<String, Object> entry : validatedMap.entrySet()) {
                    Object value = entry.getValue();
                    switch (entry.getKey()) {
                        case Constants.SALE_PRICE:
                            product.setSalePrice((double) value);
                            break;
                        case Constants.STOCK:
                            product.setStock(((int) value));
                            break;
                        case Constants.COLOR:
                            product.setColor((String) value);
                            break;
                        case Constants.SIZE:
                            product.setSize((String) value);
                            break;
                        case Constants.QUANTITY:
                            product.setQuantity(((int) value));
                            break;
                        case Constants.SHIPPING_COST:
                            product.setShippingCost((double) value);
                            break;
                        case Constants.VOUCHER_NAME:
                            product.setVoucherName((String) value);
                            break;
                        case Constants.VOUCHER_DISCOUNT:
                            product.setVoucherDiscount((double) value);
                            break;
                        case Constants.PROMOTION_NAME:
                            product.setPromotionName((String) value);
                            break;
                        case Constants.PROMOTION_DISCOUNT:
                            product.setPromotionDiscount((double) value);
                            break;
                        case Constants.GROUP_CODE:
                            product.setGroupCode((String) value);
                            break;
                        case Constants.BRAND:
                            product.setBrand((String) value);
                            break;
                        case Constants.SKU:
                            product.setSku((String) value);
                            break;
                        case Constants.PRODUCT_GENDER:
                            product.setGender((String) value);
                            break;
                        case Constants.MULTIPACK:
                            product.setMultipack((String) value);
                            break;
                        case Constants.PRODUCT_TYPE:
                            product.setProductType((String) value);
                            break;
                        case Constants.GTIN:
                            product.setGtin((String) value);
                            break;
                        case Constants.DESCRIPTION:
                            product.setDescription((String) value);
                            break;
                        case Constants.TAGS:
                            String[] tags;
                            if (value.getClass().isArray()) {
                                tags = (String[]) value;
                            } else {
                                tags = ((ArrayList<String>) value).toArray(new String[0]);
                            }
                            product.setTags(tags);
                            break;
                        case Constants.IS_IN_STOCK:
                            product.setInStock((boolean) value);
                            break;
                        case Constants.PRODUCT_URL:
                            product.setProductURL((String) value);
                            break;
                        default:
                            setProductCustomAttribute(product, entry.getKey(), value);
                            break;
                    }
                }
            }

            // Apply custom parameters
            if (customParameters != null && customParameters.length() > 0) {
                for (int i = 0; i < customParameters.length(); i++) {
                    JSONObject param = customParameters.getJSONObject(i);
                    if (param == null) continue;

                    String type = param.getString("type");
                    String key = param.getString("key");
                    if (type == null || key == null) continue;

                    switch (type) {
                        case "string":
                            product.setCustomAttributeWithString(key, param.getString("value"));
                            break;
                        case "integer":
                            // setCustomAttributeWithInt takes an int; getInt would wrap a larger value silently.
                            long productIntValue = param.getLong("value");
                            if (isOutOfIntRange(productIntValue)) {
                                Insider.Instance.putException(new IllegalArgumentException(
                                        "setCustomAttributeWithInt: value is outside the int range"));
                                break;
                            }
                            product.setCustomAttributeWithInt(key, (int) productIntValue);
                            break;
                        case "double":
                            product.setCustomAttributeWithDouble(key, param.getDouble("value"));
                            break;
                        case "boolean":
                            product.setCustomAttributeWithBoolean(key, param.getBoolean("value"));
                            break;
                        case "date":
                            // value is epoch milliseconds as string
                            long epochValue = Long.parseLong(param.getString("value"));
                            Date dateValue = new Date(epochValue);
                            product.setCustomAttributeWithDate(key, dateValue);
                            break;
                        case "strings":
                            JSONArray stringsArray = param.getJSONArray("value");
                            String[] stringsValue = convertJSONArrayToStringArray(stringsArray);
                            product.setCustomAttributeWithStringArray(key, stringsValue);
                            break;
                        case "numbers":
                            JSONArray numbersArray = param.getJSONArray("value");
                            Number[] numbersValue = convertJSONArrayToNumericArray(numbersArray);
                            product.setCustomAttributeWithNumericArray(key, numbersValue);
                            break;
                    }
                }
            }

            return product;
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
        return null;
    }

    private static boolean isProductValid(Map<String, Object> requiredFields) {
        return requiredFields.containsKey(Constants.PRODUCT_ID)
                && requiredFields.containsKey(Constants.NAME)
                && requiredFields.containsKey(Constants.TAXONOMY)
                && requiredFields.containsKey(Constants.IMAGE_URL)
                && requiredFields.containsKey(Constants.UNIT_PRICE)
                && requiredFields.containsKey(Constants.CURRENCY);
    }

    public static InsiderGender genderFromInt(int gender) {
        switch (gender) {
            case 0: return InsiderGender.MALE;
            case 1: return InsiderGender.FEMALE;
            default: return InsiderGender.OTHER;
        }
    }

    public static void setGender(int gender) {
        try {
            Insider.Instance.getCurrentUser().setGender(genderFromInt(gender));
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }

    public static void getMessageCenterData(int limit, long startDateEpoch, long endDateEpoch, MessageCenterData callback) {
        try {
            Insider.Instance.getMessageCenterData(limit, new Date(startDateEpoch), new Date(endDateEpoch), callback);
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }

    // Lenient date parsing and the list-to-array rules are intentional: integrators' optional
    // product fields depend on exactly these conversions.
    public static HashMap<String, Object> validateMap(Map<String, Object> map) {
        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
        dateFormatter.setTimeZone(TimeZone.getTimeZone("UTC"));
        HashMap<String, Object> validatedMap = new HashMap<>();
        try {
            for (String key : map.keySet()) {
                Object value = map.get(key);
                switch (value.getClass().getSimpleName()) {
                    case "ArrayList":
                        ArrayList<?> arrayList = (ArrayList<?>) value;
                        if (isConvertibleToArray(arrayList, String.class)) {
                            validatedMap.put(key, toStringArray(arrayList));
                        } else if (isConvertibleToArray(arrayList, Number.class)) {
                            validatedMap.put(key, toNumberArray(arrayList));
                        } else {
                            validatedMap.put(key, arrayList.toArray());
                        }
                        break;
                    case "String":
                        try {
                            Date date = dateFormatter.parse(value.toString());
                            validatedMap.put(key, date);
                        } catch (ParseException parse) {
                            validatedMap.put(key, value);
                        } catch (Exception ignored) {
                            // Dropping the key on an unexpected parse failure is the shipped behaviour.
                        }
                        break;
                    default:
                        validatedMap.put(key, value);
                        break;
                }
            }
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
        return validatedMap;
    }

    private static Number[] toNumberArray(List<?> list) {
        return list.stream()
                .filter(element -> element instanceof Number)
                .map(element -> (Number) element)
                .toArray(Number[]::new);
    }

    private static String[] toStringArray(List<?> list) {
        return list.stream()
                .filter(element -> element instanceof String)
                .map(element -> (String) element)
                .toArray(String[]::new);
    }

    private static <T> boolean isConvertibleToArray(List<?> list, Class<T> clazz) {
        return list.stream()
                .allMatch(o -> o == null || clazz.isInstance(o));
    }

    public static String mapAppCardsExceptionCode(AppCardsException exception) {
        switch (exception.getCode()) {
            case SDK_NOT_INITIALIZED: return "sdkNotInitialized";
            case INVALID_PARAMETER: return "invalidParameter";
            case NETWORK_ERROR: return "networkError";
            case SERVER_ERROR: return "serverError";
            case PARSE_ERROR: return "parseError";
            default: return "unknown";
        }
    }

    public static JSONObject appCardsErrorToJSON(Exception error) {
        try {
            JSONObject json = new JSONObject();
            if (error instanceof AppCardsException) {
                json.put("code", mapAppCardsExceptionCode((AppCardsException) error));
                json.put("message", error.getMessage() != null ? error.getMessage() : "An unexpected error occurred.");
            } else {
                json.put("code", "unknown");
                json.put("message", error.getMessage() != null ? error.getMessage() : "An unexpected error occurred.");
            }
            return json;
        } catch (JSONException e) {
            try {
                JSONObject fallback = new JSONObject();
                fallback.put("code", "unknown");
                fallback.put("message", "An unexpected error occurred.");
                return fallback;
            } catch (JSONException ignored) {
                return new JSONObject();
            }
        }
    }

    /**
     * Converts a native Map (as delivered by the Insider SDK event listener) into a JSONObject
     * that can be handed to a CallbackContext.
     *
     * Structured conversion is mandatory here: event parameter values are supplied by the
     * integrator and may contain quotes, backslashes or newlines that would corrupt any
     * string-interpolated JSON.
     *
     * Null values are preserved as JSONObject.NULL rather than dropped, because
     * JSONObject.put(key, null) REMOVES the key and would silently hide the parameter from JS.
     */
    public static JSONObject convertMapToJSON(Map<String, Object> map) {
        JSONObject json = new JSONObject();

        if (map == null) {
            return json;
        }

        try {
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                String key = entry.getKey();

                if (key == null) continue;

                json.put(key, convertValueToJSON(entry.getValue()));
            }
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }

        return json;
    }

    private static JSONArray convertCollectionToJSON(Iterable<?> values) {
        JSONArray array = new JSONArray();

        if (values == null) {
            return array;
        }

        for (Object value : values) {
            array.put(convertValueToJSON(value));
        }

        return array;
    }

    private static JSONArray convertArrayToJSON(Object array) {
        JSONArray jsonArray = new JSONArray();

        int length = java.lang.reflect.Array.getLength(array);

        for (int i = 0; i < length; i++) {
            jsonArray.put(convertValueToJSON(java.lang.reflect.Array.get(array, i)));
        }

        return jsonArray;
    }

    @SuppressWarnings("unchecked")
    private static Object convertValueToJSON(Object value) {
        try {
            if (value == null) {
                return JSONObject.NULL;
            }

            if (value instanceof Map) {
                return convertMapToJSON((Map<String, Object>) value);
            }

            if (value instanceof Iterable) {
                return convertCollectionToJSON((Iterable<?>) value);
            }

            if (value.getClass().isArray()) {
                return convertArrayToJSON(value);
            }

            if (value instanceof Date) {
                return ((Date) value).getTime();
            }

            if (value instanceof Boolean || value instanceof String || value instanceof JSONObject || value instanceof JSONArray) {
                return value;
            }

            if (value instanceof Double || value instanceof Float) {
                double doubleValue = ((Number) value).doubleValue();

                // JSONObject rejects NaN / Infinity; represent them as null instead of throwing.
                if (Double.isNaN(doubleValue) || Double.isInfinite(doubleValue)) {
                    return JSONObject.NULL;
                }

                return doubleValue;
            }

            if (value instanceof Number) {
                return value;
            }

            return String.valueOf(value);
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }

        return JSONObject.NULL;
    }

    private static void setProductCustomAttribute(InsiderProduct product, String key, Object value) {
        try {
            if (key == null || key.length() == 0 || value == null) return;
            switch (value.getClass().getSimpleName()) {
                case "String":
                    product.setCustomAttributeWithString(key, (String) value);
                    break;
                case "Double":
                    product.setCustomAttributeWithDouble(key, (double) value);
                    break;
                case "Integer":
                    product.setCustomAttributeWithInt(key, (int) value);
                    break;
                case "Boolean":
                    product.setCustomAttributeWithBoolean(key, (boolean) value);
                    break;
                case "Date":
                    product.setCustomAttributeWithDate(key, (Date) value);
                    break;
                case "String[]":
                    product.setCustomAttributeWithStringArray(key, (String[]) value);
                    break;
                case "Number[]":
                    product.setCustomAttributeWithNumericArray(key, (Number[]) value);
                    break;
                default:
                    break;
            }
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }

    static boolean isOutOfIntRange(long value) {
        return value < Integer.MIN_VALUE || value > Integer.MAX_VALUE;
    }

    public static Map<String, Object> parseCustomParameters(JSONArray customParameters) {
        Map<String, Object> mappedCustomParameters = new HashMap<>();

        if (customParameters == null) {
            return mappedCustomParameters;
        }

        for (int i = 0; i < customParameters.length(); i++) {
            // Per-entry try: a malformed entry is skipped on its own instead of aborting the loop
            // and silently dropping every entry after it (same as iOS parseCustomParameters:).
            try {
                JSONObject parameter = customParameters.getJSONObject(i);
                if (parameter == null) continue;

                String type = parameter.optString("type", null);
                String key = parameter.optString("key", null);

                if (type == null || key == null) continue;

                switch (type) {
                    case "string":
                        if (parameter.has("value") && !parameter.isNull("value")) {
                            mappedCustomParameters.put(key, parameter.getString("value"));
                        }
                        break;
                    case "integer":
                        if (parameter.has("value") && !parameter.isNull("value")) {
                            // A JS integer can exceed the int range; getInt would wrap it silently.
                            long longValue = parameter.getLong("value");
                            if (isOutOfIntRange(longValue)) {
                                mappedCustomParameters.put(key, longValue);
                            } else {
                                mappedCustomParameters.put(key, (int) longValue);
                            }
                        }
                        break;
                    case "double":
                        if (parameter.has("value") && !parameter.isNull("value")) {
                            mappedCustomParameters.put(key, parameter.getDouble("value"));
                        }
                        break;
                    case "boolean":
                        if (parameter.has("value") && !parameter.isNull("value")) {
                            mappedCustomParameters.put(key, parameter.getBoolean("value"));
                        }
                        break;
                    case "date":
                        if (parameter.has("value") && !parameter.isNull("value")) {
                            long epochMillis = parameter.getLong("value");
                            Date dateValue = new Date(epochMillis);
                            mappedCustomParameters.put(key, dateValue);
                        }
                        break;
                    case "numeric_array":
                        if (parameter.has("value") && !parameter.isNull("value")) {
                            JSONArray arrayValue = parameter.getJSONArray("value");
                            Number[] numberArray = convertJSONArrayToNumericArray(arrayValue);
                            if (numberArray != null) {
                                mappedCustomParameters.put(key, numberArray);
                            }
                        }
                        break;
                    case "string_array":
                        if (parameter.has("value") && !parameter.isNull("value")) {
                            JSONArray arrayValue = parameter.getJSONArray("value");
                            String[] stringArray = convertJSONArrayToStringArray(arrayValue);
                            if (stringArray != null) {
                                mappedCustomParameters.put(key, stringArray);
                            }
                        }
                        break;
                    case "object":
                        if (parameter.has("value") && !parameter.isNull("value")) {
                            JSONArray nestedValue = parameter.getJSONArray("value");
                            mappedCustomParameters.put(key, parseCustomParameters(nestedValue));
                        }
                        break;
                }
            } catch (Exception e) {
                Insider.Instance.putException(e);
            }
        }

        return mappedCustomParameters;
    }

    // Decodes an array of typed parameter arrays — the array-of-objects payload. A non-array
    // element, or one that decodes to nothing, is skipped rather than failing the whole list.
    public static List<Map<String, Object>> parseCustomParametersList(JSONArray list) {
        List<Map<String, Object>> objects = new ArrayList<>();

        if (list == null) {
            return objects;
        }

        for (int i = 0; i < list.length(); i++) {
            JSONArray item = list.optJSONArray(i);
            if (item == null) continue;

            // An object that decodes to nothing would be written as an empty object.
            Map<String, Object> object = parseCustomParameters(item);
            if (object.isEmpty()) continue;

            objects.add(object);
        }

        return objects;
    }

    // True when the match decodes with no lost entry at every nesting level. The count check
    // also catches an unrecognized `type`, which parseCustomParameters skips. A widened match
    // would rewrite or delete untargeted objects, so callers fail closed even without the JS check.
    public static boolean isLosslessMatch(JSONArray matchArray) {
        if (matchArray == null) return false;

        try {
            Map<String, Object> decoded = parseCustomParameters(matchArray);
            if (decoded.size() != matchArray.length()) {
                return false;
            }

            for (int i = 0; i < matchArray.length(); i++) {
                JSONObject parameter = matchArray.optJSONObject(i);
                if (parameter == null) return false;

                if ("object".equals(parameter.optString("type", null))) {
                    JSONArray nested = parameter.optJSONArray("value");
                    if (nested == null || !isLosslessMatch(nested)) {
                        return false;
                    }
                }
            }
        } catch (Exception e) {
            return false;
        }

        return true;
    }
}
