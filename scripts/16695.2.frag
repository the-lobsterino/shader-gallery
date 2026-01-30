#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const int num = 100;
const float v = 6.28/float(num);

varying vec2 surfacePosition;

void main( void ) {
	
	float time = time + length(surfacePosition)*cos(time*.13+length(surfacePosition)*0.125)*8.0;
	
	vec2 position = ( gl_FragCoord.xy / resolution.x );
	float total;
	float c1 = 0.;
	float c2 = 0.;
	float c3 = 0.;
	
	for(int i = 0;i<num;i++)
	{
		c1 += clamp(sign(1.0-length(position-vec2(0.5+cos(time+float(i)*v)/5.0,0.25+cos(time*2.0+float(i)*v)/8.0))-0.98),0.0,0.1);
	}
	time += 0.1*cos(0.6667*3.14159*time);
	for(int i = 0;i<num;i++)
	{
		c2 += clamp(sign(1.0-length(position-vec2(0.5+cos(time+float(i)*v)/5.0,0.25+cos(time*2.0+float(i)*v)/8.0))-0.98),0.0,0.1);
	}
	time += 0.1*cos(time);
	for(int i = 0;i<num;i++)
	{
		c3 += clamp(sign(1.0-length(position-vec2(0.5+cos(time+float(i)*v)/5.0,0.25+cos(time*2.0+float(i)*v)/8.0))-0.98),0.0,0.1);
	}
	gl_FragColor = vec4( c1, c2, c3, 1.0 );
}