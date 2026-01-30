
// BREXIT
#ifdef GL_ES
precision highp float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
float rand(vec2 co)
{
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
 
#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){
	p.y+=1.75*CHS;
	d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));
	p+=vec2(0.5,-3.25)*CHS;
	return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} 
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);} // DOGSHIT
 
float GetText(vec2 uv)
{
	uv.x += 2.75;
	uv.y += sin(uv.x+time)*0.3;
	
	float v = 0.5+sin(time*2.0)*0.5;
	v*=7.0;
	float t = mod((v),7.0);
	float d = 2000.0;
	
		d = B(uv,1.0);uv.x -= 1.1;
		d = R(uv,d);uv.x -= 1.1;
		d = E(uv,d);uv.x -= 1.1;
		d = X(uv,d);uv.x -= 1.1;
		d = I(uv,d);uv.x -= 1.1;
		d = T(uv,d);
	return smoothstep(0.0,0.05,d-0.5*CHS);
}

vec2 uv2tri(vec2 uv)
{
    float sx = uv.x - uv.y / 2.0; // skewed x
    float offs = step(fract(1.0 - uv.y), fract(sx));
    return vec2(floor(sx) * 2.0 + offs, floor(uv.y));
}


/*
 * Original shader from: https://www.shadertoy.com/view/wl2yDV
 */

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //

void mainImage( out vec4 fragColor, in vec2 fragCoord , float dd)
{
    vec2 uv = (fragCoord.xy - iResolution.xy / 2.0) / iResolution.y * 18.0;

    vec3 p = vec3(dot(uv, vec2(1.0, 0.5)), dot(uv, vec2(-1.0, 0.5)), uv.y);
    vec3 p1 = fract(+p);
    vec3 p2 = fract(-p);

    float d1 = min(min(p1.x, p1.y), p1.z);
    float d2 = min(min(p2.x, p2.y), p2.z);
    float d = min(d1, d2);

    vec2 tri = uv2tri(uv);
    float r = rand(tri) * 2.0 + tri.x / 16.0 + iTime * 2.0;
    
    
	float c = smoothstep(0.0,0.2,d-0.2*dd);
    
    fragColor = vec4(c, c, c, 1.0);
}
 
void main( void )
{
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	float d= GetText(p*2.0);
	
	mainImage(gl_FragColor, gl_FragCoord.xy, d);
}