#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rotate(float a) {
	float c = cos(a), s = sin(a);
	return mat2(c, -s, s, c);
}

float cheapN(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	f = f * f * (3. - 2. * f);
	float a = cos(i.x * sin(i.y));
	float b = cos((i.x + 1.) * sin(i.y));
	float c = cos(i.x * sin(i.y + 1.));
	float d = cos((i.x + 1.) * sin(i.y + 1.));
	return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float cheapFbm(vec2 p) {
	float value = 0.,
      		total = 0.,	
      		amp = 1.,
      		freq = 1.;
    	for (float k = 0.; k < 8.; k++) {
		total += amp;
		freq *= 2.;
      		amp *= .5;
      		value += cheapN(rotate(k) * p * freq) * amp;
    	}
	return value / total;
}

float cheapFbmLayers(vec2 p) {
	return cheapFbm(p + cheapFbm(p + time + cheapFbm(p + time)));
}

void main() {
	vec2 p = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 color = vec3(0.);
	p *= 10.;
	p += time;
	color += cheapFbmLayers(p);
	gl_FragColor = vec4(color, 1.);
}