package com.useinsider.cordova;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.useinsider.insider.Insider;
import com.useinsider.insider.InsiderProduct;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Array;
import java.lang.reflect.Type;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
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

    public static Map convertJSONObjectToMap(JSONObject jsonObject) throws JSONException {
        HashMap map = new HashMap();

        try {
            Iterator<String> iterator = jsonObject.keys();
            while (iterator.hasNext()) {
                String key = iterator.next();
                Object value = jsonObject.get(key);
                if (value instanceof JSONObject) {
                    map.put(key, convertJSONObjectToMap((JSONObject) value));
                } else if (value instanceof JSONArray) {
                    map.put(key, convertJSONArrayToArray((JSONArray) value));
                } else if (value instanceof Boolean) {
                    map.put(key, (Boolean) value);
                } else if (value instanceof Integer) {
                    map.put(key, (Integer) value);
                } else if (value instanceof Double) {
                    map.put(key, (Double) value);
                } else if (value instanceof String) {
                    map.put(key, (String) value);
                } else {
                    map.put(key, value.toString());
                }
            }
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }

        return map;
    }

    public static ArrayList convertJSONArrayToArray(JSONArray jsonArray) throws JSONException {
        ArrayList array = new ArrayList();

        try {
            for (int i = 0; i < jsonArray.length(); i++) {
                Object value = jsonArray.get(i);
                if (value instanceof JSONObject) {
                    array.add(convertJSONObjectToMap((JSONObject) value));
                } else if (value instanceof JSONArray) {
                    array.add(convertJSONArrayToArray((JSONArray) value));
                } else if (value instanceof Boolean) {
                    array.add((Boolean) value);
                } else if (value instanceof Integer) {
                    array.add((Integer) value);
                } else if (value instanceof Double) {
                    array.add((Double) value);
                } else if (value instanceof String) {
                    array.add((String) value);
                } else {
                    array.add(value.toString());
                }
            }
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }

        return array;
    }
}