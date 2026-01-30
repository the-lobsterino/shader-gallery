#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define rot(a) mat2(cos(a) + vec4(0, 33, 11, 0))

mat2 rotate(float a) {
	float c = cos(a);
	float s = sin(a);
	return mat2(c, s, -s, c);
}
float hash(vec2 uv) {
	return fract(457346.56 * sin(dot(uv, vec2(45.78, 478.4))));
}


float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(hash(ip),hash(ip+vec2(1.0,0.0)),u.x),
		mix(hash(ip+vec2(0.0,1.0)),hash(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

vec2 hash2(vec2 uv) {
	float k = hash(uv);
	return vec2(k,  hash(uv + k));
}

vec3 layer(vec2 uv, float fz) {
	vec3 col = vec3(0);
	
	
	vec2 f = 2. * fract(uv) - 1.;
	vec2 i = floor(uv);
	
	
	vec2 t = hash2(i) * .8;
	float d = length(f - t);
	
	
	float r = hash(i) * .01 + .001;
	col += smoothstep(r + fz, r, d);
	col += .0008 / d;
	
	
	return col;
}

void main() {
	
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec2 u = uv;
	vec3 col = vec3(0.);

	uv *= 30.+sin(time)*10.0;
	//col = layer(uv, .04);
	
	float r = .0;
	for (float i = 0.; i < 1.; i += .02) {
		float r = hash(vec2(i)) * 1.28 - .786;
		uv.y += time / 10.;
		uv *= rotate(.2 + r);
		//uv.y += time / 10.;
		float t = fract(i);
		float s = smoothstep(1., 0., t);
		float fz = (1. - i) / 10.;
		uv *= s;
		uv += hash2(vec2(i, i * 2.));
		col += smoothstep(.3, 1., noise(uv + time)) / 50. * u.y;
		col += layer(uv, fz) * .4;
		col += .2* (1. -u.y) * .0000001;
		
		
		
	}
	//col *= .5 + .5 * cos(uv.x + col + time + vec3(23, 21, 0));
	
	
	col = col * .5 +  texture2D(backbuffer, gl_FragCoord.xy / resolution).rgb *.8;
	gl_FragColor = vec4(col, 1.);

}
