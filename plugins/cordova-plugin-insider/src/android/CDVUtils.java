package com.useinsider.cordova;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.useinsider.insider.Insider;
import com.useinsider.insider.InsiderProduct;
import com.useinsider.insider.InsiderEvent;
import com.useinsider.insiderhybrid.InsiderHybridUtils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class CDVUtils {
    public static Map<String, Object>  convertJSONToMap(String jsonString) {
        Map<String, Object> convertedData = null;

        try {
            convertedData = new ObjectMapper().readValue(jsonString, HashMap.class);

        } catch (Exception e) {
            Insider.Instance.putException(e);
        }

        return convertedData;
    }

    public static Map<String, String>  convertJSONToStringMap(String jsonString) {
        Map<String, String> convertedData = null;

        try {
            convertedData = new ObjectMapper().readValue(jsonString, HashMap.class);
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }

        return convertedData;
    }


    public static ArrayList<String> convertJSONToArrayList(String jsonString) {
        ArrayList<String> listdata = new ArrayList<String>();

        try {
            listdata = new ObjectMapper().readValue(jsonString, ArrayList.class);
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
                            event.addParameterWithInt(key, parameter.getInt("value"));
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
                Map<String, Object> validatedMap = InsiderHybridUtils.validateMap(optionalFields);

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
                            product.setCustomAttributeWithInt(key, param.getInt("value"));
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
}