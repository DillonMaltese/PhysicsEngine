import pygame
import sys
import numpy
from Vertex import Vertex, drawLine
from Matrix import multMat, rotYMat, rotXMat, rotZMat
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
spin = True
sign = 0.02
zRot = False
xRot = False
yRot = False
while running:
    # Limit to 60 FPS
    clock.tick(60)

    # Handle events (e.g., close window)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                running = False
            elif event.key == pygame.K_z:
                zRot = not zRot
            elif event.key == pygame.K_x:   
                xRot = not xRot
            elif event.key == pygame.K_y:
                yRot = not yRot
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1:
                spin = not spin
            elif event.button == 3:
                sign *= -1
    
    keys = pygame.key.get_pressed()
    if keys[pygame.K_d]:
        for v in p:
            v.x += 5
    if keys[pygame.K_a]:
        for v in p:
            v.x -= 5
    if keys[pygame.K_w]:
        for v in p:
            v.y -= 5
    if keys[pygame.K_s]:
        for v in p:
            v.y += 5

    # Fill the screen with black
    screen.fill((0, 0, 0))

    # Drawing all of the points
    rotatedVertices = []
    one = False

    # Drawing all of the points
    if spin:
        angle += sign
    for v in p:
        rotated = v
        if zRot:
            rotated = multMat(rotZMat(angle), rotated)
            one = True
        if xRot:
            rotated = multMat(rotXMat(angle), rotated)
            one = True
        if yRot:
            rotated = multMat(rotYMat(angle), rotated)
            one = True
        if one:
            rotatedVertices.append(rotated)
        else:
            rotatedVertices.append(v)
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