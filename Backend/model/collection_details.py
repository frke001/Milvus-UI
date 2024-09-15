from pydantic import BaseModel, Field

class CollectionDetails(BaseModel):
    name: str
    row_count: int
    loaded: bool
    fields: list[dict]
    index: dict