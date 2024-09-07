from pydantic import BaseModel, Field

class CollectionResponse(BaseModel):
    name: str
    description: str
    