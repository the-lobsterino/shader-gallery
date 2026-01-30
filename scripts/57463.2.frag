#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	
	vec3 col = vec3(0.);
	
	vec2 k = vec2(.5, .86);
        vec2 m = k / 2.;
	
	
	vec2 auv = abs(uv)/0.17;
	if(auv.x < 1. && auv.y < 1.) {
		auv = pow(1./auv, vec2(1.)+(mouse-.5));
		uv = sign(uv)*auv*0.17;
	}
	
	
	
        vec2 a = mod(uv, k) - m;
        vec2 b = mod(uv - m, k) - m;
        vec2 f = abs(length(a) < length(b) ? a: b);
        vec2 i = uv - f;
	
	float T = time,
        d = max(dot(f, k), f.x);
	
	col += smoothstep(0.02, 0.0, abs(d - 0.248));
	col += smoothstep(0.02, 0.0, abs(d - 0.1));
	col += smoothstep(0.02, 0.0, abs(d - 0.05));
	
	d = max(abs(f.x), abs(f.y));
	
	col += smoothstep(0.01, 0., abs(d - 0.17));
	
	
	gl_FragColor = vec4(col, 1.);

}