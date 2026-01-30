#ifdef GL_ES
precision mediump float;
#endif

//testing stuff on nexus 7 tablet, because still strange bugs on some shaders posted here

//Found the problem: Avoid taking sqrt() of negative numbers.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec2 a = (sqrt(-position)); //Returns 0 on some devices
	vec2 b = (sqrt(position));  //Works properly
	vec2 c = (sqrt(abs(-position))); //Same result as b, works properly
	gl_FragColor = vec4(a.y,b.x,c.y,1.);

}