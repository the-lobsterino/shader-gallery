#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = 5.*sqrt(2.) * ( ( gl_FragCoord.xy / resolution.xy ) - 0.5 );
	position.x *= resolution.x/resolution.y;
	
	float color = 0.0;
	vec2 p = position;
	
	for(float gamma = 0.; gamma < 1e2; gamma += 1.){
		p = vec2(p.x*p.x-p.y*p.y, 2.*p.x*p.y)+position;
		if(length(p) > 6.){
			color = pow(1./(.5+gamma), .5);
			break;
		}
	}
	
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}