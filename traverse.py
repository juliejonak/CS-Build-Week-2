import requests
import os
from utils.py import Stack, Queue

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

# Initial Call

headers = {
    'Authorization': f"Token {os.environ["KEY"]}",
}

response = requests.get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/', headers=headers)

# MOVE

headers = {
    'Authorization': f"Token {os.environ["KEY"]}",
    'Content-Type': 'application/json',
}

data = '{"direction":"s", "next_room_id": "0"}'

response = requests.post('https://lambda-treasure-hunt.herokuapp.com/api/adv/move/', headers=headers, data=data)


def traverseMap(roomGraph, player):
    """
    Returns list of directions to move
    
    :param dict roomGraph: Graph of the world map to traverse  
    :param player: Instance of the player class moving through the map   
    """
    traversalPath = []

    # Create a map of rooms visited
    map = {
        0: { 'n': '?', 's': '?', 'e': '?', 'w': '?'}
    }

    s = Stack()
    s.push( player.currentRoom.id )
    last_room = 0
    last_move = ''

    # while len < 500 (number of rooms)
    while len(map) < 500:

        if player.currentRoom.id not in map:
            map[player.currentRoom.id] = { 'n': '?', 's': '?', 'e': '?', 'w': '?'}

            # TODO: Make servere call to move. Since no access to exits, check response. if 'n'/'s'/'e'/'w' not in res.exits (a list) 

            # traversalPath.append('n')
            # CALL TO MOVE
            # last_move = 'n'
            # last_room = player.currentRoom.id
            # if direction not in res.exits, map[player.currentRoom.id][direction] = None

            # Checks for any exits that are dead ends and marks them as None in map
            if player.currentRoom.n_to == None:
                map[player.currentRoom.id]['n'] = None
            if player.currentRoom.s_to == None:
                map[player.currentRoom.id]['s'] = None
            if player.currentRoom.e_to == None:
                map[player.currentRoom.id]['e'] = None
            if player.currentRoom.w_to == None:
                map[player.currentRoom.id]['w'] = None
        
        # Updates last room with direction moved
        for i in range(0,1):
            if last_move == 'n':
                map[player.currentRoom.id]['s'] = last_room
            elif last_move == 's':
                map[player.currentRoom.id]['n'] = last_room
            elif last_move == 'e':
                map[player.currentRoom.id]['w'] = last_room
            elif last_move == 'w':
                map[player.currentRoom.id]['e'] = last_room

        # depending on direction moved, adds to traversalPath, and records last move/room, moves player
        if map[player.currentRoom.id]['n'] == '?':
            traversalPath.append('n')
            map[player.currentRoom.id]['n'] = player.currentRoom.n_to.id
            last_move = 'n'
            last_room = player.currentRoom.id
            player.travel('n')
            
        elif map[player.currentRoom.id]['s'] == '?':
            traversalPath.append('s')
            map[player.currentRoom.id]['s'] = player.currentRoom.s_to.id
            last_move = 's'
            last_room = player.currentRoom.id
            player.travel('s')

        elif map[player.currentRoom.id]['e'] == '?':
            traversalPath.append('e')
            map[player.currentRoom.id]['e'] = player.currentRoom.e_to.id
            last_move = 'e'
            last_room = player.currentRoom.id
            player.travel('e')
            
        elif map[player.currentRoom.id]['w'] == '?':
            traversalPath.append('w')
            map[player.currentRoom.id]['w'] = player.currentRoom.w_to.id
            last_move = 'w'
            last_room = player.currentRoom.id
            player.travel('w')

        else:
            # if all rooms now visited, end
            if len(map) == 500:
                break

            # TODO: Replace roomGraph with a call to the server to find next viable path?
            # BFS to nearest unexplored exit and appends to traversalPath
            next_path = find_nearest_unexplored(player.currentRoom.id, roomGraph, map)

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
            
    return traversalPath


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