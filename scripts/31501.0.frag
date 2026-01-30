#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x/resolution.y;
	
	
	vec3 finalColor = vec3( 0.0, 0.0, 0.0 );


	for (int i = 0; i < 30; i++) {
		float fi = float(i);
		vec2 p = vec2(fi*.1*tan(time) - .01);
		p = atan(p);
		finalColor += .01 / distance(uv, p);
	}
	
	gl_FragColor = vec4( finalColor, 1.0 );

}