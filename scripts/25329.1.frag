#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	float color = 0.0;
	vec2 colors = normalize(mix(gl_FragCoord.xy/resolution.xy,resolution.xy,cos(time)-1.5 + sin(time)));
	gl_FragColor = vec4(0.5 + cos(time + distance(position.x,position.y)), 0.5 - cos(time + distance(position.x,position.y)),0.5 - colors.x,1);
}