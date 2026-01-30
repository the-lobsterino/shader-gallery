#extension GL_OES_standard_derivatives : enable

precision mediump float;

#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (vec2 p) {
    return fract(sin(dot(p.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main( void ) {

	vec2 col = (gl_FragCoord.xy / resolution.xy);
	
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec2 m = vec2(-(mouse.x * 4.0 - 2.0), -mouse.y * 2.0 + 1.0);

	vec3 color = vec3(0.0);
	
	for (float i = 0.0; i < 5.0; i += 0.1) {
		vec2 p2 = p;
		vec2 inf = vec2(0.0);
		inf.x += cos((time + i) / 2.0 * PI);
		inf.y += sin((time + i) / 2.0 * PI * 2.0) / 2.0;
		p2 *= p2;
		p2.x += inf.x;
		p2.y += inf.y;
		p2 += random(p2) * p2;
		//p2 *= p2;
		float h = (0.001 + i / 200.0) / abs(0.01 + i / 220.0 - length(p2));
		color += vec3(h);
	}
	gl_FragColor = vec4(color * vec3(col.x, col.y, 1.0), 1.0);

}