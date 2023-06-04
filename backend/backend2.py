from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import json
import random

app = FastAPI()

f = open('config.json')
data = json.load(f)

PACKAGE = data["PACKAGE_OBJECT_ID"]
GAMEINFO = data["GAMEINFO"]
PLAYER = data["PLAYER_ADDRESS"]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with the specific origins you want to allow
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/add_item")
def add_item():
    equipment_type = random.randint(1,5)
    command_str = "sui client call --package " + PACKAGE + " --module purchase --function add_item --args "+ GAMEINFO + " " + str(equipment_type) + " --gas-budget 10000000" 
    os.system(command_str)
    os.system("sh ./test.sh")
    return 1

@app.get("/transfer")
def transfer_item(item):
    command_str = "sui client call --package " + PACKAGE + " --module purchase --function transfer_item --args "+ item +" "+ PLAYER + " --gas-budget 10000000"
    os.system(command_str)

if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=1234)
