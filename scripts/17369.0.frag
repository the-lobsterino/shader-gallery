#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;


void main(void) {
	vec2 pos = surfacePosition;
	float dist = length(pos) / 1.0;

	vec3 color = vec3(0.0);
	float ang = atan(pos.y, pos.x) / 3.14159265;
	if(mod(ang + dist + time / 8.0, 0.2) < 0.1 || dist < 0.05) color = vec3(0.0, 0.5, 1.0);
	else if(mod(ang - dist, 0.2) < 0.1) color = vec3(0.0, 0.4, 0.8);
	gl_FragColor = vec4(vec3(color), 1.0 );

}