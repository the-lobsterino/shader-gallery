#extension GL_OES_standard_derivatives : enable

precision highp float;




uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}


float m(float w,float mo)
{
float e=(float(w)/float(mo));
	
	return float((float(e)-float(int(e)))*float(mo));
}
vec4 kachel(float tx,float ty,float x,float y)
{
	vec4 colorA = vec4(0.149,0.141,0.912,1.0);
vec4 colorB = vec4(1.000,0.833,0.224,1.0);

	vec4 f= vec4(random(vec2(x+100.0,y)),
		     random(vec2(x+100.0,y)),
		     random(vec2(x+100.0,y)),1.0);

	return f;

	
	
	

	
	
	
}
float wink( vec2 a, vec2 b)
{

	float bo=atan(a.y-b.y,a.x-b.x);
	if(bo<0.0)
	{
		return degrees (0.0-bo);
	}
	
	return 360.0-degrees (bo);

	
}
bool vergl(float a, float v,float b)
{
	if(v>b)
	{
	return !((a>b)&&(a<v));	
	}
	return ((a<b)&&(a>v));
}
vec4 tunel1(float x,float y)
{
	float w1=350.0;
	float w2=80.0;
	/*w1=m(w1+time*15.0,360.0);
w2=m(w2+time*15.0,360.0);*/
	float w=wink(vec2(x,y),vec2(0.5,0.5));
	
	if(vergl(w,w1,w2))
	{
		return vec4(1.0,0.0,1.0,1.0);
	}
	return vec4(1.0,1.0,1.0,1.0);
	
}
	
vec4 tunel(float x,float y)
{
float w=wink(vec2(x,y),vec2(0.5,0.5));
/*float d1=length(vec2(x-0.5,y-0.5))*5.0;*/
float d=distance(vec2(x,y),vec2(0.5,0.5))*2.0;	
	/*
float	d=pow(pow(abs(x-0.5),1.0)+pow(abs(y-0.5),1.0),0.5);
	d1=d;*/
return	kachel(40.0,40.0,(w+time*22.0)/360.0,(d+0.5)+time*0.110)*d;
	
}
void main( void ) {
	
	
	float  px =  gl_FragCoord.x/resolution.x;
		float  py =  gl_FragCoord.y/resolution.y;
	float d=distance(vec2(px,py),vec2(0.5,0.5));
	gl_FragColor =tunel(px,py);
	/*
gl_FragColor =kachel(40.0,40.0,px-time*0.1,py+time*0.0);*/


}