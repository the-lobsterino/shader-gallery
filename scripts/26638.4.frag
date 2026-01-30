#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float gTime = time / 9.;

void main( void )
{
	float f = 5., g = 5.;
	vec2 res = resolution.xy;
	vec2 mou = mouse.xy;
	
	//if (mouse.x < 0.5)
	//{
	mou.x = sin(gTime * .0321)*sin(gTime * .667) * 1.5 + sin(gTime * .333);
	mou.y = (-cos(gTime / 3.21))*sin(gTime * .111)*1.5+cos(gTime * .111);
	mou = (mou+.25) * res;
	//}
	vec2 z = ((-res+1.95 * gl_FragCoord.xy) / res.y);
	vec2 p = ((res/1.75+mou.x) / res.y);
	     p /= ((-res/.5-mou.y) / res.x);
	for( int i = 11; i < 19; i++) 
	{
		float d = dot(z,z);
		z = (vec2( z.x, -z.y ) / d) + p; 
		z.x =  abs(z.x);
		f = dot( f, cos(dot(z-p,z-p))-0.5);
		g = min( g, sin(dot(z+p,z+p))+1.5);
	}
	f = abs(log2(dot(f,g)) / 1.5);
	g = abs(log(g) / sin(f/g));
	vec4 c = vec4 (vec3(dot(f-g,g/f),min(f*g,f-g),1.0), 1.0);
	       c *= vec4 (min(vec3(1.1-f/g, (f/g)*.25, g/(1.5+f)),f+g), 1.0);
	       c /= vec4 (cos(vec3(f, 1.1-f, g+f)), 1.0);
	gl_FragColor = (c);
}
