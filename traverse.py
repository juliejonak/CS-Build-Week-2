import os
import time
import requests
from utils import Stack, Queue

key = os.environ['KEY']

# Response from server
# {
#   "room_id": 10,
#   "title": "A Dark Room",
#   "description": "You cannot see anything.",
#   "coordinates": "(60,61)",
#   "exits": ["n", "s", "w"],
#   "cooldown": 100.0,
#   "errors": [],
#   "messages": ["You have walked north."]
# }

# SEND to server to move
# {"direction":"s", "next_room_id": "0"}

# MOVE

# headers = {
#     'Authorization': f"Token {os.environ["KEY"]}",
#     'Content-Type': 'application/json',
# }

# data = '{"direction":"s", "next_room_id": "0"}'

# response = requests.post('https://lambda-treasure-hunt.herokuapp.com/api/adv/move/', headers=headers, data=data)


print(f"KEY: {key}")

def traverseMap(key):
    """
    Returns a map of rooms and exits found when traversing a maze using server calls
    
    :param dict roomGraph: Graph of the world map to traverse  -- NEED TO REMOVE/MAKE UNNECESSARY
    :param player: Instance of the player class moving through the map   
    """
    # Call to initialize the game
    headers = {
        'Authorization': f"Token {key}",
        'Content-Type': 'application/json',
    }

    response = requests.get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/', headers=headers)
    data = response.json()

    # print(f"Initializing game response. Curr_room: {data['room_id']}, Room title: {data['title']}, Description: {data['description']}, Coordinates: {data['coordinates']}, EXITS: {data['exits']}, Cooldown: {data['cooldown']}, Errors: {data['errors']}, Message: {data['messages']}")

    time.sleep(data['cooldown'])

    # Tracks the shortest path through the maze?
    traversalPath = []
    # Keeps track of the current room player is in
    curr_room = data['room_id']

    # Creates a map of rooms visited
    map = {
        0: { 'n': '?', 's': '?', 'e': '?', 'w': '?', 'title': data['title']}
    }

    s = Stack()
    s.push( curr_room )
    last_room = 0
    last_move = ''

    # while len < 500 (number of rooms)
    while len(map) < 500:

        to_move = ''

        for key in map[curr_room].items():
            if key == '?':
                to_move = key
                break
        
        if to_move:
            # MOVE
            # IF NOT IN MAP
                # Iterate over data['exits'] and set room to map
            # IF IN MAP
                # Keep moving
            pass
        
        else:
            # BFS to find nearest unexplored exit
            pass

        if curr_room not in map:
            map[curr_room] = { 'n': '?', 's': '?', 'e': '?', 'w': '?', 'title': data['title']}

            # TODO: Make server call to move. Since no access to exits, check response. if 'n'/'s'/'e'/'w' not in res.exits (a list) 

            # traversalPath.append('n')
            # CALL TO MOVE
            # last_move = 'n'
            # last_room = player.currentRoom.id
            # if direction not in res.exits, map[player.currentRoom.id][direction] = None
            # USE time.sleep(res.cooldown) to force it to wait for the cooldown period before hitting the server again

            # Checks for any exits that are dead ends and marks them as None in map
            if curr_room.n_to == None:
                map[curr_room.id]['n'] = None
            if curr_room.s_to == None:
                map[curr_room.id]['s'] = None
            if curr_room.e_to == None:
                map[curr_room.id]['e'] = None
            if curr_room.w_to == None:
                map[curr_room.id]['w'] = None
        
        # Updates last room with direction moved
        for i in range(0,1):
            if last_move == 'n':
                map[curr_room.id]['s'] = last_room
            elif last_move == 's':
                map[curr_room.id]['n'] = last_room
            elif last_move == 'e':
                map[curr_room.id]['w'] = last_room
            elif last_move == 'w':
                map[curr_room.id]['e'] = last_room

        # depending on direction moved, adds to traversalPath, and records last move/room, moves player
        if map[curr_room.id]['n'] == '?':
            traversalPath.append('n')
            map[curr_room.id]['n'] = curr_room.n_to.id
            last_move = 'n'
            last_room = curr_room.id
            player.travel('n')
            
        elif map[curr_room.id]['s'] == '?':
            traversalPath.append('s')
            map[curr_room.id]['s'] = curr_room.s_to.id
            last_move = 's'
            last_room = curr_room.id
            player.travel('s')

        elif map[curr_room.id]['e'] == '?':
            traversalPath.append('e')
            map[curr_room.id]['e'] = curr_room.e_to.id
            last_move = 'e'
            last_room = curr_room.id
            player.travel('e')
            
        elif map[curr_room.id]['w'] == '?':
            traversalPath.append('w')
            map[curr_room.id]['w'] = curr_room.w_to.id
            last_move = 'w'
            last_room = curr_room.id
            player.travel('w')

        else:
            # if all rooms now visited, end
            if len(map) == 500:
                break

            # TODO: Replace roomGraph with a call to the server to find next viable path?
            # BFS to nearest unexplored exit and appends to traversalPath
            next_path = find_nearest_unexplored(curr_room, roomGraph, map)

            # Adds shortest path to next unexplored to traversalPath
            # Moves player through those rooms
            for direction in next_path["path"]:
                player.travel(direction)
                traversalPath.append(direction)
            
            last_move = next_path["path"][-1]
                        
            # Updates map with newly explored rooms
            map = next_path["updated_map"]

            # updates last room based on final move in BFS array returned
            if last_move == 'n':
                last_room = map[player.currentRoom.id]['s']
            elif last_move == 's':
                last_room = map[player.currentRoom.id]['n']
            elif last_move == 'e':
                last_room = map[player.currentRoom.id]['w']
            elif last_move == 'w':
                last_room = map[player.currentRoom.id]['e']
            
    return map


