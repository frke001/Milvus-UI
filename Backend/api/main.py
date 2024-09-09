from typing import Annotated
from fastapi import FastAPI, Path, Query
from fastapi.responses import JSONResponse
from model import *
from services.milvus_services import *
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Milvus_UI", root_path="/api/v1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Connection
@app.post("/connect")
def connect_to_milvus(request: ConnectRequest) -> JSONResponse:
    return connect(request)


@app.post("/disconnect")
def disconnect_from_milvus() -> JSONResponse:
    return disconnect()


# Database CRUD
@app.post("/databases")
def create(request: DatabaseRequest) -> JSONResponse:
    return create_db(request)


@app.get("/databases")
def get_all() -> JSONResponse:
    return get_all_databases()


@app.delete("/databases/{db_name}")
def delete(db_name: Annotated[str, Path(min_length=1, max_length=50)]) -> JSONResponse:
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
) -> JSONResponse:
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
) -> JSONResponse:
    return delete_collection(db_name, collection_name)


@app.put("/databases/{db_name}/collections/{collection_name}")
def load(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
) -> JSONResponse:
    return load_collection(db_name, collection_name)


@app.get("/databases/{db_name}/collections/{collection_name}/data")
def get__all_data(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
    limit: Annotated[int, Query(ge=0)] = 10,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> JSONResponse:
    return get_collection_data(db_name, collection_name, limit, offset)


@app.post("/databases/{db_name}/collections/{collection_name}/data")
def insert(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
    request: CollectionDataRequest,
) -> JSONResponse:
    return insert_data(db_name, collection_name, request)


@app.delete("/databases/{db_name}/collections/{collection_name}/data")
def delete(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
    request: DeleteCollectionDataRequest,
) -> JSONResponse:
    return delete_data(db_name, collection_name, request)


@app.post("/databases/{db_name}/collections/{collection_name}/data/search")
def search(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
    request: SearchRequest,
) -> JSONResponse:
    return similarity_search(db_name, collection_name, request)
