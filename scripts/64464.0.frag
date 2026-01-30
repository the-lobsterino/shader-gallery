/*
 * Original shader from: https://www.shadertoy.com/view/3ssGDB
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// distort - Catzpaw snow + distort

float N21(vec2 p) {
	vec3 a = fract(vec3(p.xyx) * vec3(213.897, 653.453, 253.098));
    	//a += dot(a, a.yzx + 79.76);
    	return fract((a.x + a.y) * a.z);
}
mat2 rot2(float a )
{
	float c = cos( a );
	float s = sin( a );
	return mat2( c, -s, s, c );
}

float Mtime(float mval)
{
    return mod(iTime,mval);
}

float TimerInOut(vec4 v)
{
    return smoothstep(v.y,v.y+v.w,v.x) - smoothstep(v.z-v.w,v.z,v.x);
}

// uv -1 <-> 1
float snow(vec2 uv,float scale)
{
	uv *= scale;
	uv.xy += iTime;
	vec2 gridIndex=floor(uv);
	vec2 posInGrid=fract(uv);
	vec2 pos = .5 + .35 * sin(11. * fract(sin((gridIndex + scale) * mat2(7,3,6,5)) * 5.)) - posInGrid;
	float k = length(pos);
	k = smoothstep(0., k, sin(posInGrid.x + posInGrid.y) * 0.02);
    return k;
}

vec3 _snow(vec2 uv)
{
    float time=iTime;
    // mods...
	uv.x += sin(time*1.5)*0.3;
	uv.y += cos(time*1.5)*0.3;
	uv*=0.5+sin(time)*0.2;
	float d = log(length(uv));
	d = (d*d);

    // smoother mod...
	float dmod = TimerInOut(vec4(Mtime(10.0),0.0, 9.5, 2.8));    
    d*=dmod;
    
	uv *= rot2(d);
    // snow...
	float c = 0.;
	c+=snow(uv,30.)*.3;
	c+=snow(uv,20.)*.5;
	c+=snow(uv,15.)*.8;
	c+=snow(uv,10.);
	c+=snow(uv,8.);
	c+=snow(uv,6.);
	c+=snow(uv,5.);
	c+=snow(uv,3.);
    return vec3(c*1.2,c*0.75,c*0.35) * d;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv=(fragCoord.xy*2.-iResolution.xy)/min(iResolution.x,iResolution.y); 
    fragColor = vec4(_snow(uv),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}