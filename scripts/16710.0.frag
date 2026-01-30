#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;
void main( void ) {

	vec2 position = 2.*( gl_FragCoord.xy / resolution.xy )-vec2(1.0);
	float light = pow(1.0-abs(position.y),10.0);
	gl_FragColor = vec4( pow(light,1.0),0.0,0.0, 1.0 );

}