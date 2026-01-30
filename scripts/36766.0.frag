// WorleyNoise.glsl     2016-03-05
//
// http://glslsandbox.com/e#31150.0
// https://www.shadertoy.com/results?query=worley
// https://en.wikipedia.org/wiki/Worley_noise
// https://aftbit.com/cell-noise-2/
// http://www.carljohanrosen.com/share/CellNoiseAndProcessing.pdf
// 
// mouse.x = zoom


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float length2(vec2 p) { return dot(p, p); }

float noise(vec2 p) 
{ return fract(sin(fract(sin(p.x) * (43.13311)) + p.y) * 31.0011); }

float worley(vec2 p)
{
	float d = 1e30;
	for (int xo = -1; xo <= 1; ++xo) {
		for (int yo = -1; yo <= 1; ++yo) {
			vec2 tp = floor(p) + vec2(xo, yo);
			d = min(d, length2(p - tp - vec2(noise(tp))));
		}
	}
	return 3.0*exp(-4.0*abs(2.0*d - 1.0));
}

float fworley(vec2 p)
{
	return sqrt(sqrt(sqrt(
		0.5 * // light
		worley(p*5.0 + 0.3 + time * 0.05) *
		sqrt(worley(p * 50. + 0.9 + time * -0.25)) *
		sqrt(sqrt(worley(p * -10.0 + 9.3))))));
}

void main() 
{
	float t = fworley((gl_FragCoord.xy/resolution.x-vec2(0.5,0.3)) * (0.2+2.0*mouse.x));
	gl_FragColor = vec4(pow(t,0.4),0.7, 0.2, 1.0) * (1.2 - t) * 2.;
}
