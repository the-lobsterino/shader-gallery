#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



const float PI = 3.14159265358979323846264;

float scale = 2.0;
vec2 offset = vec2(+0.011643721971153, +0.822467633298876);

const int max_iterations = 1500;
const int max_colors = 50;
const float color_scale = .5;
const float inverse_max_colors = 1.0 / float(max_colors);

const int P = 2;
const float threshold = 200000.0;

#define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)

vec4 color_ramp(int i) {
    // Running the index through cos creates a continous ramp.
    float normalized_mod = mod(float(i), float(max_colors)) * inverse_max_colors;
	float normalized_cos = (cos(normalized_mod * 2.0 * PI) + 1.0) * 0.5;
    i = int(float(max_colors) * normalized_cos);

    float factor = float(i) / float(max_colors);
    float inverse_factor = 1.0 - factor;
    // An arbritrary ramp of colors
    return vec4(sqrt(sqrt(factor)), factor, inverse_factor * 0.5, 1.0);
}


vec4 color_from_ramp(int i, float f) {
	vec4 first = color_ramp(i);
	vec4 second = color_ramp(i + 1);
    return first * (1.0 - f) + second * f;
}

vec4 color_from_iteration(vec2 z, int i) {

    float s = float(i) + log2(log(threshold)) - log2(log(length(z)));
    s *= color_scale;
    int first = int(floor(s));
    return color_from_ramp(first, s - float(first));
}

void main( )
{
	vec2 c = vec2(
        (gl_FragCoord.x / resolution.x) * 3.5 - 2.5,
        (gl_FragCoord.y / resolution.y) * 2.0 - 1.0
    );

    c *= (scale / exp(time * 0.2));
    c += offset;

    vec2 z = vec2(0.0, 0.0);
    int final_i;
    for (int i = 0; i < max_iterations; i++) {
        final_i = i;

        if (length(z) >= threshold) {
            break;
        }

        // z^P + c, P = 2  gives us  z^2 + c
        z = cx_mul(z, z) + c;
    }

	gl_FragColor = color_from_iteration(z, final_i);
}
