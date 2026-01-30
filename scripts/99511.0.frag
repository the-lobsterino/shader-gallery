#extension GL_OES_standard_derivatives : enable 
 
precision highp float; 
 
uniform vec2 resolution; 
 
vec2 complex_square(vec2 complex) 
{ 
	return vec2(complex.x*complex.x - complex.y*complex.y, 2.0*complex.x*complex.y); 
} 
 
void main() 
{ 
	vec2 position = gl_FragCoord.xy / min(resolution.x, resolution.y); 
 
	const int ITER = 7; 
 
	vec2 z = vec2(0); 
	vec2 c = (position - vec2(0.9, 0.5))*3.0; 
	int count = ITER; 
	for(int i = 1; i < ITER; i++) 
	{ 
		z = complex_square(z) + c; 
		if(length(z) > 2.0) 
		{ 
			count = i; 
			break; 
		} 
	} 
 
	float color = 1.0 - float(count)/float(ITER); 
 
	gl_FragColor = vec4(color); 
}