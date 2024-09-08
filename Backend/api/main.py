from typing import Annotated
from fastapi import FastAPI, Path, Query
from fastapi.responses import JSONResponse
from model import *
from services.milvus_services import *

app = FastAPI(title="Milvus_UI", root_path="/api/v1")


# Connection
@app.post("/connect")
def connect_to_milvus(request: ConnectRequest) -> JSONResponse:
    return connect(request)


# Database CRUD
@app.post("/databases")
def create(request: DatabaseRequest):
    return create_db(request)


@app.get("/databases")
def get_all():
    return get_all_databases()


@app.delete("/databases/{db_name}")
def delete(db_name: Annotated[str, Path(min_length=1, max_length=50)]):
    return delete_db(db_name)


# Collection CRUD
@app.get("/databases/{db_name}/collections")
def get_all(
    db_name: Annotated[
        str,
        Path(
            title="Name of database which contains collections",
            min_length=1,
            max_length=50,
        ),
    ]
):
    return get_all_collections(db_name)


@app.post("/databases/{db_name}/collections")
def create(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    request: CollectionRequest,
):
    return create_collection(db_name, request)


@app.delete("/databases/{db_name}/collections/{collection_name}")
def delete(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
):
    return delete_collection(db_name, collection_name)


@app.put("/databases/{db_name}/collections/{collection_name}")
def load(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
):
    return load_collection(db_name, collection_name)


@app.get("/databases/{db_name}/collections/{collection_name}/data")
def get__all_data(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
    limit: Annotated[int, Query(ge=0)] = 10,
    offset: Annotated[int, Query(ge=0)] = 0,
):
    return get_collection_data(db_name, collection_name, limit, offset)


@app.post("/databases/{db_name}/collections/{collection_name}/data")
def insert(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
    request: CollectionDataRequest,
):
    return insert_data(db_name, collection_name, request)


@app.delete("/databases/{db_name}/collections/{collection_name}/data")
def delete(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
    request: DeleteCollectionDataRequest,
):
    return delete_data(db_name, collection_name, request)


@app.post("/databases/{db_name}/collections/{collection_name}/data/search")
def search(db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
    request: SearchRequest,):
    return similarity_search(db_name, collection_name, request)