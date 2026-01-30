// 030720N

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//https://www.shadertoy.com/view/XsVSzW
#define c_conj(a) vec2(a.x, -a.y)
#define c_exp(a) vec2(exp(a.x)*cos(a.y), exp(a.x)*sin(a.y))
#define c_sqr(a) vec2(a.x*a.x-a.y*a.y, 2.*a.x*a.y)
#define c_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
#define c_div(a, b) vec2((a.x*b.x+a.y*b.y)/(b.x*b.x+b.y*b.y), (a.y*b.x-a.x*b.y)/(b.x*b.x+b.y*b.y))
#define c_sin(a) vec2(sin(a.x)*cosh(a.y), cos(a.x)*sinh(a.y))
#define c_cos(a) vec2(cos(a.x)*cosh(a.y), -sin(a.x)*sinh(a.y))
#define c_cartToPolar(a) vec2(length(a), atan(a.y, a.x))
#define c_polarToCart(a) a.x * vec2(cos(a.y), sin(a.y))

void main( void )
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy )*2.1;
	
	uv = c_exp(uv);
	uv = c_exp(-uv);
	uv = c_exp(-uv);
	// uv = c_exp(-uv);
	// uv = c_cartToPolar(uv);
	
	uv *= 5.;
	
	vec2 uv0=uv;
	float i0=1.2;
	float i1=0.95;
	float i2=1.5;
	vec2 i4=vec2(0.0,0.0);
	for(int s=0;s<10;s++)
	{
		vec2 r;
		r=vec2(cos(uv.y*i0-i4.y+mouse.x/i1),sin(uv.x*i0+i4.x+mouse.y/i1))/i2;
		r+=vec2(-r.y,r.x)*0.2;
		uv.xy+=r;
        
		i0*=1.93;
		i1*=1.25;
		i2*=1.7;
		i4+=r.xy*1.0+0.5*time*i1;
	}
	float r=sin(uv.x-time)*0.5+0.5;
	float b=sin(uv.y+time)*0.5+0.5;
	float g=sin((sqrt(uv.x*uv.x+uv.y*uv.y)+time))*0.5+0.5;
	vec3 c=vec3(r,g,b);
	gl_FragColor = vec4(c,1.0);
}