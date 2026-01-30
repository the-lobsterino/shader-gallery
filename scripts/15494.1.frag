#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const int num = 5;
const float val = 1.0/float(num);
#define pi 3.1415926589793238
#define p 1.0/(pi*2.0)

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x );
	
	float height = cos(position.x*10.0)*0.125+0.25-position.y*2.0;
	float lazer  = pow(1.0-abs(position.x-mouse.x),250.0);
	float ground = max(sign(height),0.0);
	for(int i = 0; i < num; ++i)
	{
			lazer += pow(1.0-length(position-vec2(mouse.x+cos(time+float(i)*cos(time))*0.05,mod(-time/5.0+float(i)*val,1.0)))/25.0,5000.0);	
	}
	vec3 total = vec3( lazer )* vec3 (0.5,3.0,0.5)+vec3(ground);
	gl_FragColor = vec4( total, 1.0 );

}