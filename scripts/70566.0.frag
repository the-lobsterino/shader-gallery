// Simple Mandelbrot 
// Jessica Leyba

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

int iterations = 640;

vec2 complex_square(vec2 num)
{
	float real = num.x * num.x - num.y * num.y;
	float imaginary = num.x * num.y * 2.0;
	return vec2(real, imaginary);
}

vec3 hsv(float h, float s, float v)
{
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

void main(void) 
{
	vec2 position = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;
	
	vec2 z = position * 1.;
	vec2 c = z;
	float i = 0.0;
	
	for (int k = 0; k < 128; k++) {
		i++;
		z = complex_square(z) + c;
		if (length(z) > 1.0) {
		}
	}
	
	vec3 color = vec3(i / float(iterations));
	float h = abs(mod(time * 15.0 - float(i), 360.0) / 360.0);
	vec3 rgb = hsv(h, 1.0, 1.0);

	gl_FragColor = vec4(rgb, 1. );

}