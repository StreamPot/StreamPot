export interface AudioVideoFilter {
    filter: string;
    options: string | string[] | {};
}

export interface FilterSpecification {
    filter: string;
    inputs?: string | string[] | undefined;
    outputs?: string | string[] | undefined;
    options?: any | string | any[] | undefined;
}
