from fastapi import FastAPI
import uvicorn

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

# Return OK or NOTOK to Validator client
@app.get("/validate")
async def root():
    return {"message": "Hello World"}

# Get info from NODERED VALIDATOR and store in DB
@app.get("/storeweight")
async def root():
    return {"message": "Hello World"}

# Frontend

if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, log_level="info")
