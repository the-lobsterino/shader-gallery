#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define red vec3(1., 0., 0.)

float beat(vec2 uv, float t) {
    return 4. + 4. *
        (.5 * pow(sin(t * 3. + (3. * uv.y - uv.x)), 4.) + .5);
}

float heart(vec2 uv, float r) {

    uv.x = abs(uv.x);
    uv.y = .25 +
        1.6 * uv.y -
        sqrt(uv.x * (50. - uv.x) / 100.);
    return 1. - smoothstep(r, r + .05, length(uv));
}

void main( void ) {
    	vec2 uv = (2. * gl_FragCoord.xy - resolution.xy) / resolution.y;
	vec2 m = 2. * mouse - 1.;
    	float f = .25;
	float d = .8 - distance(uv, m);
	uv = mod(uv + f / 2., f) - f / 2.;
    	float k = heart(uv * beat(uv, time), d);
    	gl_FragColor = vec4(k * red, 1.);
}