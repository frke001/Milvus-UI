export type SearchResponse = {
    id: string,
    distance: number,
    entity: Entity
}
export type Entity = {
    text: string,
    metadata: any,
    id: string
}