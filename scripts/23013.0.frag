#ifdef GL_ES
precision mediump float;
#endif
//what is that flag?

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - vec2(0.5, 0.5))*2.0;
	float r = length(position);
	
	float k1 = smoothstep(0.25, 0.3, abs(position.x));
	float k2 = smoothstep(0.25, 0.3, abs(position.y));
	

	gl_FragColor = vec4( 1.0 - min(k1, k2), 0.0, 0.0, 1.0 );

}