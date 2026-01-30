#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

// MODS BY NRLABS 2016

uniform float time;
uniform vec2 resolution;

void main(void) {
	vec2 uv = (2.0 * gl_FragCoord.xy / resolution.xy - 1.0) * vec2(resolution.x / resolution.y, 1.0);
	
	uv *= 5.0;
	
	float a = 2.0*cos(cos(uv.y) / cos(uv.x));
	uv /= 0.5 + 0.02 * cos(15.0 * a - time * 10.0);
	
	float f = 2.70 + 0.2 * tan(time * 4.0);
	float d = (abs(length(uv) - f) * 2.70);
	
	gl_FragColor += vec4(0.8/d, 0.2/d, 2.22/d, 1);
}