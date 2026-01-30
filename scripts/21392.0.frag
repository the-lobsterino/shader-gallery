#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 RED = vec4(1.0,0.0,0.0,1.0);
vec4 GREEN = vec4(0.0,1.0,0.0,1.0);
vec4 BLUE = vec4(0.0,0.0,1.0,1.0);

vec4 pattern(in vec2 position) {
	vec4 color = vec4(fract(position.x * 10.0)+fract(position.y*10.0))/2.0;
	color *= (RED * position.x + BLUE * (1.0 - position.x) + GREEN * position.y);
	return color;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	
	//position -= vec2(0.5);
	
	vec4 color = pattern(position);
	
	gl_FragColor = color;
}