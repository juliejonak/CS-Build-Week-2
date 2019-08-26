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


def traverseMap(key, graph=None):
    """
    Returns a map of rooms and exits found when traversing a maze using server calls
    
    :param key: API key to send request to server
    :param graph: Optional -- pass in currently explored map to add to   
    """
    # Call to initialize the game
    headers = {
        'Authorization': f"Token {key}",
        'Content-Type': 'application/json',
    }

    init_response = requests.get(
        'https://lambda-treasure-hunt.herokuapp.com/api/adv/init/', headers=headers)
    init_data = init_response.json()

    # print(f"Initializing game response. Curr_room: {init_data['room_id']}, Room title: {init_data['title']}, Description: init_{data['description']}, Coordinates: {init_data['coordinates']}, EXITS: {init_data['exits']}, Cooldown: {init_data['cooldown']}, Errors: init_{data['errors']}, Message: {init_data['messages']}")

    time.sleep(init_data['cooldown'])

    # Keeps track of the current room player is in
    curr_room = init_data['room_id']
    print(f"Currently in room {curr_room}")

    # If no passed in graph, creates a map of rooms visited
    if graph == None:
        map = {
            0: { 'n': '?', 's': 2, 'e': '?', 'w': '?', 'title': init_data['title']},
            2: { 'n': 0, 's': '?', 'e': 3, 'w': None, 'title': "A Dark Room"},
            3: { 'n': None, 's': '?', 'e': 3, 'w': 2, 'title': "A Dark Room"}
        }
    else:
        # Otherwise sets map = to the passed graph parameter
        map = graph

    s = Stack()
    s.push(curr_room)
    last_room = 0

    # while len < 500 (number of rooms)
    while len(map) < 500:

        # Set next direction to move based on first ? unexplored exit found in curr_room
        to_move = ''

        for key, value in map[curr_room].items():
            if value == '?':
                to_move = key
                break

        print(f"Next move is: {to_move}")

        # If unexplored exit found, move that way
        if to_move:
            # Create move object (no next room guess because it's ?)
            move = { 'direction': f'{key}' }
            print(f"Send move looks like: {move}. Headers: {headers}")

            # TODO: DEBUG: This request is formatted properly but returning a 500 with the json parse error:
            # json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)
            # When tested in Postman with the same exact request, the reponse is successful

            # Sends request to move to server         
            move_res = requests.post('https://lambda-treasure-hunt.herokuapp.com/api/adv/move/', headers=headers, data=move)
            print(f"Move response looks like: {move_res}")
            # Parses response
            data = move_res.json()
            print(f"Parsed response is: {data}")

            # TODO: Add error handling for non-200 response or if data['errors'] contains a message
            # TODO: Add map and room information to localStorage

            # Before updating curr_room, set direction moved to room_id, to update map's known exits
            map[curr_room][to_move] = data['room_id']
            # Sets last room to current
            last_room = curr_room

            # Sets curr_room to room moved to
            curr_room = data['room_id']

            # IF curr_room NOT IN MAP
            if curr_room not in map:
                # Create a new object for it in map
                map[curr_room] = {'n': None, 's': None,
                                  'e': None, 'w': None, 'title': data['title']}

                # Iterate over data['exits'] and set viable exits to room in map
                for item in data['exits']:
                    map[curr_room][item] = '?'

            # IF IN MAP
                # Keep moving

            # Add previous room to current room, based on last direction moved
            if to_move == 'n':
                map[curr_room]['s'] = last_room
            elif to_move == 's':
                map[curr_room]['n'] = last_room
            elif to_move == 'e':
                map[curr_room]['w'] = last_room
            elif to_move == 'w':
                map[curr_room]['e'] = last_room

            # If now found all rooms, end while loop
            # TODO: Pickup any treasure found
            # TODO: Build an explore function if we've found all 500 rooms (find a specific number room?)
            if len(map) == 500:
                break

            else:
                # time out until cooldown period has passed
                time.sleep(data['cooldown'])

        # If no unexplored exits found, need to BFS to find nearest
        else:
            # Return that player found dead end
            return f"Dead end found! Find nearest unexplored exit or return to Pirate Ry's shop?"
            
    # TODO: Should we return the map or just update localStorage?
    return map


updated_map = traverseMap(key)
print(updated_map)


# TODO: Fix this BFS function for treasure hunt purposes, remove player and graph references, add server calls
def find_nearest_unexplored(curr_room, map):
    """
    Returns object { "room": integer, "path": list, updated_map: dict }

    :param int curr_room: Current room player is in  
    :param dict graph: Graph of the world map to traverse -- REMOVE
    :param dict map: Dictionary containing found rooms and exits  
    """
    # `graph` needs to be replaced with call to move on server
    # DOWNSIDE TO BFS: cool down will make this take ages -- can only check one direction at a time plus have to move back.
    # Need to set a timeout to prevent penalties for hitting server too quickly
    # USE time.sleep(res.cooldown) to force it to wait for the cooldown period before hitting the server again
    # If we can send back next room, 50% reduction : {"direction":"s", "next_room_id": "0"}
    visited = {}
    q = Queue()
    q.enqueue({"room": curr_room, "path": []})
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
                visited[value] = {"room": value, "path": path_copy}
                q.enqueue(visited[value])

    for direction in chosen_path:
        # Sets the next room to be the direction we'll traverse in
        next_room = graph[curr_room][1][direction]

        if next_room not in map:
            # updates map[curr_room][direction] to next_room to mark as visited
            map[curr_room][direction] = next_room
            # Adds the next room to map as well
            map[next_room] = {'n': '?', 's': '?', 'e': '?', 'w': '?'}

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

    return {"room": curr_room, "path": chosen_path, "updated_map": map}
