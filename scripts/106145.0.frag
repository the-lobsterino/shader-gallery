#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263,0.416,0.557);

    return a + b*cos( 6.28318*(c*t+d) );
}

void main(void) {
	vec2 uv = 2.0 * gl_FragCoord.xy / resolution.xy - 1.0;
	uv.x /= resolution.y / resolution.x;
	vec2 uv0 = uv;
	vec3 finalCol = vec3(0.0);
	for (float i = 0.0; i < 3.0; i++) {
		uv = fract(1.0 * uv) - 0.5;
		if (i == 0.0) {
			uv *= 1.1;
		}
		uv.x = uv.x * (atan(time * 0.35) + 2.0);
		uv.y = uv.y * (atan(time * 0.4) + 2.0);
		float d = length(uv) * exp(-length(uv0));
		vec3 col = palette(length(uv0) + 0.3 * time);
		d = -d + 0.5 * d * d - 1.0 * d * d * d;
		if (mod(i, 2.0) != 0.0) {
			d = abs(sin(1.2 * (5.0 - i) * d + time) / 2.0);
		} else {
			d = abs(cos((5.0 - i) * d + 0.8 * time) / 2.0)*exp(-sin(-d));
		}
		d = 0.02 / d;
		d = smoothstep(0.1, 0.2, d);
		d = pow(d, 1.8);
		d = d / 5.0 * (5.0 - i);
		col *= d;
		finalCol += col;
		gl_FragColor = vec4(finalCol, 1);	
	}
}