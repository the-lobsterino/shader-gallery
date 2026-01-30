#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define PI 3.14159265359

mat2 rot(float _angle)
{
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

vec3 cv( float cc )
{
	vec3 rgb = clamp( abs(mod(cc*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
	//rgb = rgb*rgb*(3.0-2.0*rgb);
	return rgb;
}


float grid(vec2 p)
{

	float N = 6.;
	p.x *= .86602;
	
	float two = mod(floor(p.y * N), 2.);
	p = p * N;
	p.x += two * 0.5; 
	p = fract(p);
	
	p.x = abs(.5 - p.x);
	float a = max(p.x * 2. + p.y, 1. - p.y * 1.5);
	float tri = step(p.x * 2. + p.y, 1.);
	
	p.x = .5 - p.x; 
	p.y = 1. - p.y;
	float b = max(p.x * 2. + p.y, 1. - p.y * 1.);
	
	return mix(1.0 - b, 1.0 - a, tri) / .6;

}

void main()
{
	
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);
		
	float dd = length(uv);
	dd = 2.0-(dd*dd);
	
	uv *= rot((uv.x*uv.y)*sin(time*0.3)+cos(time*0.5)*PI);
	uv*=(0.75+sin(time)*0.5);
	
	float d = grid(uv);
	
	col += d*cv(time*0.2+uv.x*uv.y*1.5)*dd;
		
	gl_FragColor = vec4(col, 1.);

}