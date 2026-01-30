#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159
#define TWO_PI (PI*2.0)
#define N 8.0
mat2 rr(float angle)
{
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c);
}
void main(void) 
{
	
	vec2 v = (gl_FragCoord.xy) / min(resolution.y,resolution.x) * 2.0;
	
	float ss=fract(time*0.0075)*TWO_PI;
	v *= rr(ss);
	
	float col = 0.0;

	for(float i = 0.0; i < N; i++) 
	{
	  	float a = i * (TWO_PI/N) * 16.5;
		col += cos(TWO_PI*(v.y * cos(a) + v.x * sin(a) + sin(time*0.003)*66.0 ));
		v.xy *=rr(5.375);
		v*=1.075;
	}
	
	col = sin(col*0.5)*1.05;

	col = pow(abs(col),7.5)*0.9;

	gl_FragColor = vec4(col*col,col*0.7,col*0.65, 1.0);
}