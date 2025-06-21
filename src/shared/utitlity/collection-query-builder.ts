import { flattenDeep } from "lodash-es";
import {
  CollectionQuery,
  DetailQuery,
  Filter,
  Order,
} from "../models/collection.model";

export type apiType = "ps" | "strapi";

export const getKeyValue =
  <U extends keyof T, T extends object>(key: U) =>
  (obj: T) =>
    obj[key];

export const collectionQueryBuilder = (
  request: CollectionQuery,
  type: apiType = "ps"
) => {
  const params = new URLSearchParams();

  if (request?.skip !== undefined) {
    const skip = type === "strapi" ? "_start" : "skip";
    params.set(skip, request.skip.toString());
  }

  if (request?.top !== undefined) {
    const top = type === "strapi" ? "_limit" : "top";
    params.set(top, request.top.toString());
  }

  if (request?.search !== undefined) {
    params.set("search", request.search.toString());
  }

  if (request?.searchFrom?.length) {
    request.searchFrom.forEach((searchFrom, index) => {
      params.append(`searchFrom[${index}]`, searchFrom.toString());
    });
  }

  if (request?.orderBy?.length) {
    request.orderBy.forEach((orderBy, index) => {
      const orderKeys: (keyof Order)[] = ["field", "direction"];
      orderKeys.forEach((key) => {
        const value = orderBy[key];
        if (value !== undefined) {
          params.append(`orderBy[${index}][${key}]`, encodeURIComponent(value));
        }
      });
    });
  }

  if (request?.groupBy?.length) {
    request.groupBy.forEach((groupBy, index) => {
      params.append(`groupBy[${index}]`, encodeURIComponent(groupBy));
    });
  }

  if (request?.filter?.length) {
    if (type === "strapi") {
      const flat = flattenDeep(request.filter);
      const operators = {
        "=": "_eq",
      };
      flat.forEach((r: Filter) => {
        // const operator = getKeyValue("operator")(r);
        const operator = getKeyValue<"operator", Filter>("operator")(r);
        const fieldKey = `${r.field}${operators[operator as keyof typeof operators]}`;
        params.append(fieldKey, String(r.value));
      });
    } else {
      const filterKeys: (keyof Filter)[] = ["field", "value", "operator"];
      request.filter.forEach((filterAnd, index) => {
        filterAnd.forEach((filterOr, orIndex) => {
          filterKeys.forEach((key) => {
            const value = filterOr[key];
            if (value !== undefined) {
              params.append(
                `filter[${index}][${orIndex}][${key}]`,
                String(value)
              );
            }
          });
        });
      });
    }
  }

  if (request?.select?.length) {
    request.select.forEach((select, index) => {
      params.append(`select[${index}]`, select);
    });
  }

  if (request?.includes?.length) {
    request.includes.forEach((include, index) => {
      params.append(`includes[${index}]`, include);
    });
  }

  if (request?.distinct?.length) {
    request.distinct.forEach((distinct, index) => {
      params.append(`distinct[${index}]`, distinct);
    });
  }

  if (request?.count !== undefined) {
    params.set("count", request.count.toString());
  }

  if (request?.withArchived !== undefined && request.withArchived) {
    params.set("withArchived", request.withArchived.toString());
  }

  return params;
};

export const findById = (id: string) => {
  const request: DetailQuery = {
    filter: [
      [
        {
          field: "id",
          value: id,
          operator: "=",
        },
      ],
    ],
  };

  return collectionQueryBuilder(request);
};
