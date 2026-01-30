import pygame
from pygame.locals import *
from OpenGL.GL import *
from OpenGL.GL.shaders import compileProgram, compileShader

def main():
    # Initialize Pygame
    pygame.init()
    display = (800, 600)
    pygame.display.set_mode(display, DOUBLEBUF | OPENGL)

    # Define Shaders (GLSL)
    vertex_shader = """
    #version 330
    in vec4 position;
    void main()
    {
        gl_Position = position;
    }
    """
    fragment_shader = """
    #version 330
    out vec4 fragColor;
    void main()
    {
        fragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
    """

    # Compile Shaders and Program
    shader = compileProgram(
        compileShader(vertex_shader, GL_VERTEX_SHADER),
        compileShader(fragment_shader, GL_FRAGMENT_SHADER)
    )

    # Vertex Data
    vertex_data = [
        -0.5, -0.5, 0.0,
         0.5
