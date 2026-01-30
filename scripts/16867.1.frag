#ifdef GL_ES
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define MAX_ITER 10

float iGlobalTime = time*.25;
vec3 iResolution = vec3 (resolution, 0.0);
#define SIZE 		8
#define SQRT2		1.41421356237
#define HASH_MAGNITUDE	(2.0 * SQRT2 - 1.0) // Ok if: HASH_MAGNITUDE <= KERNEL * SQRT (2) - 1
#define KERNEL		2 // Ok if: KERNEL >= (HASH_MAGNITUDE + 1) / SQRT (2)
#define BORDER

float hash (in int index) {
	float x = float (index);
	return HASH_MAGNITUDE * 0.5 * sin (sin (x) * x + sin (x * x) * iGlobalTime);
}

vec2 pointInCell (in ivec2 cell) {
	int index = cell.x + cell.y * SIZE;
	return vec2 (cell) + vec2 (hash (index), hash (index + 1));
}

vec4 bloodCells () {
	vec2 p = float (SIZE) * (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
	ivec2 pCell = ivec2 (floor (p + 0.5));

	float dMin = 2.0 * HASH_MAGNITUDE;
	vec2 pqMin;
	ivec2 minCell;
	for (int y = -KERNEL; y <= KERNEL; ++y) {
		for (int x = -KERNEL; x <= KERNEL; ++x) {
			ivec2 qCell = pCell + ivec2 (x, y);
			vec2 pq = pointInCell (qCell) - p;
			float d = dot (pq, pq);
			if (d < dMin) {
				dMin = d;
				pqMin = pq;
				minCell = qCell;
			}
		}
	}
	dMin = sqrt (dMin)+5000.0;
	int col = minCell.x + minCell.y * SIZE;
	vec4 color = 0.6 + vec4 (hash (col), hash (col + 1), hash (col + 2), 0.0) * 0.8 / HASH_MAGNITUDE;

	#ifdef BORDER
	for (int y = -KERNEL; y <= KERNEL; ++y) {
		for (int x = -KERNEL; x <= KERNEL; ++x) {
			ivec2 qCell = pCell + ivec2 (x, y);
			if (qCell != minCell) {
				vec2 pq = pointInCell (qCell) - p;
				dMin = min (dMin, dot (0.5 * (pqMin + pq), normalize (pq - pqMin)));
			}
		}
	}
	#endif

	vec4 final_color = color * min(dMin* 8.0, 1.0) * ( .5 + .5*sin (dMin * 450.0 / float (SIZE)));

	final_color.r *= 0.4;
	final_color.g *= 0.0;
	final_color.b *= 0.0;
	final_color.a *= 0.1;
	
	return final_color;
}

void main( void ) {
	vec2 sp = surfacePosition;
	vec2 p = sp*8.0- vec2(20.0);
	vec2 i = p;
	float c = 1.0;
	float inten = .05;

	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = time * (1.0 - (3.0 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	c = 1.5-sqrt(c);
	
	vec4 blood = bloodCells();
	vec4 atmo_color = vec4(pow(c, 7.0)) + vec4(0.0, 0.15, 0.25, 1.0);
	atmo_color.b *= 0.0;
	atmo_color.g *= 0.0;	
	gl_FragColor = atmo_color + blood;
}