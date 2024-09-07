from pydantic import BaseModel, Field

class ConnectRequest(BaseModel):
    uri: str = Field(min_length=3, max_length=255)