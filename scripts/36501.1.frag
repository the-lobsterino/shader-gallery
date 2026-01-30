#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat4 A = mat4(1.0, 1.0, 1.0, 1.0,
	     1.0, 0.0, 1.0, 0.0, 
	     1.0, 0.0, 1.0, 0.0,
	     1.0, 1.0, 1.0, 1.0);

mat4 FOUR = mat4(0.0, 0.0, 0.0, 0.0,
		 1.0, 1.0, 0.0, 0.0,
		 0.0, 1.0, 0.0, 0.0,
		 1.0, 1.0, 1.0, 1.0);

mat4 ONE= mat4(0.0, 0.0, 0.0, 0.0,
	       0.0, 1.0, 0.0, 1.0,
	       1.0, 1.0, 1.0, 1.0,
	       0.0, 0.0, 0.0, 1.0);

void drawRectangle(float x, float y, float width, float height, vec3 color) {
	if (gl_FragCoord.x > x && gl_FragCoord.x < x + width && gl_FragCoord.y > y && gl_FragCoord.y < y + width) {
		gl_FragColor = vec4(color, 1.0);
	}
}

void drawMatrix(mat4 matrix, float x, float y, float width, float height, vec3 color) {
	float blockWidth = width / 4.0;
	float blockHeight = height / 4.0;

	for (int matrixY = 0; matrixY < 4; matrixY++) {
		for (int matrixX = 0; matrixX < 4; matrixX++) {
			if (matrix[matrixX][matrixY] == 1.0) {
				drawRectangle(x + (blockWidth * float(matrixX)), y + (blockHeight * (3.0 - float(matrixY))), blockWidth, blockHeight, color);
			}
		}
	}
}

void drawCircle(float x, float y, float r, vec3 color) {
	if (distance(gl_FragCoord.xy, vec2(x, y)) < r) {
		gl_FragColor = vec4(color, 1.0);
	}
}
	    

void main( void ) {
	gl_FragColor = vec4(1.0);
	drawRectangle(100.0, 100.0, 100.0, 100.0, vec3(0.5, 0.5, 0.25));
	drawCircle(300.0, 150.0, 50.0, vec3(0.5, 0.6, 0.6));
	drawMatrix(A, 20.0, 50.0, 20.0, 20.0, vec3(0.0, 1.0, 0.0));
	drawMatrix(FOUR, 50.0, 50.0, 20.0, 20.0, vec3(0.0, 1.0, 0.0));
	drawMatrix(ONE, 80.0, 50.0, 20.0, 20.0, vec3(0.0, 1.0, 0.0));
}