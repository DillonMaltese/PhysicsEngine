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

angle = 0
proj = [
    [1, 0, 0],
    [0, 1, 0], 
    [0, 0, 1]
]

# Function for matrix multiplication
def multMat(m, v):
    return Vertex(
        m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z,
        m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z,
        m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z
    )

# Math for rotation along Z-axis
def rotZMat(angle):
    return [
        [numpy.cos(angle), -numpy.sin(angle), 0],
        [numpy.sin(angle), numpy.cos(angle), 0],
        [0, 0, 1]
    ]

# Math for rotation along X-axis
def rotXMat(angle):
    return [
        [1, 0, 0],
        [0, numpy.cos(angle), -numpy.sin(angle)],
        [0, numpy.sin(angle), numpy.cos(angle)]
    ]

# Math for rotation along Y-axis
def rotYMat(angle):
    return [
        [numpy.cos(angle), 0, numpy.sin(angle)],
        [0, 1, 0],
        [-numpy.sin(angle), 0, numpy.cos(angle)]
    ]

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
    angle += 0.02

    # Limit to 60 FPS
    clock.tick(60)

    # Handle events (e.g., close window)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Fill the screen with black
    screen.fill((0, 0, 0))

    rotatedVertices = []

    # Drawing all of the points
    for v in p:
        rotated = multMat(rotYMat(angle), v)
        rotated = multMat(rotXMat(angle), rotated)
        rotatedVertices.append(rotated)
        rotated.drawPoint(screen, wMid, hMid)

    # Drawing all of the cube connections
    for tri in T:
        a = rotatedVertices[tri[0]]
        b = rotatedVertices[tri[1]]
        c = rotatedVertices[tri[2]]
        drawLine(screen, a.x, a.y, b.x, b.y, wMid, hMid)
        drawLine(screen, b.x, b.y, c.x, c.y, wMid, hMid)
        drawLine(screen, c.x, c.y, a.x, a.y, wMid, hMid)

    # Update the display
    pygame.display.flip()


pygame.quit()
sys.exit()