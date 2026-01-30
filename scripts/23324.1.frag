#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
	
	float aspect = resolution.x / resolution.y;
	vec2 pos = gl_FragCoord.xy / resolution.x;
	vec2 p2 = pos+vec2(-.5, -.5/aspect);	
	float color =-0.5+ sin( ( length(p2) - (time) * 0.01 ) * 2000.0 );
	//float color = -0.5+sin( (length(p2)) * 200.0 );
	gl_FragColor =vec4(color, color , color, 1.0 );
}