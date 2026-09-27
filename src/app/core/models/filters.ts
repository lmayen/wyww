export type FilterOperator = 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'notin';

export interface FilterItem {
    field: string;
    operator: FilterOperator;
    value: any;
}