cmake_minimum_required(VERSION 3.15)
project(PhysicsEngine)

set(CMAKE_CXX_STANDARD 17)

# Add include and lib paths
include_directories(${CMAKE_SOURCE_DIR}/include)
link_directories(${CMAKE_SOURCE_DIR}/lib)

add_executable(PhysicsEngine 
    src/main.cpp
    src/glad.c
)

# Link GLFW and GLEW
target_link_libraries(PhysicsEngine glfw3 opengl32)