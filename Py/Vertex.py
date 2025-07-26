import pygame
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