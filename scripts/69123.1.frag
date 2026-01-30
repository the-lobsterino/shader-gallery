#define col gl_FragColor
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float tri(float x) { return min(fract(x), 1. - fract(x)) * 4. - 1.; }

void main(void)
{
    vec2 pos = (2. * gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y) + vec2(.0, .3);
	
    col = vec4(0.0);
	
    float x = tri(time * .1) * 2.6;
    vec2 s = 2. * pos - vec2(x, 1.5 * abs(sin(time * 2.0)));
	
    if (length(s) < .85)
    {
        col = vec4(1.0, .0, 0., .0);
        s = s * mat2(.96, -.28, .28, .96) / sqrt(1.65 - length(s.yx)*1.5) + vec2(1. * x, 0.);
        if (fract(s.x * 1.2) < .5 ^^ fract(s.y * 1.2) < 0.5) col += 1.1;
    }

	//gl_FragColor = col;
}