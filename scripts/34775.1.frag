#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rotation(a) mat2(cos(a),sin(a),-sin(a),cos(a))
#define pi 3.14159265358979323846
#define divide(what, part) floor(what * part) / part

void main( void ) {

	vec2 pos = gl_FragCoord.xy / resolution.y;
	pos *= rotation(pi/4.);
		
	float cuadros = 5.0;
	
	vec2 grid = divide(pos,cuadros)*cuadros;
	
	float A= mod(grid.x,2.0);
	float B= mod(grid.y,2.0);
	float color = A*(1.-B)+B*(1.-A);
	
	gl_FragColor = vec4(color);
}