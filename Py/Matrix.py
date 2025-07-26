import numpy
from Vertex import Vertex
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
