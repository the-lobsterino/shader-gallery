#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float light = pow(1.0-abs(position.y-0.5),4.0);
	gl_FragColor = vec4( pow(light,0.2+abs(cos(position.x*(1.0+cos(position.x+4.)))/5.0))*2.0,light*2.0,light/2.0, 1.0 );

}