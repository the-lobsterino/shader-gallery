



// STAR
// Code by Twareintor (2017)

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define STRONG 20.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;




void main( void ) {

	vec2 cen = resolution/2.;
	vec2 pos = cen;
	vec4 outColor = vec4(.0, .0, .0, 1.);
	pos = gl_FragCoord.xy-pos;
	

	outColor.r = .8*(1.+pos.y*pos.x/(.0001+STRONG*(+1.*float(pos.x<0. && pos.y>0. || pos.x>0. && pos.y<0.)-1.*(float(pos.x>0. && pos.y>0. || pos.x<0. && pos.y<0.)))));
	outColor.r*=(1.-length(-gl_FragColor.xy+pos)/length(resolution));
	outColor.g = outColor.r;
	outColor.b = outColor.r*.45;
	gl_FragColor = outColor;

}