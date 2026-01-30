#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform sampler2D tex; 
#define ITERATIONS 256

float rand(float x)
{
	return fract(sin(x+time)*100000.0);
}

float fractal(vec2 p, vec2 s, float proportion)
{
	float value = 0.0;
	float randx = 0.0;
	vec2 pc = s;
	for (int i = 0; i < ITERATIONS; i++)
	{
		float r = fract(randx*time*float(i)*.0001);
		if (r > 0.66)
			pc = mix(pc, vec2(0.0,0.4), proportion);
		else if (r > 0.33)
			pc = mix(pc, vec2(-0.5,-0.4), proportion);
		else
			pc = mix(pc, vec2(0.5,-0.4), proportion);
		randx += 111.1;
		value += 1.0 / dot(p-pc,p-pc);
	}
	return clamp(value/100000.0,0.0,1.0);
}


void main( void ) {

	vec2 xy = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
	float f1 = fractal(xy, vec2(0.0,0.0), 0.5);
	gl_FragColor = mix(vec4(f1,f1,f1,1.0),texture2D(tex, gl_FragCoord.xy/resolution.xy), 0.95);

}