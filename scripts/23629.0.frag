#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buf;

// garden variety implementation of
// http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/

#define ITERS 12

void main(void)
{
	vec2 uv = gl_FragCoord.xy/resolution-0.5;
	#define time 1.2e1*time
	vec2 z = uv+0.001*(1./vec2(cos(time), sin(time)));
	for (int i = 0; i < ITERS; ++i)
	{
		z = abs(z);
		float m = z.x*z.x+z.y*z.y;
		z = z / m - ((mouse+0.5)*1.0);
	}
	gl_FragColor = vec4(z,sin(z));
	
	vec4 gI_LastColor = texture2D(buf, gl_FragCoord.xy/resolution);
	float DAT_GAMMA_THO = 0.023456 * ((sqrt(3.)-length(gI_LastColor.xyz))/sqrt(3.));
	gl_FragColor *= DAT_GAMMA_THO;
	gl_FragColor += -DAT_GAMMA_THO+(1.-DAT_GAMMA_THO)*gI_LastColor;
}