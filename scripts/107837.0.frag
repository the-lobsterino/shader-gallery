// Shader by Nicolas Robert [NRX]
// Latest version: http://glsl.heroku.com/e#15513
// Concept from: http://www.iquilezles.org/www/articles/voronoilines/voronoilines.htm


// Relation between the "HASH_MAGNITUDE" (M) and "KERNEL" (K):
// - In a given cell C1, the greatest distance from a point P1 of this cell to the cell's reference point R1 is D:
//   D = SQRT2 * (M / 2 + 1 / 2)
//   D = (M + 1) * SQRT2 / 2
//   (This happens when P1 is in a corner of C1, and R1 is as far as possible in the opposite direction.)
// - So, the farther other reference point R2 that can be closer to P1 is somewhere on the circle of center P1 and radius D.
// - The center of the cell C2 which the reference point is R2 is maximum at a distance M / 2 from R2.
// - The relative position of the center of C2 compare to C1 is K:
//   K = floor (1 / 2 + sqrt ((D + M / 2) ^ 2 - (1 / 2) ^ 2))
//   K = floor ((1 + sqrt (((M + 1) * SQRT2 + M) ^ 2 - 1)) / 2)
// - If we neglect "- 1" in the square root, we can approximate K:
//   K = floor ((1 + (M + 1) * SQRT2 + M) / 2)
//   K = floor ((M + 1) * (SQRT2 + 1) / 2)
// - Reciprocally, if we set K, we can compute the maximum value of M:
//   M < 2 * (K + 1) / (SQRT2 + 1) - 1
// Having said that, you can actually use greater values for M without too much risk, as the relations given here above are just for the worst case (i.e. theoretical).

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float iGlobalTime = time;
vec3 iResolution = vec3 (resolution, 0.0);

#define SIZE 		15
#define SQRT2		1.41421356237
#define HASH_MAGNITUDE	(6.0 / (SQRT2 + 1.0) - 1.0) // Perfect if: HASH_MAGNITUDE < 2 * (KERNEL + 1) / (SQRT2 + 1) - 1
#define KERNEL		2 // Perfect if: KERNEL >= floor ((HASH_MAGNITUDE + 1) * (SQRT2 + 1) / 2)
#define BORDER
//#define CENTER
#define HEXAGONAL

float hash (in int index) {
	float x = float (index);
	return HASH_MAGNITUDE * 0.5 * sin (sin (x) * x + sin (x * x) * iGlobalTime);
}

vec2 pointInCell (in ivec2 cell) {
	int index = cell.x + cell.y * SIZE;
	vec2 point = vec2 (cell);
	#ifdef HEXAGONAL
	point.x += fract (point.y * 0.5) - 0.25;
	#endif
	return point + vec2 (hash (index), hash (index + 1)) * (0.5 + 0.5 * sin (iGlobalTime * 0.5));
}

void main () {
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
	int col = minCell.x + minCell.y * SIZE;
	vec4 color = 0.6 + vec4 (hash (col), hash (col + 1), hash (col + 2), 0.0) * 0.8 / HASH_MAGNITUDE;

	#ifdef CENTER
	dMin = sqrt (dMin);
	#else
	dMin = 2.0 * HASH_MAGNITUDE;
	#endif

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

	gl_FragColor = color * smoothstep (0.02, 0.1, dMin) * (0.9 + 0.1 * sin (dMin * 400.0 / float (SIZE))) * (0.8 + 0.2 * sin (20.0 * (p.x + p.y)));
}