from pydantic import BaseModel

class DeleteCollectionDataRequest(BaseModel):
    ids: list[int]