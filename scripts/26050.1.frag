precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265358979323846264;
const float TWOPI = PI*2.0;

const vec4 WHITE = vec4(0.2, 0.0, 0.3, 1.0);
const vec4 BLACK = vec4(0.0, 0.5, 0.1, 1.0);

const vec2 CENTER = vec2(0.0, 1.0);

const int MAX_RINGS = 60;
const float RING_DISTANCE = 0.05;
const float WAVE_COUNT = 60.0;
const float WAVE_DEPTH = 0.5;

void main(void) {
    float rot = mod(time, TWOPI);
    float x = (gl_FragCoord.x / resolution.x * 2.0 - 1.0) * (resolution.x / resolution.y);
    float y = gl_FragCoord.y / resolution.y * 2.0 - 1.0;
    
    bool black = false;
    float prevRingDist = RING_DISTANCE;
    for (int i = 0; i < MAX_RINGS; i++) {
        vec2 center = vec2(CENTER - RING_DISTANCE * float(i)*0.75);
        float radius = 0.9 + RING_DISTANCE / (pow(float(i+3), 3.0)*0.0001);
        float dist = distance(center, vec2(x, y));
        dist = pow(dist, 0.1);
        float ringDist = abs(dist-radius);
        if (ringDist < RING_DISTANCE*prevRingDist*5.0) {
            float angle = atan(y - center.y, x - center.x);
            float thickness = 1.25 * abs(dist - radius) / prevRingDist;
            float depthFactor = WAVE_DEPTH * sin((angle+rot*radius) * WAVE_COUNT);
            if (dist > radius) {
                black = (thickness < RING_DISTANCE * 5.0 - depthFactor * 1.25);
            }
            else {
                black = (thickness < RING_DISTANCE * 5.0 + depthFactor);
            }
            break;
        }
        if (dist > radius) break;
        prevRingDist = ringDist;
    }
    
    gl_FragColor = black ? BLACK : WHITE;
}