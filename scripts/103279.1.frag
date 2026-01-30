#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

const float NUM_SHELVES = 5.0;
const float SHELF_HEIGHT = 0.1;
const float SHELF_THICKNESS = 0.005;
const float SPEED = 1.0;

void main( void ) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    float shelfProgress = mod(time * SPEED, NUM_SHELVES + 1.0);
    float y = uv.y * NUM_SHELVES;
    float shelfPosition = floor(y);
    float shelfHeight = fract(y);
    
    vec3 color = vec3(0.1);
    if (shelfHeight < SHELF_THICKNESS) {
        if (shelfPosition < shelfProgress) {
            float t = smoothstep(0.0, 1.0, (shelfProgress - shelfPosition) * 2.0);
            float xOffset = uv.x * t;
            color = mix(vec3(0.1), vec3(0.8, 0.4, 0.1), xOffset);
        }
    } else {
        float boardProgress = smoothstep(0.0, 1.0, (shelfProgress - shelfPosition) * 2.0);
        float boardThickness = 0.5 * SHELF_THICKNESS;
        float boardPosition = uv.x * 2.0 * NUM_SHELVES;
        if (abs(fract(boardPosition) - 0.5) < boardThickness) {
            color = mix(vec3(0.1), vec3(0.8, 0.4, 0.1), boardProgress);
        }
    }

    gl_FragColor = vec4(color, 1.0);
}
