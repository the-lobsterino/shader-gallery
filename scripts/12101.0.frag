// by @Flexi23
// Mod by Kite.
// Mod by Rabbit

#ifdef GL_ES
precision highp float;
#endif
#define pi2_inv 0.159154943091895335768883763372
uniform float time;
uniform vec2 resolution;

float border(vec2 uv) {
	uv = abs(fract(uv)-vec2(.5)); 
	return smoothstep(.0,.5, max(uv.x, uv.y));
}

vec2 spiralzoom(float a, float d, float n, float spiral_factor, float zoom_factor, vec2 pos){
	return vec2( a*n + d*spiral_factor, -d*zoom_factor) + pos;
}

void main(void) {
	vec2 uv = gl_FragCoord.xy/resolution.y-.5*vec2(resolution.x/resolution.y,1.);
	float a = atan(uv.y, uv.x)*pi2_inv;
	float d = log(length(uv));
	vec2 spiral_uv  = spiralzoom(a,d, 5., -.1,-1.8, vec2( .5,.1)*time*.4);
	vec2 spiral_uv2 = spiralzoom(a,d, 2.,  .9,  .4, vec2(-.2,.5)*time*.4);
	vec2 spiral_uv3 = spiralzoom(a,d, 1.,  .2, 1. ,-vec2( .5,.5)*time*.4);
	gl_FragColor = vec4(border(spiral_uv), border(spiral_uv2) ,border(spiral_uv3),1.);
}