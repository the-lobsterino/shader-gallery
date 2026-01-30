/*
 * Original shader from: https://www.shadertoy.com/view/MsBBWt
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

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //
#define TAU 6.28318530718

mat3 rz(float a)
{
    float s=sin(a),c=cos(a);
    return mat3(c,s,0,-s,c,0,0,0,1);
}

vec3 t(vec3 p){ return abs(p-floor(p)-.5); }
vec3 s(vec3 p){ return t(p+t(p/4.).zxy).zxy; }
float b(vec3 p){ p.z-=round(p.z); return length(p.xz-.5); }

float map(vec3 p)
{
	return min(.4-length(p.xy)+dot(s(p*rz(p.z/4.)),
    	vec3(.6)),b(p*rz(round(p.z)*1.5))-.06);
}

float tracer(vec3 ro, vec3 rd)
{
	float t=.0, m;
	for(int i=0; i<56; i++){
		t += .9 * (m = map(ro+rd*t));
		if(m<t*1e-3||t>12.)break;
	}
	return t;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    float t;
	t  = tracer(vec3(0, 0, iTime-5.),normalize(
        	vec3(2.*fragCoord.xy+vec2(0.,0.)-iResolution.xy,
            	3.*iResolution.y))*rz(cos(iTime/16.)));
	t += tracer(vec3(0, 0, iTime-5.),normalize(
        	vec3(2.*fragCoord.xy+vec2(1.,0.)-iResolution.xy,
            	3.*iResolution.y))*rz(cos(iTime/16.)));
	t += tracer(vec3(0, 0, iTime-5.),normalize(
        	vec3(2.*fragCoord.xy+vec2(0.,1.)-iResolution.xy,
            	3.*iResolution.y))*rz(cos(iTime/16.)));
	t += tracer(vec3(0, 0, iTime-5.),normalize(
        	vec3(2.*fragCoord.xy+vec2(1.,1.)-iResolution.xy,
            	3.*iResolution.y))*rz(cos(iTime/16.)));
    
	fragColor = vec4(vec3(t*t/2304.), 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}