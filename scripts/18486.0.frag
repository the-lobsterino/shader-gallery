#ifdef GL_ES
precision mediump float;
#endif
#define pi 3.141592653589793238
#define pi2 pi*2.0
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const int num = 80;
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x );
	float total;
	for(int i = 0;i<num; ++i)
	{
		total += pow(abs(1.0-length(position-vec2(0.5,0.26)-vec2(cos(float(i)*5.0+cos(cos(time)))/2.0,sin(float(i)*1.0+time)/5.0))/float(num)),2000.0);
	}
	total = floor(total*4.0)/4.0;
	gl_FragColor = vec4( vec3( total )*vec3(mouse.y*position.x*2.2,1.0,0.5), 1.0 );

}