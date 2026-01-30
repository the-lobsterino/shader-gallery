#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float pi=3.1415926;

float random(float seed, vec2 pos){
	vec2 r=vec2(seed*79.0*tan(39.0), exp(10.0/seed+14.0));
	return fract(sin(dot(pos, r))*pow(10.0, seed));
}


void main() {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float color=0.0;
	float OSC=random(2.0, position.yy);
	color += random(6.0, position)-0.3*random(7.2, position);
	
	
	
	gl_FragColor = vec4( color, 0.3*color*OSC , 0.19*color-random(10.0,position.yx), 1.0 );

}