from pymilvus import MilvusClient


class MilvusClientSingleton:
    _instance = None

    def __new__(cls, uri):
        if cls._instance is None:
            try:
                cls._instance = MilvusClient(uri=uri)
            except Exception as ex:
                raise ex
        return cls._instance

    @staticmethod
    def get_instance(uri: str = None):
        if MilvusClientSingleton._instance is None:
            MilvusClientSingleton(uri)
        return MilvusClientSingleton._instance
