from typing import Annotated
from fastapi import FastAPI, Header, Path, Query
from fastapi.responses import JSONResponse
from model import *
from services.milvus_services import *
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Milvus_UI", root_path="/api/v1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Connection
@app.post("/connect")
def connect_to_milvus(request: ConnectRequest) -> JSONResponse:
    return connect(request)


@app.post("/disconnect")
def disconnect_from_milvus(connection_string: Annotated[str | None, Header()] = None) -> JSONResponse:
    if connection_string is not None:
        return disconnect(connection_string)
    else:
        return JSONResponse(status_code=400, content="Bad request")


# Database CRUD
@app.post("/databases")
def create(
    request: DatabaseRequest, connection_string: Annotated[str | None, Header()] = None
) -> JSONResponse:
    if connection_string is not None:
        return create_db(request, connection_string)
    else:
        return JSONResponse(status_code=400, content="Bad request")


@app.get("/databases")
def get_all(connection_string: Annotated[str | None, Header()] = None) -> JSONResponse:
    if connection_string is not None:
        return get_all_databases(connection_string)
    else:
        return JSONResponse(status_code=400, content="Bad request")


@app.delete("/databases/{db_name}")
def delete(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    connection_string: Annotated[str | None, Header()] = None,
) -> JSONResponse:
    if connection_string is not None:
        return delete_db(db_name, connection_string)
    else:
        return JSONResponse(status_code=400, content="Bad request")


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
    ],
    connection_string: Annotated[str | None, Header()] = None,
) -> JSONResponse:
    if connection_string is not None:
        return get_all_collections(db_name, connection_string)
    else:
        return JSONResponse(status_code=400, content="Bad request")


@app.post("/databases/{db_name}/collections")
def create(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    request: CollectionRequest,
    connection_string: Annotated[str | None, Header()] = None,
):
    if connection_string is not None:
        return create_collection(db_name, request, connection_string)
    else:
        return JSONResponse(status_code=400, content="Bad request")


@app.delete("/databases/{db_name}/collections/{collection_name}")
def delete(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
    connection_string: Annotated[str | None, Header()] = None,
) -> JSONResponse:
    if connection_string is not None:
        return delete_collection(db_name, collection_name, connection_string)
    else:
        return JSONResponse(status_code=400, content="Bad request")


@app.put("/databases/{db_name}/collections/{collection_name}")
def load(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
    connection_string: Annotated[str | None, Header()] = None,
) -> JSONResponse:
    if connection_string is not None:
        return load_collection(db_name, collection_name, connection_string)
    else:
        return JSONResponse(status_code=400, content="Bad request")


@app.get("/databases/{db_name}/collections/{collection_name}/data")
def get__all_data(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
    limit: Annotated[int, Query(ge=0)] = 10,
    offset: Annotated[int, Query(ge=0)] = 0,
    connection_string: Annotated[str | None, Header()] = None,
) -> JSONResponse:
    if connection_string is not None:
        return get_collection_data(
            db_name, collection_name, limit, offset, connection_string
        )
    else:
        return JSONResponse(status_code=400, content="Bad request")


@app.post("/databases/{db_name}/collections/{collection_name}/data")
def insert(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
    request: CollectionDataRequest,
    connection_string: Annotated[str | None, Header()] = None,
) -> JSONResponse:
    if connection_string is not None:
        return insert_data(db_name, collection_name, request, connection_string)
    else:
        return JSONResponse(status_code=400, content="Bad request")


@app.get("/databases/{db_name}/collections/{collection_name}/details")
def get_details(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
    connection_string: Annotated[str | None, Header()] = None,
) -> JSONResponse:
    if connection_string is not None:
        return get_collection_details(db_name, collection_name, connection_string)
    else:
        return JSONResponse(status_code=400, content="Bad request")


@app.delete("/databases/{db_name}/collections/{collection_name}/data")
def delete(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
    request: DeleteCollectionDataRequest,
    connection_string: Annotated[str | None, Header()] = None,
) -> JSONResponse:
    if connection_string is not None:
        return delete_data(db_name, collection_name, request, connection_string)
    else:
        return JSONResponse(status_code=400, content="Bad request")


@app.post("/databases/{db_name}/collections/{collection_name}/data/search")
def search(
    db_name: Annotated[str, Path(min_length=1, max_length=50)],
    collection_name: Annotated[
        str, Path(pattern="^[a-zA-Z_][a-zA-Z0-9_]*$", min_length=1, max_length=50)
    ],
    request: SearchRequest,
    connection_string: Annotated[str | None, Header()] = None,
) -> JSONResponse:
    if connection_string is not None:
        return similarity_search(db_name, collection_name, request, connection_string)
    else:
        return JSONResponse(status_code=400, content="Bad request")
