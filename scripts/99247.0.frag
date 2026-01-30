#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define SIZE 50.
#define SPEED 100.

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	vec2 grid = floor((gl_FragCoord.xy+vec2(time*-SPEED*uv.y+0.2,0.)) / (SIZE/(uv.y+0.2)));
	
	float color = mod(grid.x + grid.y,2.);
	gl_FragColor = vec4(color,color,color,1.);

}