export type CollectionData = {
    id: string;
    vector: number[];
    text: string;
    metadata: any;
}

export type CollectionDataResponse = {
    data: CollectionData[];
    limit: number;
    offset: number;
    total_records: number;
}