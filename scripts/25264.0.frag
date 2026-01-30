#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define PI 3.14
vec2 hash(vec2 x)
{
	return sin(cos(x*412.4*x.y+x.x*145.1)*141.7+x.x*15.);
}
float shade(float x)
{
	return mod(sin(x)*448.1,1.0);
}
vec3 color(float x)
{
	return max(min(sin(vec3(x,x+PI*2.0/3.0,x+PI*4.0/3.0))+0.5,1.0),0.0);
}
void main( void )
{
	vec2 pos=gl_FragCoord.xy+32.0;
	const float size=48.0;
	vec2 pp=(floor(pos/size)+0.5);
	float dist=666.0;
	float dist1=666.0;
	float dist2=666.0;
	float shi=0.0;
	float shi1=0.0;
	float shi2=0.0;
	vec2 dp1;
	vec2 dp2;
	for(float y=-1.0;y<1.5;y++)
	{
		for(float x=-1.0;x<1.5;x++)
		{
			vec2 pp=pp+vec2(x,y);
			vec2 hp=hash(pp);
			vec2 dp=pp+(hp*sin(time)+hp.yx*cos(time))*0.1;
			dp*=size;
			float dist=distance(pos,dp);
			if(dist<dist1)
			{
				dp1=dp;
				shi1=pp.x*120.0+pp.y;
				dist1=dist;
			}
		}
	}
	for(float y=-1.0;y<1.5;y++)
	{
		for(float x=-1.0;x<1.5;x++)
		{
			vec2 pp=pp+vec2(x,y);
			vec2 hp=hash(pp);
			vec2 dp=pp+(hp*sin(time)+hp.yx*cos(time))*0.1;
			dp*=size;
			float dist=(dot(dp-pos,dp-pos)-dot(dp1-pos,dp1-pos))/(2.0*distance(dp1,dp));
			if(dist<dist2)
			{
				dist2=dist;
			}
		}
	}
	float d=dist2;
	gl_FragColor=vec4(sin(d));
	gl_FragColor*=vec4(color(shade(shi1)*14.0),1.0);
}