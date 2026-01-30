#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec3 hue(float hue){
	vec3 rgb = fract(hue + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0));
	rgb = abs(rgb * 2.0 - 1.0);
	return clamp(rgb * 3.0 - 1.0, 0.0, 1.0);
}

float f(vec2 p){
	//return floor(10.0 * length(2.0 * (p-0.5) - 1.0)) / 10.0;
	return length(2.0 * (p-0.5) - 1.0);
}

void main( void ) {
	vec2 uv = surfacePosition + 0.25;
	
	uv *= 2.0;
	
	uv = clamp(uv,0.0,1.0);
	
	float p00 = f(vec2(0,0));
	float p01 = f(vec2(0,1));
	float p10 = f(vec2(1,0));
	float p11 = f(vec2(1,1));
	
	float hu0 = f(vec2(uv.x,0));
	float hu1 = f(vec2(uv.x,1));	
	
	float m0 = mix(p00,p10,uv.x);
	float m1 = mix(p01,p11,uv.x);
	
	float m = mix(m0,m1,uv.y);
	float mu01= mix(hu0,hu1,uv.y);
	
	float h0v = f(vec2(0,uv.y));
	float h1v = f(vec2(1,uv.y));	
	float m0v = mix(p00,p01,uv.y);
	float m1v = mix(p10,p11,uv.y);
	
	float m01v= mix(h0v,h1v,uv.x) - m;
	
	gl_FragColor = vec4(mix(
		hue(mu01 + m01v),
		hue(f(uv)),
		mod(floor(time),2.0)
	),1);
}