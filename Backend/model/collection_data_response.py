from pydantic import BaseModel, Field

class CollectionDataResponse(BaseModel):
    id: int
    text: str
    vector: list[float]
    metadata: dict