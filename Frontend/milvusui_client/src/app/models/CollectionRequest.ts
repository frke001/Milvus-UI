export enum IndexType {
  FLAT = 'FLAT',
  IVF_FLAT = 'IVF_FLAT',
  IVF_SQ8 = 'IVF_SQ8',
  IVF_PQ = 'IVF_PQ',
  HNSW = 'HNSW',
  SCANN = 'SCANN',
}
export interface IvfIndexParams {
  nlist: number;
}
export interface IvfPQIndexParams {
  nlist: number;
  m: number;
}
export interface ScannIndexParams {
  nlist: number;
  with_raw_data: boolean;
}
export interface HnswIndexParams {
  efConstruction: number;
  M: number;
}
export type IndexParams =
  | IvfIndexParams
  | IvfPQIndexParams
  | ScannIndexParams
  | HnswIndexParams;

export type CollectionRequest = {
  name: string;
  index_type: IndexType;
  index_params: any;
};

export const index_type_desc = [
  {
    type: IndexType.FLAT,
    desc: 'The FLAT index in Milvus provides exact vector similarity search results by exhaustively comparing each query to all vectors in a dataset, ensuring 100% accuracy but with slower performance, making it ideal for small-scale datasets where perfect precision is required.',
  },
  {
    type: IndexType.IVF_FLAT,
    desc: 'The IVF_FLAT index partitions vector data into clusters and compares vectors to the cluster centers, allowing for a balance between accuracy and speed by adjusting the number of clusters queried, though query time increases with the number of vectors and clusters.',
  },
  {
    type: IndexType.IVF_SQ8,
    desc: 'The IVF_FLAT index maintains the original data size with only slight reductions compared to the raw dataset, resulting in large memory requirements, whereas IVF_SQ8 compresses data significantly by converting floats to uint8, reducing storage and memory needs by 70–75%.',
  },
  {
    type: IndexType.IVF_PQ,
    desc: 'PQ decomposes high-dimensional vectors into low-dimensional spaces for efficient distance calculations, reducing time and space complexity, while IVF_PQ combines this with IVF clustering, resulting in smaller index files but with some loss of accuracy.',
  },
  {
    type: IndexType.HNSW,
    desc: 'HNSW uses a multi-layered graph structure with sparse upper layers and dense lower layers to efficiently search for the nearest neighbors by iterating through layers, and it allows performance optimization by setting limits on node degrees and search range parameters.',
  },
  {
    type: IndexType.SCANN,
    desc: 'SCANN enhances IVF_PQ by optimizing product quantization and utilizing SIMD (Single-Instruction / Multi-data) for more efficient distance calculations, leading to improved performance.',
  },
];
