#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D tx;
void main( void ) {

	vec2 position = sqrt(2.) * ( ( gl_FragCoord.xy / resolution.xy ) - 0.5 );
	position.x *= resolution.x/resolution.y;
	position = vec2(-0.555555555, 0.)+1.5*vec2(-1,1)*position.yx;
	
	float color = 0.0;
	vec2 p = position;
	
	for(float gamma = 0.; gamma < 1e2; gamma += 1.){
		p = vec2(p.x*p.x-p.y*p.y, 2.*p.x*p.y)+position;
		if(length(p) > 1e10){
			color = pow(1./(.5+gamma), 0.125);
			break;
		}
	}
	
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 13.0 ) * 0.75 ), 1.0 );
	
	gl_FragColor += (texture2D(tx, (gl_FragCoord.xy/resolution)+vec2(cos(.01*time+length(gl_FragCoord.xy-resolution/2.)), sin(.01*time+length(gl_FragCoord.xy-resolution/2.)))/resolution)-gl_FragColor)*(1.-0.01+0.011*sin(time/14.));
	
}

//ptkfs