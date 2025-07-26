#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <iostream>

// Allow the window to resize
void framebuffer_size_callback(GLFWwindow* window, int width, int height) {
    glViewport(0, 0, width, height);
}

// Closing window on esc key
void processInput(GLFWwindow* window) {
    if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
        glfwSetWindowShouldClose(window, true);
}
int main() {
    glfwInit(); // Initialize GLFW Library
    // Set OpenGL version (3.3 core)
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3); 
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    // Create the GLFW window
    GLFWwindow* window = glfwCreateWindow(800, 600, "Hello Triangle", nullptr, nullptr);
    if (window == nullptr) {
        std::cerr << "Failed to create GLFW window\n";
        glfwTerminate();
        return -1;
    }
    glfwMakeContextCurrent(window);
    
    // Register a callback to resize the viewport when window changes size
    glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);

    // Load all OpenGL function pointers using GLAD
    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
        std::cerr << "Failed to initialize GLAD\n";
        return -1;
    }

    // ------------------- Vertex Data -------------------

    float vertices[] = {
        -0.5f, -0.5f, 0.0f,  // left  
         0.5f, -0.5f, 0.0f,  // right 
         0.0f,  0.5f, 0.0f   // top   
    };

    unsigned int VBO, VAO;
    glGenVertexArrays(1, &VAO);  // Create a Vertex Array Object
    glGenBuffers(1, &VBO);       // Create a Vertex Buffer Object

    glBindVertexArray(VAO);      // Bind the VAO

    glBindBuffer(GL_ARRAY_BUFFER, VBO);  // Bind VBO to GL_ARRAY_BUFFER
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW); // Copy data to VBO

    // Set vertex attribute pointer (position attribute)
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0); 
    glEnableVertexAttribArray(0);  // Enable the vertex attribute

    // Unbind buffers (optional)
    glBindBuffer(GL_ARRAY_BUFFER, 0); 
    glBindVertexArray(0);          

    // ------------------- Shaders -------------------

    const char* vertexShaderSource = R"(
        #version 330 core
        layout (location = 0) in vec3 aPos; 
        void main() {
            gl_Position = vec4(aPos, 1.0);
        }
    )";

    const char* fragmentShaderSource = R"(
        #version 330 core
        out vec4 FragColor;
        void main() {
            FragColor = vec4(1.0f, 0.5f, 0.2f, 1.0f); 
        }
    )";

    // Compile vertex shader
    unsigned int vertexShader = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
    glCompileShader(vertexShader);

    // Compile fragment shader
    unsigned int fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
    glCompileShader(fragmentShader);

    // Link shaders into shader program
    unsigned int shaderProgram = glCreateProgram(); 
    glAttachShader(shaderProgram, vertexShader); 
    glAttachShader(shaderProgram, fragmentShader); 
    glLinkProgram(shaderProgram);

    // Delete the individual shaders once linked
    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);

    // ------------------- Render Loop -------------------

    while (!glfwWindowShouldClose(window)) {
        processInput(window); // Check for key press

        glClearColor(0.1f, 0.1f, 0.1f, 1.0f); // Set background color
        glClear(GL_COLOR_BUFFER_BIT);        // Clear the color buffer

        glUseProgram(shaderProgram);         // Use our custom shader
        glBindVertexArray(VAO);              // Bind VAO
        glDrawArrays(GL_TRIANGLES, 0, 3);    // Draw triangle
        glBindVertexArray(0);

        glfwSwapBuffers(window);             // Display the frame
        glfwPollEvents();                    // Handle window events
    }

    // ------------------- Cleanup -------------------

    glDeleteVertexArrays(1, &VAO);
    glDeleteBuffers(1, &VBO);

    glfwDestroyWindow(window);
    glfwTerminate();
    return 0;
}