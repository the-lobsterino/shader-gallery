#include <GL/glut.h>

const int rows = 10;
const int cols = 10;
const float dotSize = 0.1;

void display() {
    glClear(GL_COLOR_BUFFER_BIT);
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            glRectf(i * dotSize, j * dotSize, (i + 1) * dotSize, (j + 1) * dotSize);
        }
    }
    glFlush();
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutCreateWindow("Dot Matrix Display");
    glutDisplayFunc(display);
    glutMainLoop();
    return 0;
}
