from fastapi import FastAPI
from fastapi.responses import JSONResponse
from model import *
from services.milvus_services import *

app = FastAPI(title="Milvus_UI", root_path="/api/v1")

@app.post("/connect")
def connect_to_milvus(request: ConnectRequest) -> JSONResponse:
    return connect(request)
    
@app.post("/databases")
def create_database(request: DatabaseRequest):
    return create_db(request)     
    
@app.get("/databases")
def get_all(): 
    return get_all_databases()

@app.get("/connections/{database}")
def get_all(database: str):
    return get_all_collections(database)