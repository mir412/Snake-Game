import tkinter #graphics user interface libary
import random

ROWS = 25 
COLS = 25 #column
TILE_SIZE = 25

WINDOW_WIDTH = TILE_SIZE * ROWS
WINDOW_HEIGHT = TILE_SIZE * COLS

#game window
window = tkinter.Tk()
window.title("Snake") #WINDOW TITLE AT THE TOP SNAKE GAME 
window.resizable(False, False) #NOT ABLE TO RESIZE THE SNAKE GAME 

class Tile:  # use fpor storing my x and y positions for food
    def __init__(self, x, y):
        self.x = x
        self.y = y


canvas = tkinter.Canvas(window, bg = "black", width = WINDOW_WIDTH, height = WINDOW_HEIGHT, borderwidth = 0, highlightthickness = 0) #makes a bigger window using Canvas and tkinter
canvas.pack()
window.update()


#center the window
window_width = window.winfo_width()  # both window deminsions
window_height = window.winfo_height()
screen_width = window.winfo_screenwidth() # screen deminsions
screen_height = window.winfo_screenheight()

window_x = int((screen_width/2) - (window_width/2))
window_y = int((screen_height/2) - (window_height/2))
#format "(w)x(h)+(x)+(y)"
window.geometry(f"{window_width}x{window_height}+{window_x}+{window_y}") # f string makes the variables as strings 

#initialize game 
snake = Tile(5*TILE_SIZE, 5*TILE_SIZE) #singles tile . snakes head
food = Tile(10*TILE_SIZE, 10*TILE_SIZE)
snake_body = [] #multiple tile objects
velocityX = 0
velocityY = 0
game_over = False
score = 0


def change_direction(e): #e = event
    #print(e)
    #print(e.keysym) # registers each key you press
    global velocityX, velocityY, game_over
    if (game_over):
        return

    if (e.keysym == "Up" and velocityY != 1):
        velocityX = 0
        velocityY = -1
    elif (e.keysym == "Down" and velocityY != -1):
        velocityX = 0
        velocityY = 1
    elif (e.keysym == "Left" and velocityX != 1):
        velocityX = -1
        velocityY = 0
    elif (e.keysym == "Right" and velocityX != -1):
        velocityX = 1
        velocityY = 0

def move(): #moving the snake function=
    global snake, food , snake_body, game_over, score#has to make it into a global variabkle
    if (game_over): # snake will stop moving
        return
    
    if (snake.x < 0 or snake.x >=  WINDOW_WIDTH or snake.y < 0 or snake.y >= WINDOW_HEIGHT):
        game_over = True
        return
    
    for tile in snake_body:
        if(snake.x == tile.x and snake.y == tile.y):
            game_over = True
            return
            

    #collision

    if (snake.x == food.x and snake.y == food.y):  #math when collision happens
        snake_body.append(Tile(food.x, food.y))
        food.x = random.randint(0, COLS-1) * TILE_SIZE
        food.y = random.randint(0, ROWS-1) * TILE_SIZE
        score += 1 #adds 1 when getting food


    #updat snake body
    for i in range(len(snake_body)-1, -1, -1):
        tile = snake_body[i]
        if (i == 0):
            tile.x = snake.x
            tile.y = snake.y
        else:
            prev_tile = snake_body[i-1]
            tile.x = prev_tile.x 
            tile.y = prev_tile.y 


    snake.x += velocityX * TILE_SIZE #mutiply by tile size because if not it will multiple pixle
    snake.y += velocityY * TILE_SIZE

def draw():
    global snake, food, snake_body, gamne_over, score #not nesseccary only when assigning a variable
    move() #moving 10 frames per secound by being inside the draw table

    canvas.delete("all")


    #DRAW FOOD
    canvas.create_rectangle(food.x, food.y, food.x + TILE_SIZE, food.y + TILE_SIZE, fill = "red")


    #draw snake
    canvas.create_rectangle(snake.x, snake.y, snake.x + TILE_SIZE, snake.y + TILE_SIZE, fill = "lime green")

    for tile in snake_body:
        canvas.create_rectangle(tile.x, tile.y, tile.x + TILE_SIZE, tile.y + TILE_SIZE, fill ="lime green")
    
    if (game_over):
        canvas.create_text(WINDOW_WIDTH/2, WINDOW_HEIGHT/2, font = "Arial 20", text =  f"Game Over {score}",  fill = "white")
    else:
        canvas.create_text(30, 20, font = "Arial 10", text = f"Score: {score}", fill = "white") 
                           

    window.after(100, draw) #100 ms = 1/10 secound, 10 frames/secound

draw()

window.bind("<KeyRelease>", change_direction) #keyrelease means [press any key it lets go 
window.mainloop() # keeps the window on
