#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

const float max_iterations = 50.0;

vec4 mandel(vec2 c)
{
	float T = sin(time) * 0.025;
	
	float itr = max_iterations;
	vec2 Z = vec2(0.0);
	vec2 zt = Z;
	for (float i = 0.0; i < max_iterations; ++i)
	{
		vec2 z = Z;
		z.x = ((Z.x + T) * (Z.x - T)) - ((Z.y - T) * (Z.y - T)) + c.x;
		z.y = 2.0 * (Z.x + T) * (Z.y - T) + c.y;
		Z = z;
		
		if (dot(Z,Z) > 12.25)
		{
			itr = i;
			break;
		}
		
		zt += Z;
	}
	
	float e = itr / max_iterations;
	
	return vec4(e, zt.x, zt.y, 0.0);
}

void main() {

	float a = resolution.x / resolution.y;
	
	vec2 p  = surfacePosition;
	
	gl_FragColor = mandel(vec2(p.x - 0.5, p.y));

}