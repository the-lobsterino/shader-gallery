#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define hue(v)  ( .5 + cos( 6.3*(v)  + vec4(0,23,21,0)  ) )

void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	//uv *= 2.;
	vec3 col = vec3(0.);
	vec2 z = vec2(uv);
	//vec2 c = mouse - .5;
	vec2 c = -vec2(.5 + .5 * sin(time));
	float iters = 0.;
	for (int i = 0; i < 50; i++) {
		iters++;
		z = abs(z);
		float m = dot(z, z);
		z = z / m + c;
		if (m > 4.) break;
		
	}
	col = hue(iters / 50.).rgb;
	gl_FragColor = vec4(col, 1.);
}