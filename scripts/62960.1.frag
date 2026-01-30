// 08.04.20 Necip's mix with http://glslsandbox.com/e#62957.0


/// shader from unreal plugin! https://www.unrealengine.com/marketplace/en-US/product/temaran-shader-tutorial
// BEGIN: shadertoy porting template
// https://gam0022.net/blog/2019/03/04/porting-from-shadertoy-to-glslsandbox/


precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

#define iResolution resolution
#define iTime time
#define iMouse mouse

void mainImage(out vec4 fragColor, in vec2 fragCoord);
void mainImage2(out vec4 fragColor, in vec2 fragCoord);

void main(void) {
    vec4 col1, col2;
		
    mainImage(col1, gl_FragCoord.xy);
    mainImage2(col2, gl_FragCoord.xy);
    gl_FragColor = col1-col2;
}




#define iterations 12
#define formuparam 0.53

#define volsteps 10
#define stepsize 0.1

#define zoom   0.800
#define tile   0.850
#define speed  0.010 

#define brightness 0.0015
#define darkmatter 0.100
#define distfading 0.830
#define saturation 0.850

void mainImage2( out vec4 fragColor, in vec2 fragCoord )
{
	//get coords and direction
	vec2 uv=fragCoord.xy/resolution.xy-.5;
	uv.y*=resolution.y/resolution.x;
	vec3 dir=vec3(uv*zoom,1.);
	float t=time*speed+.25;

	//mouse rotation
	float a1=.5; // +mouse.x/resolution.x*2.;
	float a2=.8; // +mouse.y/resolution.y*2.;
	mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
	dir.xz*=rot1;
	dir.xy*=rot2;
	vec3 from=vec3(1.,.5,0.5);
	from+=vec3(time*0.02,time*0.02,-2.);
	from.xz*=rot1;
	from.xy*=rot2;
	
	//volumetric rendering
	float s=0.1,fade=1.;
	vec3 v=vec3(0.);
	for (int r=0; r<volsteps; r++) {
		vec3 p=from+s*dir*.5;
		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) { 
			p=abs(p)/dot(p,p)-formuparam; // the magic formula
			a+=abs(length(p)-pa); // absolute sum of average change
			pa=length(p);
		}
		float dm=max(0.,darkmatter-a*a*.001); //dark matter
		a*=a*a; // add contrast
		if (r>6) fade*=1.-dm; // dark matter, don't render near
		//v+=vec3(dm,dm*.5,0.);
		v+=fade;
		v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
		fade*=distfading; // distance fading
		s+=stepsize;
	}
	v=mix(vec3(length(v)),v,saturation); //color adjust
	fragColor = vec4(v*.01,1.);	
	
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = (fragCoord.xy / iResolution.xy) - .5;
	float t = iTime * .1 + ((.25 + .05 * sin(iTime * .1))/(length(uv.xy) + 0.06)) * 2.2;
	float si = sin(t);
	float co = cos(t);
	mat2 ma = mat2(co, si, -si, co);

	float v1, v2, v3;
	v1 = v2 = v3 = 0.0;
	
	float s = 0.0;
	
	for (int i = 0; i < 90; i++)
	{
		vec3 p = s * vec3(uv, 0.0);
		p.xy *= ma;
		p += vec3(.22, .3, s - 1.5 - sin(iTime * .13) * .1);
		for (int i = 0; i < 8; i++)	p = abs(p) / dot(p,p) - 0.659;
		v1 += dot(p,p) * .0001 * (1. + sin(length(uv.xy * 13.0) + .09  - iTime * .01));
		v2 += dot(p,p) * .0 * (2.5 + sin(length(uv.xy * 14.5) + 1.2 - iTime * .01));
		v3 += length(p.xy*10.) * .0006;
		s  += .035;
	}
	
	float len = length(uv);
	v1 *= smoothstep(.2, .0, len);
	v2 *= smoothstep(.5, .0, len);
	v3 *= smoothstep(.5, .0, len);
	
	vec3 col = vec3( v3 * (1.5 + sin(iTime * .2) * .4), (v1 + v3) * .3, v2) + smoothstep(0.2, .0, len) * .85 + smoothstep(.0, .6, v3) * .3;

	fragColor=vec4(min(pow(abs(col), vec3(1.2)), 1.0), 1.0);
}
