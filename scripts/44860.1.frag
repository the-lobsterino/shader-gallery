#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circ(float x, float y, float r, float R, float f, vec2 pos) {
	pos -= vec2(R*sin(time*f)-x, R*cos(time*f)-y);
	return smoothstep(r, r+0.01, length(pos)) * 2.0 - 1.0;
}

float sq(float x, float y, float r, float R, float f, float s, vec2 pos) {
	pos -= vec2(R*sin(time*f)-x, R*cos(time*f)-y);
	pos = vec2(pos.x*sin(time*s) + pos.y*cos(time*s), pos.x*cos(time*s) - pos.y*sin(time*s));
	return smoothstep(r, r+0.01, abs(pos.x)+abs(pos.y)) * 2.0 - 1.0;	
}

void main( void ) {

	vec2 pos = (gl_FragCoord.xy / resolution.xy * 2.0) - 1.0;

	pos *= 0.1/(length(pos)*length(pos));
	
	float col = 1.0;
	
	
	col *= circ(0.0, 0.0, 0.5, 0.4, 0.3, pos);
	col *= circ(0.1, -0.5, 0.7, 0.7, 1.0, pos);
	col *= circ(-0.7, 0.9, 0.2, 1.3, 2.5, pos);
	col *= circ(0.2, 0.6, 0.2, 0.7, 0.7, pos);
	col *= circ(-0.2, -0.5, 0.8, 0.4, 1.0, pos);
	col *= circ(0.0, 0.0, 0.2, 0.2, 1.0, pos);
	col *= sq(0.3, 0.0, 0.2, 0.3, 1.5, -2.3, pos);
	col *= sq(-0.5, 0.2, 0.6, 0.2, 8.4, 2.7, pos);

	gl_FragColor = vec4( vec3( col * 0.5 + 0.5, col * 0.1 + 0.4, col * 0.2 + 0.7 ), 1.0 );

}