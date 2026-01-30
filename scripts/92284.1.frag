#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec3 p) {
	return length(p) - 0.5;
}
vec3 calcNormal( in vec3 p ) // for function f(p)
{
    const float eps = 1.0007; // or some other value
    const vec2 h = vec2(eps,0);
    return normalize(vec3(map(p+h.xyy) - map(p-h.xyy),
                          map(p+h.yxy) - map(p-h.yxy),
                          map(p+h.yyx) - map(p-h.yyx)));
}
float raymarch(vec3 ro, vec3 rd) {
	float t = 0.0;
	vec3 p;
	
	for (int i = 0; i < 100; i++) {
		p = ro + rd * t;
		float dist = map(p);
		t += dist;
		if (t > 1000.0) return -1.0;
		if (dist < 0.001) return t;
	}
	return t;
}

void main(void) {

	vec2 position = (gl_FragCoord.xy - 0.5 * resolution) / resolution.y;
	vec3 color = vec3(0.0);
	vec3 ro = vec3(0, 0, 3);
	vec3 rd = normalize(vec3(position, -1.0));
	float t = raymarch(ro, rd);
	if (t > 0.0) {
		color = vec3(1.0);
	}
	gl_FragColor = vec4(sqrt(color), 1.0 );

}