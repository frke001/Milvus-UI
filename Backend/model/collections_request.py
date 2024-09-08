from pydantic import BaseModel, Field
from enum import Enum

class IndexType(str, Enum):
    flat="FLAT"
    ivf_flat="IVF_FLAT"
    ivf_sq8="IVF_SQ8"
    ivf_pq="IVF_PQ"
    hnsw="HNSW"
    scann="SCANN"
    
class CollectionRequest(BaseModel):
    name: str = Field(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    index_type: IndexType
    index_params: dict = Field(description="Parameters specific to the index type")

    
index_metrics = {
    IndexType.flat: "L2", 
    IndexType.ivf_flat: "L2",
    IndexType.ivf_sq8: "L2",
    IndexType.ivf_pq: "L2",
    IndexType.hnsw: "IP",
    IndexType.scann: "COSINE",
}