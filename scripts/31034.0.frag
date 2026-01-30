#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
#define p (surfacePosition)
float sqrt3 = sqrt(3.);
uniform sampler2D b;
float dr(vec2 d){
	vec2 r = fract((gl_FragCoord.xy+d)/resolution);
	vec2 c = r - .5;
	r += 0.075*c;
	return texture2D(b, r).r;
}
void main( void ) {
	gl_FragColor = vec4(0.);
	float r = .5;
	vec2 v = p+vec2(0.,r*.5);
	if(abs(v.x*sqrt3) < v.y && v.y < r){
		gl_FragColor = vec4(1.);
	}
	gl_FragColor=1.-gl_FragColor;
	vec2 mouse = (.5 - mouse)*sqrt(length(resolution))*3.;
	gl_FragColor.xyz *= (.252+dr(mouse));
	gl_FragColor.xyz *= (.252+(dr(mouse*vec2(-1,1))));
	gl_FragColor.xyz /= (1.-.252+(dr(mouse*vec2(-1,-1))));
	gl_FragColor.xyz /= (1.-.252+(dr(mouse*vec2(1,-1))));
	
	
}