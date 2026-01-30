#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float boxWidth = 0.50;

float drawBox(vec2 p, vec2 p0, vec2 p1, float c)
{
	if (p.x >= p0.x && p.x < p1.x && p.y >= p0.y && p.y < p1.y)
		return c;
	return 0.0;
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution) - vec2(0.5);
	float c = 0.0;
	vec2 center = vec2(0.0);
	for (int i=0; i<32; i++)
	{
		float px = sin(float(i) * 0.1 + time) * 0.1;
		float py = sin(float(i) * 0.2 + time) * 0.1;
		float z = mod(float(i - 16) - time * 4.0, 32.0);
		if (z==0.0) z = 0.1;
		vec2 p0 = center - (vec2(boxWidth) + vec2(px, 0.0)) / z;
		vec2 p1 = center + (vec2(boxWidth) + vec2(0.0, py)) / z; 
		float cc = 0.1;
		c += drawBox(p, p0, p1, cc);
	}

	gl_FragColor = vec4(c, c * sin(time), c * sin(2.0 * time), 1.0);

}