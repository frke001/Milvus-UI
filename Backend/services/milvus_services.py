from fastapi.responses import JSONResponse
import numpy as np
from pymilvus import Collection, DataType, MilvusException, connections, model
from model import *
import json


def connect(request: ConnectRequest) -> bool:
    try:
        milvus_client = MilvusClientSingleton(uri=request.uri)
        return JSONResponse(
            status_code=200, content="Successfully connected to Milvus Server."
        )
        
    except MilvusException as ex:
        return JSONResponse(
            status_code=400, content="Failed to connect to Milvus Server!"
        )


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
        except MilvusException as ex:
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


def delete_db(db_name: str):
    milvus_client = MilvusClientSingleton._instance
    if milvus_client is not None:
        try:
            milvus_client.drop_database(db_name=db_name)
            return JSONResponse(
                status_code=200, content=f"Successfully dropped {db_name} database."
            )
        except MilvusException as ex:
            return JSONResponse(
                status_code=200,
                content=f"Database {db_name} is not empty. Please drop collections first!",
            )
    else:
        return JSONResponse(
            status_code=400, content="Failed to connect to Milvus Server!"
        )


def get_all_collections(db_name: str) -> list[str]:
    # milvus_client = MilvusClientSingleton.get_instance(uri_request.uri)
    milvus_client = MilvusClientSingleton._instance
    if milvus_client is not None:
        try:
            milvus_client.using_database(db_name=db_name)
            collections = milvus_client.list_collections()
            collections_info = []
            for col in collections:
                col_inf = milvus_client.describe_collection(collection_name=col)
                row_count = milvus_client.get_collection_stats(collection_name=col)
                state = milvus_client.get_load_state(collection_name=col)
                is_loaded = "Loaded" in str(state)
                collections_info.append(
                    CollectionResponse(
                        name=col_inf.get("collection_name"),
                        row_count=row_count.get("row_count"),
                        loaded=is_loaded,
                    ).model_dump()
                )
            return JSONResponse(status_code=200, content=collections_info)
        except MilvusException as ex:
            print(ex)
            return JSONResponse(
                status_code=400, content=f"{db_name} database does not exists!"
            )
    else:
        return JSONResponse(
            status_code=400, content="Failed to connect to Milvus Server!"
        )


def create_collection(db_name: str, request: CollectionRequest):
    milvus_client = MilvusClientSingleton._instance
    if milvus_client is not None:
        try:
            milvus_client.using_database(db_name=db_name)
            if milvus_client.has_collection(collection_name=request.name):
                return JSONResponse(
                    status_code=400,
                    content=f"Collection {request.name} already exists!",
                )
            schema = milvus_client.create_schema(
                auto_id=True, enable_dynamic_field=False
            )
            schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
            schema.add_field(
                field_name="vector",
                datatype=DataType.FLOAT_VECTOR,
                dim=384,
                description="Vector representation of text",
            )
            schema.add_field(
                field_name="text",
                datatype=DataType.VARCHAR,
                max_length=2500,
                description="Original text",
            )
            schema.add_field(
                field_name="metadata",
                datatype=DataType.JSON,
            )
            index_params = milvus_client.prepare_index_params()
            index_params.add_index(
                field_name="vector",
                index_name="vector_index",
                index_type=request.index_type.value,
                metric_type=index_metrics.get(request.index_type),
                params=request.index_params,
            )
            milvus_client.create_collection(
                collection_name=request.name,
                schema=schema,
                index_params=index_params,
            )
            # milvus_client.load_collection(
            #     collection_name=request.name, replica_number=1
            # )
            return JSONResponse(
                status_code=200,
                content=f"Successfully created {request.name} collection.",
            )
        except MilvusException as ex:
            return JSONResponse(status_code=400, content=f"{ex.message}")

    else:
        return JSONResponse(
            status_code=400, content="Failed to connect to Milvus Server!"
        )


def delete_collection(db_name: str, collection_name: str):
    milvus_client = MilvusClientSingleton._instance
    if milvus_client is not None:
        try:
            milvus_client.using_database(db_name=db_name)
            if milvus_client.has_collection(collection_name=collection_name):
                milvus_client.drop_collection(collection_name=collection_name)
                return JSONResponse(
                    status_code=200,
                    content=f"Successfully dropped {collection_name} collection.",
                )
            else:
                return JSONResponse(
                    status_code=400,
                    content=f"Collection {collection_name} does not exist in {db_name} database!",
                )
        except MilvusException as ex:
            return JSONResponse(status_code=400, content=f"{ex.message}")

    else:
        return JSONResponse(
            status_code=400, content="Failed to connect to Milvus Server!"
        )


def load_collection(db_name: str, collection_name: str):
    milvus_client = MilvusClientSingleton._instance
    if milvus_client is not None:
        try:
            milvus_client.using_database(db_name=db_name)
            if milvus_client.has_collection(collection_name=collection_name):
                state = milvus_client.get_load_state(collection_name=collection_name)
                is_loaded = "Loaded" in str(state)
                if not is_loaded:
                    milvus_client.load_collection(collection_name=collection_name)
                    return JSONResponse(
                        status_code=200,
                        content=f"Successfully loaded {collection_name} collection.",
                    )
                else:
                    milvus_client.release_collection(collection_name=collection_name)
                    return JSONResponse(
                        status_code=200,
                        content=f"Successfully released {collection_name} collection.",
                    )
            else:
                return JSONResponse(
                    status_code=400,
                    content=f"Collection {collection_name} does not exist in {db_name} database!",
                )
        except MilvusException as ex:
            return JSONResponse(status_code=400, content=f"{ex}")

    else:
        return JSONResponse(
            status_code=400, content="Failed to connect to Milvus Server!"
        )


