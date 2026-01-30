#include "stdafx.h"
#include <windows.h>
#include <gl/gl.h>
#include <gl/glu.h>
#include <gl/glaux.h>



void myinit(void);

void drawLine(void);

void CALLBACK display(void);

void CALLBACK myReshape(GLsizei w, GLsizei h);



GLuint listName = 1;



void myinit(void)

{

    glNewList(listName, GL_COMPILE);

    glColor3f(1.0, 0.0, 1.0);

    glBegin(GL_TRIANGLES);

    glVertex2f(0.0, 0.0);

    glVertex2f(1.0, 0.0);

    glVertex2f(0.0, 1.0);

    glEnd();

    glTranslatef(1.5, 0.0, 0.0);

    glEndList();

    glShadeModel(GL_FLAT);

}



void drawLine(void)

{

    glColor3f(1.0, 1.0, 1.0);

    glBegin(GL_LINES);

    glVertex2f(0.0, 0.5);

    glVertex2f(6.0, 0.5);

    glEnd();

}



void CALLBACK display(void)

{

    GLuint i;



    glClear(GL_COLOR_BUFFER_BIT);

    glColor3f(0.0, 1.0, 0.0);

    glPushMatrix();

    for (i = 0; i < 5; i++)

        glCallList(listName);

    drawLine();

    glPopMatrix();

    glFlush();

}



void CALLBACK myReshape(GLsizei w, GLsizei h)

{

    glViewport(0, 0, w, h);

    glMatrixMode(GL_PROJECTION);

    glLoadIdentity();

    if (w <= h)

        gluOrtho2D(0.0, 2.0, -0.5 * (GLfloat)h / (GLfloat)w,

            1.5 * (GLfloat)h / (GLfloat)w);

    else

        gluOrtho2D(0.0, 2.0 * (GLfloat)w / (GLfloat)h, -0.5, 1.5);

    glMatrixMode(GL_MODELVIEW);

    glLoadIdentity();

}



void main(void)

{

    auxInitDisplayMode(AUX_SINGLE | AUX_RGBA);

    auxInitPosition(10, 200, 400, 50);

    auxInitWindow("Display List");

    myinit();

    auxReshapeFunc(myReshape);

    auxMainLoop(display);

}}