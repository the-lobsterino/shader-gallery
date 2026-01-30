#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159

float sstep(float a, float x) {
	return smoothstep(a*0.98, a*1.02, x);
}

float flower(vec2 p) {
	float a = atan(p.y, p.x);
	float r = length(p);
	//float arms = ceil(a*(1. + floor(fract(time/20.)*20.)));
	float arms = a*(5. + ceil((sin(time*3.)+.215)*5.));
	return sstep(.5,r + sin(arms)/5.);
}

vec2 rot(vec2 p, float a) {
	return vec2(p.x*cos(a)-p.y*sin(a),p.y*cos(a)+p.x*sin(a));
}

void main( void ) {

	vec2 p = ( 2.*gl_FragCoord.xy - resolution.xy ) / resolution.y;
	p = rot(p, time/3.);
	
	vec2 p1 = mod(p*5., 2.)-1.;
	vec3 color = mix(vec3(.5,.2,.0),
			  vec3(.9,.9,.1),
			  flower(p1) - flower(.8*p1));
	color += mix(vec3(.5,.2,.0),
		    vec3(.8,.7,.4),
		    flower(p*.8)) * .9;
	color *= mix(vec3(1.,1.,1.),
		    vec3(.8,.8,.8),
		    flower(p*.4));
	
	gl_FragColor = vec4( vec3( color ), 1.0 );

}