#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = gl_FragCoord.xy / resolution.xy;

	float c = 0.0;
	if (int(pos.x*resolution.x) > int(resolution.x/2.) ) {
		c=abs(sin(time*2.));
	}
	
	

	
	gl_FragColor = vec4(c, c, c, 1.0 );

	


}