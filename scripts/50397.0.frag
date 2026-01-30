#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
 	vec2 uv = gl_FragCoord.xy/resolution.xy;
	float x = uv.x;
	//x += (fbm(vec2(uv.x, uv.y) + iTime * .25) - .5)*.15;
	float d = abs(x * 4. - 2.);
	
	float i = 1.55;
	float r = 0.25;
	float m = i/4.;
	
	float att = i/pow(d/r + 1., 2.);
	att = (att - m) / (1. - m);
	
	float col = att;
	
	gl_FragColor = vec4(col,col,col,1.0);
}