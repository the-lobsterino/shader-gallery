#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	
	uv *= 3.;
	vec3 col = vec3(0.);
	
	float k = cos(uv.y + time);
	float m = 0.125;
	/*
	float d = abs(uv.x - k * 0.5);
	d = min(d, abs(uv.x + k * 0.5));
	uv.y = mod(uv.y, m) - m * 0.5;
	k = abs(k);
	k -= 0.5 * k;
	uv.x -= clamp(uv.x, -k, k);
	d = min(d, length(uv));	
	col += smoothstep(0.03, 0.01, d);
	*/
	
	float ww = abs(uv.x)*2.-abs(k);
	col += vec3(1.)*float(
		(ww <= 0.0+m/4.)
		&& (
			(ww >= 0.0-m/2.)
			|| fract((uv.y)*3.14*2.5) < m*2. 
		)
	);
	
	gl_FragColor = vec4(col, 1.);

}