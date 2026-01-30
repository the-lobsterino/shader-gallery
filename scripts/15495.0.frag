#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define MIN	4.1
#define MAX	1000.
#define DELTA	.001
#define ITER	200

float sphere(vec3 p, float r) {
	p = mod(p,2.0)-0.5*2.0;
	return length(p)-r;
}

float sdBox( vec3 p, vec3 b )
{
	p = mod(p,2.0)-0.5*2.0;
	vec3 d = abs(p) - b;
	return min(max(d.x,max(d.y,d.z)),0.0) +	length(max(d,0.0));
}

float castRay(vec3 o,vec3 d) {
	float delta = MAX;
	float t = MIN;
	for (int i = 0;i <= ITER;i += 1) {
		vec3 p = o+d*t;
		delta = sdBox(p,vec3(0.5,0.5,0.4));
		t += delta;
		if (delta/t-DELTA <= 0.0) {
			return float(i)/2.;
		}
	}
	return 0.;
}

void main (void) {
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	
	// bg, thanks to: http://glsl.heroku.com/e#15441.0
	vec3 c = vec3(sin(uv.x*5.-0.+time*1.), sin(uv.x*5.-4.0-time*1.), sin(uv.x*5.-4.+time*1.));
	float a = pow(sin(uv.x*3.1416),.9)*pow(sin(uv.y*3.1416),.9);
	vec4 col = mix(vec4(vec3(a),1.0), vec4(c,1.), 0.05);
	
	// ray tracing
	
	vec3 d = normalize(vec3(uv.x,uv.y,1.0));
	vec4 d2 = vec4(d, 1.0);
	float t = castRay(vec3(0.),d2.xyz);
	
	
	if (t < MAX) {
		col = pow(col, vec4(vec3(t),1.));
	}
	gl_FragColor = col;
}
