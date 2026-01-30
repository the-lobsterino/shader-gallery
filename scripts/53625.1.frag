#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


mat2 rotate(float a) {
	float c = cos(a);
	float s = sin(a);
	return mat2(c, s, -s, c);
}

void main() {
	
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;

	
	vec3 col = vec3(0.);
	
	uv *= 5.;
	uv.y += time / 2.;

	float i = floor(uv.y);
	
	
	
	
	if (mod(i, 2.) == 0.) {
		float d =  fract(uv.y - abs(fract(uv.x) - .5));
		col += smoothstep(.55, .5, d);
	} else {
		uv *= rotate(3.14 / 4.);
		float d =  fract(uv.y - abs(fract(uv.x) - .5));
		col += smoothstep(.5, .55, d);
	}
	
	
	
	gl_FragColor = vec4(col, 1.);

}