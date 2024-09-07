from pydantic import BaseModel
class DatabaseResponse(BaseModel):
    name: str
    collections_count: int
    