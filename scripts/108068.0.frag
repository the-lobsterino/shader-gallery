#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float iGlobalTime = time;
vec3 iResolution = vec3 (resolution, 0.0);

#define SIZE         16
#define SQRT2        1.41421356237
#define HASH_MAGNITUDE    (6.0 / (SQRT2 + 1.0) - 1.0) // Perfect if: HASH_MAGNITUDE < 2 * (KERNEL + 1) / (SQRT2 + 1) - 1
#define KERNEL        2 // Perfect if: KERNEL >= floor ((HASH_MAGNITUDE + 1) * (SQRT2 + 1) / 2)
#define BORDER
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
    ivec2 pCell = ivec2 (floor (p + 0.1));

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

    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) - smoothstep (0.01, 0.1, dMin);
}