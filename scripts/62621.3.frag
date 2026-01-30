
#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform sampler2D backbuffer;

// shadertoy emulation
#define iTime time
#define iResolution resolution

/*
           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                   Version 2, December 2004
 
Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.
 
           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

 0. You just DO WHAT THE FUCK YOU WANT TO.
*/

#define t iTime

float pulse(float cn, float wi, float x)
{
	return 1.-smoothstep(0., wi, abs(x-cn));
}

float hash11(float n)
{
    return fract(sin(n)*43758.5453);
}

vec2 hash22(vec2 p)
{
    p = vec2( dot(p,vec2(127.1, 311.7)), dot(p,vec2(269.5, 183.3)));
	return fract(sin(p)*43758.5453);
}

vec2 field(in vec2 p)
{
	vec2 n = floor(p);
	vec2 f = fract(p);
	vec2 m = vec2(1.);
	vec2 o = hash22(n)*0.17;
	vec2 r = f+o-0.5;
	float d = length(r*1.5);  // circle  
	if(d<m.x)
    {
		m.x = d;
		m.y = hash11(dot(n,vec2(1., 2.)));
	}
	return vec2(m.x,m.y);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy-0.5;
	uv.x *= iResolution.x/iResolution.y*0.9;
	uv *= 4.;
	
	vec2 p = uv*.01;
	p *= 1./(p-1.);
	
	//global movement
	uv.y += t*0.2;
	uv.x += sin(t*0.04)*0.8;
	vec2 buv = uv;
	
	float rz = 0.;
	vec3 col = vec3(0.);
	for(float i=1.; i<=26.; i++)
	{
		vec2 rn = field(uv);
		uv -= p*(i-25.)*0.2;
		rn.x = pulse(
			0.35 *(1.+cos(time*4.+i*(26.-i)/26.)*0.2)
			,.02 *pow(1.+1./(1.+i), 4.)
			, rn.x+rn.y*.15
		);
		col += rn.x*vec3(sin(rn.y*10.), cos(rn.y)*0.2,sin(rn.y)*0.5);
	}
	
	//animated grid
	buv*= mat2(0.707,-0.707,0.707,0.707);
	float rz2 = .4*(sin(buv*10.+1.).x*40.-39.5)*(sin(uv.x*10.)*0.5+0.5);
	vec3 col2 = vec3(0.2,0.4,2.)*rz2*(sin(2.+t*2.1+(uv.y*2.+uv.x*10.))*0.5+0.5);
	float rz3 = .3*(sin(buv*10.+4.).y*40.-39.5)*(sin(uv.x*10.)*0.5+0.5);
	vec3 col3 = vec3(1.9,0.4,2.)*rz3*(sin(t*4.-(uv.y*10.+uv.x*2.))*0.5+0.5);
	
	col = max(max(col,col2),col3);
	
	fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
	gl_FragColor = max(gl_FragColor, texture2D(backbuffer, gl_FragCoord.xy/resolution)-8./256.);
}