def get_collection_data(db_name: str, collection_name: str, limit: int, offset: int):
    milvus_client = MilvusClientSingleton._instance
    if milvus_client is not None:
        try:
            milvus_client.using_database(db_name=db_name)
            if milvus_client.has_collection(collection_name=collection_name):
                query_result = milvus_client.query(
                    collection_name=collection_name,
                    filter="id >= 0",
                    output_fields=["id", "vector", "text", "metadata"],
                    limit=limit,
                    offset=offset,
                )
                cleaned_result = convert_float32_to_float(query_result)
                # total_records = milvus_client.get_collection_stats(
                #     collection_name=collection_name
                # )
                # index_info = milvus_client.describe_index(collection_name="Prva", index_name="vector_index")
                all_records = milvus_client.query(
                    collection_name=collection_name, filter="id >= 0"
                )
                return JSONResponse(
                    status_code=200,
                    content={
                        "data": cleaned_result,
                        "limit": limit,
                        "offset": offset,
                        "total_records": len(all_records),
                        # "total_records": total_records.get("row_count"),
                    },
                )
            else:
                return JSONResponse(
                    status_code=400,
                    content=f"Collection {collection_name} does not exist in {db_name} database!",
                )
        except MilvusException as ex:
            return JSONResponse(status_code=400, content=f"{ex.message}")

    else:
        return JSONResponse(
            status_code=400, content="Failed to connect to Milvus Server!"
        )


def insert_data(db_name: str, collection_name: str, request: CollectionDataRequest):
    milvus_client = MilvusClientSingleton._instance
    if milvus_client is not None:
        try:
            milvus_client.using_database(db_name=db_name)
            if milvus_client.has_collection(collection_name=collection_name):
                sentence_transformer_ef = (
                    model.dense.SentenceTransformerEmbeddingFunction(
                        model_name="all-MiniLM-L6-v2",
                        device="cpu",
                    )
                )
                vector_embedding = sentence_transformer_ef.encode_documents(
                    [request.text]
                )
                data = {
                    "text": request.text,
                    "vector": vector_embedding[0],
                    "metadata": request.metadata,
                }

                insert_result = milvus_client.insert(
                    collection_name=collection_name,
                    data=data,
                )
                cleaned_data = convert_float32_to_float(data)
                return JSONResponse(
                    status_code=200,
                    content=cleaned_data,
                )
            else:
                return JSONResponse(
                    status_code=400,
                    content=f"Collection {collection_name} does not exist in {db_name} database!",
                )
        except MilvusException as ex:
            return JSONResponse(status_code=400, content=f"{ex.message}")
    else:
        return JSONResponse(
            status_code=400, content="Failed to connect to Milvus Server!"
        )


def delete_data(db_name: str, collection_name: str, request: DeleteCollectionDataRequest):
    milvus_client = MilvusClientSingleton._instance
    if milvus_client is not None:
        try:
            milvus_client.using_database(db_name=db_name)
            if milvus_client.has_collection(collection_name=collection_name):
                result = milvus_client.delete(collection_name=collection_name, ids=request.ids)
                return JSONResponse(
                    status_code=200,
                    content=f"Successfully deleted {result.get("delete_count")} records",
                )
            else:
                return JSONResponse(
                    status_code=400,
                    content=f"Collection {collection_name} does not exist in {db_name} database!",
                )
        except MilvusException as ex:
            return JSONResponse(status_code=400, content=f"{ex.message}")
    else:
        return JSONResponse(
            status_code=400, content="Failed to connect to Milvus Server!"
        )

def similarity_search(db_name: str, collection_name: str, request: SearchRequest):
    milvus_client = MilvusClientSingleton._instance
    if milvus_client is not None:
        try:
            milvus_client.using_database(db_name=db_name)
            if milvus_client.has_collection(collection_name=collection_name):
                sentence_transformer_ef = (
                    model.dense.SentenceTransformerEmbeddingFunction(
                        model_name="all-MiniLM-L6-v2",
                        device="cpu",
                    )
                )
                query_vector = sentence_transformer_ef.encode_documents(
                    [request.text]
                )
                index_info = milvus_client.describe_index(collection_name="Prva", index_name="vector_index")
                search_params = {
                    "metric_type": index_info.get("metric_type"), 
                }
                search_result = milvus_client.search(
                    
                    collection_name=collection_name,
                    data=[query_vector[0]],
                    search_params=search_params,
                    output_fields=["id", "text", "metadata"],
                    limit=request.limit
                )
                return JSONResponse(
                    status_code=200,
                    content=search_result,
                )
            else:
                return JSONResponse(
                    status_code=400,
                    content=f"Collection {collection_name} does not exist in {db_name} database!",
                )
        except MilvusException as ex:
            return JSONResponse(status_code=400, content=f"{ex.message}")
    else:
        return JSONResponse(
            status_code=400, content="Failed to connect to Milvus Server!"
        )
    
    
def convert_float32_to_float(obj):
    if isinstance(obj, np.ndarray):
        return obj.astype(float).tolist()
    elif isinstance(obj, dict):
        return {key: convert_float32_to_float(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_float32_to_float(item) for item in obj]
    elif isinstance(obj, np.float32):
        return float(obj)
    else:
        return obj
