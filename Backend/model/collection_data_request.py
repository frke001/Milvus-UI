from pydantic import BaseModel, Field

class CollectionDataRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2500)
    metadata: dict