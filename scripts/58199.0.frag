#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define ITERATIONS 800

float rand(float x)
{
	return fract(sin(x+time)*100000.0);
}

float fractal(vec2 p, vec2 s, float proportion)
{
	float value = 1000.0;
	float randx = p.x;
	vec2 pc = s;
	for (int i = 0; i < ITERATIONS; i++)
	{
		float r = fract(randx*time*float(i)*.001);
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
	float f1 = fractal(xy*1.2, vec2(0.0,0.0), 0.5);
	//float f2 = fractal(xy*1.2+vec2(-0.001,0.001), vec2(0.0,0.0), 0.5);
	//float f = max(f1,f2);
	gl_FragColor = vec4(f1,f1,f1,1.0);

}