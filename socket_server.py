#!/usr/bin/env python

# WS server example

#mafia socket server

import asyncio
import websockets
from pymongo import MongoClient
import random

def sessionActive(db):
    for a in db.mafia.find():
        active = a["game_session"]
    if(active == "active"):
        return True
    else:
        return False

def getnumPlayers(db):
    for a in db.mafia.find():
        players = a["players"]
    return int(players)

def setRoles(db):
    if getnumPlayers(db) == 4:
        roles = ['mafia','doctor','sheriff','civilian']
    elif getnumPlayers(db) == 5:
        roles = ['mafia','doctor','sheriff','civilian','civilian']
    elif getnumPlayers(db) == 6:
        roles = ['mafia','mafia','doctor','sheriff','civilian','civilian']
    elif getnumPlayers(db) == 7:
        roles = ['mafia','mafia','doctor','sheriff','civilian','civilian','civilian']
    elif getnumPlayers(db) == 8:
        roles = ['mafia','mafia','doctor','sheriff','civilian','civilian','civilian','civilian']
    elif getnumPlayers(db) == 9:
        roles = ['mafia','mafia','mafia','doctor','sheriff','civilian','civilian','civilian','civilian']
    elif getnumPlayers(db) == 10:
        roles = ['mafia','mafia','mafia','doctor','sheriff','civilian','civilian','civilian','civilian','civilian']
    else:
        roles = ['mafia','mafia','mafia','doctor','sheriff']
        for i in range(0,getnumPlayers(db)-5):
            roles.append('civilian')
    return roles

def getRole(db):
    for a in db.mafia.find():
        roles = a["roles"]
    role = roles.pop()
    myquery = {"id": 13579}
    newvalues = { "$set": {"roles": roles,"game_session":"active"}}
    db.mafia.update_one(myquery, newvalues)
    return role



async def main(websocket, path):
    mongo_client = MongoClient("mongodb://root:admin123@ds237660.mlab.com:37660/test_db")
    db = mongo_client.test_db

    players = getnumPlayers(db)

    message = await websocket.recv()

    if message == "newPlayer":
        myquery = {"id": 13579}
        newvalues = {"$set": {"players": players+1}}
        db.mafia.update_one(myquery, newvalues)
        await websocket.send(str(getnumPlayers(db)))

    if message == "resetGame":
        myquery = {"id": 13579}
        newvalues = { "$set": {"players": 0, "roles":[], "player_roles":[], "game_session":"inactive"}}
        db.mafia.update_one(myquery, newvalues)
        await websocket.send(str(getnumPlayers(db)))

    if message == "howmanyPlayers":
        await websocket.send(str(getnumPlayers(db)))

    if message == "gameReady":
        if sessionActive(db) is False:
            roles = setRoles(db)
            myquery = {"id": 13579}
            newvalues = { "$set": {"roles": roles,"game_session":"active"}}
            db.mafia.update_one(myquery, newvalues)
    
    if message.split(":")[0] == "processName":
        for a in db.mafia.find():
            playerList = a["player_roles"]
        myquery = {"id": 13579}
        key = message.split(":")[1]
        value = getRole(db)
        playerList.append({key:value})
        newvalues = { "$set": {"player_roles":playerList}}
        db.mafia.update_one(myquery, newvalues)
        await websocket.send(str(value))

    if message == "getPlayers":
        final_list = ""
        for a in db.mafia.find():
            playerList = a["player_roles"]
            roles = a["roles"]
        if len(roles) == 0:
            allPlayers = []
            for things in playerList:
                string_thing = str(things)
                string_thing = string_thing.replace("{","")
                string_thing = string_thing.replace('"',"")
                string_thing = string_thing.replace("'","")
                allPlayers.append(string_thing.split(":")[0])
            for i in range(0,len(allPlayers)):
                if(i == len(allPlayers)-1):
                    final_list = final_list + allPlayers[i]
                else:
                    final_list = final_list + allPlayers[i] + ","
            await websocket.send(final_list)
        else:
            await websocket.send("wait")

    if message.split(":")[0] == "investigate":
        for a in db.mafia.find():
            playerList = a["player_roles"]
        allPlayers = []
        allRoles = []
        for things in playerList:
            string_thing = str(things)
            string_thing = string_thing.replace("{","")
            string_thing = string_thing.replace('"',"")
            string_thing = string_thing.replace("'","")
            allPlayers.append(string_thing.split(":")[0])
            allRoles.append(string_thing.split(":")[1])
        await websocket.send(allRoles[allPlayers.index(message.split(":")[1].replace("}",""))])

    # if message.split(":")[0] == "playRound":
    #     if message.split(":")[1] == "mafia":
    #         #how do I process this information???



start_server = websockets.serve(main, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()