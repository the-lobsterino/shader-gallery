#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define pi 3.14159265359
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x );

	float color = pow(1.0-(length(position-vec2(0.5+cos(time)/5.0,0.25+sin(time)/10.0))),50.0);
	float light = -pow(color,0.5)+color*2.0;
	gl_FragColor = vec4(light,0.6-position.y+light,0.6-position.y+light, 1.0 );
}