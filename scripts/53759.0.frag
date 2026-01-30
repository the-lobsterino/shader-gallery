#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



float random (in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +  (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
	vec2 uv = (sin(time/10.)*2. * gl_FragCoord.xy - resolution) / resolution.y;
	uv *= noise(uv);
	
	vec3 col = vec3(0.);
	
	float t = time;
	for (int i = 0; i < 3; i++) {
		
		t += .15 + .05 * sin(time + uv.x);
		col[i] = fract(t + uv.x * 10. - abs(fract(uv.y * 5.*  fract(sin(uv.x)*1.0)) - (.5 *fract(sin(uv.x)*1.0))));
		
	}
	
	gl_FragColor = vec4(col, 1.);
}