def find_nearest_unexplored(curr_room, graph, map):
    """
    Returns object { "room": integer, "path": list, updated_map: dict }
    
    :param int curr_room: Current room player is in  
    :param dict graph: Graph of the world map to traverse  
    :param dict map: Dictionary containing found rooms and exits  
    """
    # `graph` needs to be replaced with call to move on server
    # DOWNSIDE TO BFS: cool down will make this take ages -- can only check one direction at a time plus have to move back.
    # Need to set a timeout to prevent penalties for hitting server too quickly
    # USE time.sleep(res.cooldown) to force it to wait for the cooldown period before hitting the server again
    # If we can send back next room, 50% reduction : {"direction":"s", "next_room_id": "0"}
    visited = {}
    q = Queue()
    q.enqueue( { "room": curr_room, "path": [] } )
    path_found = False
    chosen_path = None

    while not path_found:
        
        check = q.dequeue()
        curr_path = check["path"]
        curr_room2 = check["room"]

        # check all directions of current room
        # if next room has "?", make new path
        # if not, append and keep checking
        for key, value in map[curr_room2].items():
            # key: direction, value: room number
            if value == '?':
                curr_path.append(key)
                chosen_path = curr_path
                path_found = True
                break

            if value != None and value not in visited:
                path_copy = list(curr_path)
                path_copy.append(key)
                visited[value] = { "room": value, "path": path_copy }
                q.enqueue(visited[value])

    for direction in chosen_path:
        # Sets the next room to be the direction we'll traverse in
        next_room = graph[curr_room][1][direction]

        if next_room not in map:
            # updates map[curr_room][direction] to next_room to mark as visited
            map[curr_room][direction] = next_room
            # Adds the next room to map as well
            map[next_room] = { 'n': '?', 's': '?', 'e': '?', 'w': '?'}

            # Checks for non-valid exits to update in map so only viable un-explored exits are marked '?'
            if 'n' not in graph[next_room][1]:
                map[next_room]['n'] = None
            if 's' not in graph[next_room][1]:
                map[next_room]['s'] = None
            if 'e' not in graph[next_room][1]:
                map[next_room]['e'] = None
            if 'w' not in graph[next_room][1]:
                map[next_room]['w'] = None
            
            # Sets the curr_room to next_room
            if direction == 'n':
                map[next_room]['s'] = curr_room
            if direction == 's':
                map[next_room]['n'] = curr_room
            if direction == 'e':
                map[next_room]['w'] = curr_room
            if direction == 'w':
                map[next_room]['e'] = curr_room
            
            curr_room = next_room

        else:
            curr_room = next_room

    return { "room": curr_room, "path": chosen_path, "updated_map": map}

traverseMap(key)