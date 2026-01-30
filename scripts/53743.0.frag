#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float ITERATIONS = 100.;

vec2 powComplex(vec2 z, float n) {
    float t = atan(z.y, z.x);
    float r = length(z);
    r = pow(r, n);
    t *= n;
    return r * vec2(cos(t), sin(t));
}

float iterationsToEscape(vec2 uv, vec2 c) {
    vec2 z = uv;
    for (float i = 0.; i < ITERATIONS; i++) {
        // get complex num
        z = powComplex(z, 2.) + c;
        if (dot(z, z) > 2.) return i;
    }
    return 0.;
}

float render(vec2 uv) {

    vec2 z = uv * 2.;
    vec2 c = z;

    float i = iterationsToEscape(z, c);
    return i / ITERATIONS;

}

void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);
	
	
	
	gl_FragColor = vec4(col, 1.);
}