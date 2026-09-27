import {HttpParams} from "@angular/common/http";


export function toHttpParams(params: object): HttpParams {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            const valueType: "undefined" | "object" | "boolean" | "number" | "string" | "function" | "symbol" | "bigint" = typeof value
            switch (valueType) {
                case "object":
                    httpParams = httpParams.set(key, JSON.stringify(value));
                    break;
                case "string":
                    httpParams = httpParams.set(key, value);
                    break;
                case "number":
                    httpParams = httpParams.set(key, JSON.stringify(value));
                    break;
                case "boolean":
                    httpParams = httpParams.set(key, JSON.stringify(value));
                    break;
                default:
                    break;
            }
        } else if (value == null) {
            httpParams = httpParams.set(key, value);
        }
    });

    return httpParams;
}
