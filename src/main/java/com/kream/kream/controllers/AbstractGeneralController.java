package com.kream.kream.controllers;

import com.kream.kream.results.Result;
import org.json.JSONObject;

public abstract class AbstractGeneralController {
    protected final JSONObject generateRestResponse(Result result) {
        JSONObject response = new JSONObject();
        response.put(Result.NAME, result.nameToLower());
        return response;
    }
}
