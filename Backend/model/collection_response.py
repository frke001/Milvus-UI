from pydantic import BaseModel, Field

class CollectionResponse(BaseModel):
    name: str
    row_count: int
    loaded: bool
    