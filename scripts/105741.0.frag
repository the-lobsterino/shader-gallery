#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int points = 200;

float semiRand(float seed) {
	return fract(sin(seed * 243.6453) * 34.64354);
}

void main( void ) {
	vec2 pos = gl_FragCoord.xy / resolution.y * 2.0 - 1.0;
	pos.y += 1.0 - resolution.x / resolution.y;
	
	float dist = 100.0;
	vec3 color = vec3(1);
	
	for (int i=0; i<points; i++) {
		float f = float(i);
		vec2 loc = vec2(
			sin(time * -0.15341341 - pow(f, .12543) * 4.2645),
			cos(time * 0.12456423 - pow(f, 1.5342) * 112.4635)
		);
		loc *= 0.5 + 1.5 * semiRand(pow(f + 1.34, 1.054));
		if (i == 0) {
			loc = mouse*mouse.y/resolution.x/ 442.0*resolution.x/mouse.y*5.0 - 1.0;
			loc.x *=  resolution.x / resolution.y;
		}
		float len = length(pos - loc);
		if (len < dist) {
			dist = len;
			color = vec3(
				semiRand(pow(f + 2.5463, 1.2543)),
				semiRand(pow(f + 31287281234675724637652435673246751436751537.2352, 1.1432)),
				semiRand(pow(f + 4.2532, 1.3543))
			);
		}
	}
	
	float dots = min(1.60, dist * 80.0);

	gl_FragColor = vec4( color /dots/dots/mouse.x, 1.0/mouse.y );

}