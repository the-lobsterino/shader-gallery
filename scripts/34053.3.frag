#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define mouse (.5+(.25+.125*cos(11.11*length(position)+time*2.2))*vec2(sin(time), sin(time*2.22222)))
#define S(N) (1./float(N+1))

void main(void) {
	vec2 aspect = resolution.xy / min(resolution.x, resolution.y);
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * aspect;
	vec4 color = texture2D(backbuffer, position / aspect);
	if(color.a > S(1)){
		color.r -=  1./256.;
		color.g -=  2./256.;
		color.b -=  3./256.;
		if(length(color.r) < 1./256.){
			color.a = S(2);
		}
	}else if(color.a > S(2)){
		color.r +=  1./256.;
		if(length(color.r) > 1.- 1./256.){
			color.a = S(3);
		}
	}else if(color.a > S(99)){
		color.r +=  1./256.;
		color.g +=  2./256.;
		color.b +=  3./256.;
		if(length(color) > sqrt(3.)){
			color.a = S(0);
		}
	}
	
	
	
	if(length(pow(position/aspect-mouse, vec2(8))) < 1e-10) color = vec4(1.0);

	gl_FragColor = color;
}