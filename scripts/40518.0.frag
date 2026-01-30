#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float getColor(float coord) {
	if (coord < 0.2) {
		return sin(coord);
	} else if (coord < 0.7) {
		return cos(coord);
	} else {
		return sin(coord);
	}
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 distToMouse = position.xy - mouse.xy;
	
	if (position.x > 0.5 && position.y > 0.5) {
		float r;
		float g;
		float b;
		float xThresh = cos(time * 2.0) / 5.0;
		if (distToMouse.x * distToMouse.x + distToMouse.y * distToMouse.y > xThresh) {
			r = getColor(mouse.x);
			g = 0.5;
		} else {
			r = 0.5;
			g = sin(time);
		}
		float distThresh = cos(time * 5.0) / 5.0;
		if (distToMouse.x * distToMouse.x + distToMouse.y * distToMouse.y > distThresh) {
			b = getColor(mouse.x);
		} else {
			b = getColor(time);
		}
		gl_FragColor = vec4(r, g, b, 1.0);
	} else {
		float r;
		float g;
		float b;
		float xThresh = sin(time * 2.0) / 5.0;
		if (distToMouse.x * distToMouse.x + distToMouse.y * distToMouse.y > xThresh) {
			r = getColor(mouse.x);
			g = 0.5;
		} else {
			r = 0.5;
			g = sin(time);
		}
		float distThresh = sin(time * 5.0) / 5.0;
		if (distToMouse.x * distToMouse.x + distToMouse.y * distToMouse.y > distThresh) {
			b = getColor(mouse.x);
		} else {
			b = getColor(time);
		}
		gl_FragColor = vec4(r, g, b, 1.0);
	}
	
}