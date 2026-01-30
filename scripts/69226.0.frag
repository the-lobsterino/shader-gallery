#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy - resolution.xy / 2.) / resolution.xy * 2.5 - vec2(0.65, 0.);
	vec2 z = uv;
	for (int i = 0; i < 10; i += 1) {
		uv = vec2(uv.x * uv.x - uv.y * uv.y, 2. * uv.x * uv.y) + z / (sin(time * .015) + 1.5) * 1.25;
		if (length(uv) > 5.) break;
	}
	vec3 m = vec3(abs(atan(uv.y, uv.x)) / radians(180.0) + time * .1, 0.2 + 5. * sin(uv.x + cos(time)), 0.015 + .05 * cos(uv.y + sin(time * .05))) * 2.25;
	//vec3 hsv = rgb2hsv(c);
	vec3 c = hsv2rgb(m);
	//hsv.x += time * .01;
	//c = hsv2rgb(hsv);
	gl_FragColor = vec4(c, 1.0);
}