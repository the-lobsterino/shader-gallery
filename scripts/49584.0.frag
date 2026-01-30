#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 modPolar(vec2 uv, float n) { 
	float a = atan(uv.x, uv.y);
	n = 6.28 / n;
	a = mod(a + n * .5, n) - n * .5;
	float l = length(uv);
	return l * vec2(cos(a), sin(a));
}

void main() {

	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	uv = modPolar(uv, 12.);
	vec3 p = vec3(uv, .5 * sin(time * .1));
	vec3 col = vec3(0.);
	
	
	
	for (int i = 0; i < 8; i++) {
		p = abs(abs(p) / dot(p, p) - vec3(.4, .6, 1.)) - .1;
		col.xyz = abs(vec3(1., 0., 1.) * p);
	}
 	
	gl_FragColor = vec4(col, 1.);

}