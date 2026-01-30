#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(float x, float y, float seed)
{
	float num = 0.;
	float xx = x*3.41345135;
	float yy = mod(y*565.13413,13.5431+xx);
	
	int maxI = 5;
	
	for(int i = 0;i<2 ;i++)
	{
		num += mod(fract((cos(yy+float(i))*(seed*54.3143523))), 4.12);
	}
	
	num = num/1.;
	
	num = clamp(num,-1.,1.);
	
	num = (num+1.)/2.;
	
	return num;
		   
	
}

void main( void ) {


	float color = rand(gl_FragCoord.x,gl_FragCoord.y,time);
	
	gl_FragColor = vec4( color, color, color, 1.0 );

}