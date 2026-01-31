#ifdef GL_ES
precision lowp float;
#endif
//remix by juhaxgames
uniform vec2 resolution;
uniform float time;

const int   complexity      = 35;
const float whirlpools      = 50.0;
const float fluid_speed     = 132.0;
const float color_intensity = 0.5;

void main() {
    vec2 p = (4.0 * gl_FragCoord.xy - resolution) / max(resolution.x, resolution.y);
	p.y+=sin(time);
	p*=sin(time*.1);
    for(int i = 1; i < complexity; i++) {
        p.x += whirlpools + 0.25 / float(i) * sin(float(i) * p.y + time / fluid_speed + 0.9 * float(i + 10));
        p.y += whirlpools + 0.5 / float(i) * sin(float(i) * p.x + time / fluid_speed + 0.5 * float(i + 20));
    }

    vec3 color = vec3(
	    color_intensity * sin(3.3 * p.x) + color_intensity / 0.5, // R
	    color_intensity * sin(3.40 * p.x) + color_intensity / 0.4, // G
	    color_intensity * sin(3.5 * p.x) + color_intensity / 0.75  // B
    );

    gl_FragColor = vec4(mix(color,color.xzy,0.75),p.y*1.0);
}