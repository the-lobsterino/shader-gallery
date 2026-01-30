#ifdef GL_ES
precision mediump float;
#endif
#define pi 3.141592653589793238
uniform float time;
uniform vec2 resolution;

const float colornum = 3.0;//This is multipled by 3. The number of channels, rgb
const int num = 9;
const float v = (pi*2.0)/float(num);
float point(vec2 pos, vec2 xy, float power)
{
	return pow(1.0-length(pos-xy),power);
}
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x );
	vec3 color = vec3(0.0);
	for(int i = 0; i < num; ++i)
	{
		color += point(position,vec2(cos(time+v*float(i)*1.2)*0.125+0.5,sin(time+v*float(i))*0.125+0.25),50.0)*vec3(4.0,2.0,1.0);
	}
	color.r = floor(color.r*colornum)/colornum;
	color.g = floor(color.g*colornum)/colornum;
	color.b = floor(color.b*colornum)/colornum;
	gl_FragColor = vec4( color, 1.0 );

}