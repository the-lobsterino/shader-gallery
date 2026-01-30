#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

#define MAX_ITER 4

float rand( float n )
	
{
    return fract(n);
}
void main( void ) {
	vec2 sp = surfacePosition;//vec2(.4, .7);
	vec2 p = sp*6.0 - vec2(125.0);
	vec2 i = p;
	float c = 1.0;
	float cc = rand(1.);
	int ccc = int(cc);
	
	float inten = 0.01;
	if(ccc==0){
		for (int n = 0; n < MAX_ITER; n++) 
		{
			float t = time* (0.05 - (3.0 / float(n+1)));
			i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
			c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
		}
			c /= float(MAX_ITER);
			c = 1.5-sqrt(c);
		gl_FragColor = vec4(vec3(c*c*c), 999.0) + vec4(0.0, 0.3, 0.4, 1.0);
	}else{
		for (int n = 0; n < MAX_ITER; n++) 
		{
			float t = time* (1.0 - (3.0 / float(n+1)));
			i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
			c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
		}
			c /= float(MAX_ITER);
			c = 1.5-sqrt(c);
		gl_FragColor = vec4(vec3(sin(c)), 999.0) + vec4(0.8, 0.1, 0., 1.0);

	}
} 