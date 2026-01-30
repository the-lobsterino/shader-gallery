#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 mid = resolution/2.0;
	vec2 mse = mouse * resolution;
	vec2 frg = gl_FragCoord.xy;
	vec4 col = vec4(1.0, 0.1, 0.1, 1.0);
	
	col.r = cos(distance(mid, frg)/6.*sin(time));
	col.g = 0.5-cos(frg.x*2.0)*cos(time*4.0);
	col.b = 0.5-sin(frg.y*2.0)*cos(time*4.0);
	
	gl_FragColor = col;
}