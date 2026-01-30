#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const int MAX_ITER = 100;

float mandel(vec2 Z, vec2 C)
{
	for(int i = 0; i < MAX_ITER; ++i)
	{
		float ZabsSq = Z.x * Z.x + Z.y * Z.y;
		if(ZabsSq > 4.0)
		{
			float smoothI = float(i) + 1.0 - log(log(sqrt(ZabsSq))) / log(2.0);
			return smoothI / float(MAX_ITER);
		}
		
		float temp = Z.x * Z.x - Z.y * Z.y + C.x;
		Z.y = 2.0 * Z.x * Z.y + C.y;
		Z.x = temp;	
	}
	
	return 1.0;
}

vec3 col(float t)
{
	const float s = 1.0 / 7.0;
	
	float a = mod(t * 7.0, 1.0);
	float b = 1.0 - a;
	float z = 0.0;
	float o = 1.0;
	
	if(t <= s * 1.0) return vec3(o, z, b);	// pink to red
	if(t <= s * 2.0) return vec3(o, a, z);	// red to orange
	if(t <= s * 3.0) return vec3(b, o, z);	// orange to green
	if(t <= s * 4.0) return vec3(z, o, a);	// green to cyan
	if(t <= s * 5.0) return vec3(z, b, o);	// cyan to blue
	if(t <= s * 6.0) return vec3(a, z, o);	// blue to pink
		
	return vec3(0.0);
}

void main()
{
	vec2 position = surfacePosition * 2.0;
	
	vec2 C = 2.0 * position;
	vec2 Z = C;
	
	float m = mandel(Z, C);
	m = pow(m, 0.4);
	vec3 colour = col(m);
	
	gl_FragColor = vec4(colour, 1.0);
}