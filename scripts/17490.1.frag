#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	vec2 c = vec2(20.,12.); // amount of cells (x,y)
	float b = rand(vec2( floor(pos.x*c.x)/c.x, floor(pos.y*c.y)/c.y ));
	gl_FragColor = vec4( vec3(b,b,b), 1.0 );

}