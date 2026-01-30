#ifdef GL_ES
precision mediump float;
#endif
#define pi 3.141592653589793238
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D texture;
const int num = 5;
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x);
	vec4 old = texture2D(texture,( gl_FragCoord.xy / resolution.xy));
	float total;
	float a = atan(-0.25+mouse.y/2.0,0.5-mouse.x);
	for(int i = 0;i<num;++i)
	{
		total += pow(1.0-length(position-vec2(0.5+(cos(pi-a)*float(i)/float(num))/4.0,0.25+(sin(pi-a)*float(i)/float(num))/4.0)),25.0);
	}
	gl_FragColor = vec4( vec3( total )+old.rgb*vec3(0.5,0.9,0.1), 1.0 );
}