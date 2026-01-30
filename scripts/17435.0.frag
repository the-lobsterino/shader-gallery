#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = max(sign(mod(position.x*10.0+time,1.0)-position.y),0.0);
	float color2 = max(sign(position.y-0.1*cos(position.x*4.0-time)-0.5),0.0);
	gl_FragColor = vec4( vec3( color,color2,color), 1.0 );

}