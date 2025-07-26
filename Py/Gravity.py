import pygame
import sys
import numpy
pygame.init()

WIDTH, HEIGHT = 1080, 620
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Empty Pygame Window")
wMid = WIDTH / 2
hMid = HEIGHT / 2

clock = pygame.time.Clock()

class Gravity:
    def __init__(self, y, initVelo = 0):
        self.y = y
        self.velo = initVelo
        self.gravity = 9.81

    def update(self, dt):
        print("test ")

# Class for making points
class Vertex:
    # Initialize x, y, and z coordinates
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z

    # Drawing the Vertices of the object
    def drawPoint(self, screen, wMid, hMid):
        pygame.draw.circle(screen, (255, 255, 255), (self.x + wMid, self.y + hMid), 5)

# Connecting the vertices with lines
def drawLine(screen, x1, y1, x2, y2, wMid, hMid):
    pygame.draw.line(screen, "white", (x1 + wMid, y1 + hMid), (x2 + wMid, y2 + hMid))

# Defining all the Vertices
p = []
p.append(Vertex(100, 100, 100))    #0
p.append(Vertex(100, -100, 100))   #1
p.append(Vertex(-100, 100, 100))   #2
p.append(Vertex(-100, -100, 100))  #3

p.append(Vertex(100, 100, -100))   #4
p.append(Vertex(100, -100, -100))  #5
p.append(Vertex(-100, 100, -100))  #6
p.append(Vertex(-100, -100, -100)) #7

# Defining the Connections between the Vertices
T = [
    [0, 1, 2], [1, 3, 2],
    [5, 4, 7], [4, 6, 7],
    [4, 0, 6], [0, 2, 6],
    [1, 5, 3], [5, 7, 3],
    [4, 5, 0], [5, 1, 0],
    [2, 3, 6], [3, 7, 6]
]

running = True
while running:
    # Limit to 60 FPS
    clock.tick(60)

    # Handle events (e.g., close window)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Fill the screen with black
    screen.fill((0, 0, 0))

    # Drawing all of the points
    for v in p:
        v.drawPoint(screen, wMid, hMid)

    # Drawing all of the cube connections
    for tri in T:
        a = tri[0]
        b = tri[1]
        c = tri[2]
        drawLine(screen, p[a].x, p[a].y, p[b].x, p[b].y, wMid, hMid)
        drawLine(screen, p[b].x, p[b].y, p[c].x, p[c].y, wMid, hMid)
        drawLine(screen, p[c].x, p[c].y, p[a].x, p[a].y, wMid, hMid)

    # Update the display
    pygame.display.flip()


pygame.quit()
sys.exit()