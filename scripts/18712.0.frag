#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415956
#define TWO_PI PI*2.0

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy - 0.5);
	float ratio = resolution.y / resolution.x;
	vec2 look = vec2( (mouse.x-0.5)*TWO_PI, (mouse.y-0.5)*TWO_PI );
	vec3 color = vec3(0.0);
	
	color.x = sin( (position.x-0.5)*ratio + look.x)*0.5 + 0.5;
	color.y = sin( (position.x-0.5)*ratio + look.x + PI/2.0)*0.5 + 0.5;
	color.z = position.y*0.25 + 0.5 + look.y*0.125;
	gl_FragColor = vec4( ceil(color*20.0)/20.0, 1.0 );

}