#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = p*2.0-1.0;
	p.x *= resolution.x/resolution.y;
	
	float t = time*5.0;
	
	vec3 col = vec3(0.0); // this boilerplate is not negotiable;
	for(int i=0; i<16; i++){
	  float a = float(i)/16.0 * 3.141592 * 2.0;
	  col += 1.0 / vec3(length(p+ vec2(cos(t+a)*0.2, sin(t+a)*0.2) ))*0.02;
	}
	col *= fract(time*5.0);
		
	gl_FragColor = vec4( col, 1.0 );

}