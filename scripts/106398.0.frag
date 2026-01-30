#ifdef GL_ES
precision lowp float;
#endif

uniform vec2 resolution;
uniform float time;

const int   complexity      = 35;
const float whirlpools      = 50.0;
const float fluid_speed     = 10.0;
const float color_intensity = 0.1;

void main() {
    vec2 p = (2.0 * gl_FragCoord.xy - resolution) / max(resolution.x, resolution.y);
	
    for(int i = 1; i < complexity; i++) {
        p.x += whirlpools + 0.5 / float(i) * sin(float(i) * p.y + time / fluid_speed + 0.9 * float(i + 10));
        p.y += whirlpools + 0.5 / float(i) * sin(float(i) * p.x + time / fluid_speed + 0.5 * float(i + 20));
    }

    vec3 color = vec3(
	    color_intensity * sin(3.0 * p.x) + color_intensity / 0.45, // R
	    color_intensity * sin(3.0 * p.x) + color_intensity / 0.45, // G
	    color_intensity * sin(3.0 * p.x) + color_intensity / 0.45  // B
    );

    gl_FragColor = vec4(color, 1.0);
}