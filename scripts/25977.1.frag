// From klk
// Converted and modified by gigatron
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define M_PI 3.1415926535897932384626433832795
float count=3.0;

float vx(float x,float y, float a)
{
    // float l=1.0/sqrt(a*a+(1.0-a)*(1.0-a));
    float l=count/sqrt(a*a+(1.0-a)*(1.0-a));	
    float u=x*a-y*(1.0-a);
    float v=x*(1.0-a)+y*a;
    u*=l;
    v*=l;
 
    float scale=0.00043*resolution.x;
    u=fract(u*scale)-0.5;
    v=fract(v*scale)-0.5;
    return 1.0-sqrt(u*u+v*v)*sqrt(2.0);
}


void main()
{
	vec2 uv = 4.*(gl_FragCoord.xy/resolution.xy)-2.0;
    
        float r=length(uv);
	float a=atan(uv.x,uv.y)/M_PI/2.0+sin(r-time)*0.1;
	count -=time/50.;
	if (count<0.0) count=0.0;
    
    gl_FragColor = vec4(
         (r-sin(r*M_PI*2.0+time*4.0)*0.1-sin(a*M_PI*22.0+time*4.0)*0.1+sin(a*M_PI*12.0+time)*0.4-1.5)+vx(uv.x*150.0,uv.y*150.0,0.12)
        ,(r-sin(r*M_PI*3.0+time*5.0)*0.1-sin(a*M_PI*26.0+time*5.0)*0.1-sin(a*M_PI*8.0-time )*0.4-1.5)+vx(uv.x*150.0,uv.y*150.0,0.34)
        ,(r-sin(r*M_PI*2.0+time*8.0)*0.1-sin(a*M_PI*24.0+time*6.0)*0.1-sin(a*M_PI*10.0  )*0.4-1.5)+vx(uv.x*150.0,uv.y*150.0,0.69)
        ,1.0);
}