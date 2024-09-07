from fastapi.responses import JSONResponse
from model import *


def connect(request: ConnectRequest) -> bool:
    try:
        milvus_client = MilvusClientSingleton(uri=request.uri)
        return JSONResponse(
            status_code=200, content="Successfully connected to Milvus Server."
        )
    except Exception as ex:
        return JSONResponse(status_code=400, content="Connection failed!")


def create_db(request: DatabaseRequest) -> bool:
    # milvus_client = MilvusClientSingleton.get_instance(uri_request.uri)
    milvus_client = MilvusClientSingleton._instance
    if milvus_client is not None:
        try:
            milvus_client.create_database(db_name=request.name)
            return JSONResponse(
                status_code=200,
                content=f"Successfully created {request.name} database.",
            )
        except Exception as ex:
            return JSONResponse(
                status_code=400, content=f"Database {request.name} already exists!"
            )
    else:
        return JSONResponse(
            status_code=400, content="Failed to connect to Milvus Server!"
        )


def get_all_databases():
    # milvus_client = MilvusClientSingleton.get_instance(uri_request)
    milvus_client = MilvusClientSingleton._instance
    print(milvus_client)
    if milvus_client is not None:
        databases = milvus_client.list_databases()
        database_info = []
        for database in databases:
            milvus_client.using_database(db_name=database)
            database_info.append(
                DatabaseResponse(
                    name=database,
                    collections_count=len(milvus_client.list_collections()),
                ).model_dump()
            )
        return JSONResponse(status_code=200, content=database_info)
    else:
        return JSONResponse(
            status_code=400, content="Failed to connect to Milvus Server!"
        )


def get_all_collections(database: str) -> list[str]:
    # milvus_client = MilvusClientSingleton.get_instance(uri_request.uri)
    milvus_client = MilvusClientSingleton._instance
    if milvus_client is not None:
        try:
            milvus_client.using_database(db_name=database)
            collections = milvus_client.list_collections()
            collections_info = []
            for col in collections:
                col_inf = milvus_client.describe_collection(collection_name=col)
                print(col_inf)
                collections_info.append(
                    CollectionResponse(
                        name=col_inf.get("collection_name"),
                        description=col_inf.get("description"),
                    ).model_dump()
                )
            return JSONResponse(status_code=200, content=collections_info)
        except Exception as ex:
            print(ex)
            return JSONResponse(
                status_code=400, content=f"{database} database does not exists!"
            )
