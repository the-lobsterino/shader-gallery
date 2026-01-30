#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float denom = 1000.;
const int ubound = 600;
const float xOffset = 0.5;

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2. - resolution) / resolution.x;
	p = p / 1.7 + xOffset;
	
	float j = 0.;
	vec2 z = vec2(0.);
	
	for (int c = 0; c < ubound; c++) {
		j++;
		if (dot(z, z) > 2.) {
			break;
		}
		
		z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + p;
	}
	
	gl_FragColor = vec4( vec3( (j / denom), (j / denom), (j / denom)), 2);
}
