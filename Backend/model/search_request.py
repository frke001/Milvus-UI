from pydantic import BaseModel, Field

class SearchRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2500)
    limit: int = Field(gt=0, default=10) #The total number of entities to return.