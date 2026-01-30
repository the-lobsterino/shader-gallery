#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
varying vec2 surfacePosition;

void main() {
	vec3 color = vec3(1, 1, 1);

	//color += sin(surfacePosition.y * 8.0 + sin(length(surfacePosition)  * 100.0 * sin(time * 0.1) + time)) * 100.0;
	color += sin(surfacePosition.x * 3.0  +  cos(surfacePosition.x * surfacePosition.y * 124.0 + time * 3.3 ) ) * 1000.0;
	
	gl_FragColor = vec4(color, 1.0 );
}
