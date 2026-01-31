#include <GL/glut.h>

// Угол поворота конуса
GLfloat angle = 0.0f;

// Функция отрисовки конуса
void drawCone() {
    glColor3f(0.5f, 0.0f, 0.5f);  // Фиолетовый цвет

    glPushMatrix();
    glRotatef(-90.0f, 1.0f, 0.0f, 0.0f);  // Поворот конуса
    glutSolidCone(1.0, 2.0, 50, 50);  // Создание конуса
    glPopMatrix();
}

// Функция отрисовки
void display() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glLoadIdentity();
    glTranslatef(0.0f, 0.0f, -5.0f);  // Перемещение вглубь экрана
    glRotatef(angle, 0.0f, 1.0f, 0.0f);  // Вращение конуса

    drawCone();

    glutSwapBuffers();
}

// Функция обновления
void update(int value) {
    angle += 2.0f;  // Увеличиваем угол для вращения

    if (angle > 360) {
        angle -= 360;
    }

    glutPostRedisplay();  // Перерисовываем экран
    glutTimerFunc(16, update, 0);  // Устанавливаем таймер для следующего обновления
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
    glutCreateWindow("Purple Cone");

    glEnable(GL_DEPTH_TEST);

    glutDisplayFunc(display);
    glutTimerFunc(25, update, 0);  // Устанавливаем таймер для вызова функции обновления

    glMatrixMode(GL_PROJECTION);
    gluPerspective(45.0f, 1.0f, 0.1f, 100.0f);

    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);  // Черный фон

    glutMainLoop();

    return 0;
}
