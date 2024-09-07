from pydantic import BaseModel, Field

class DatabaseRequest(BaseModel):
    name: str = Field(min_length=1, max_length=50)