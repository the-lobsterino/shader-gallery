// is PLASMA SHIT V12 YES 
#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
const vec2 vp = vec2(100.0, 100.0);
vec3 hsv2rgb(float h,float s,float v) {
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	float t = iTime*0.5;// + iMouse.x;
	vec2 uv = fragCoord.xy / iResolution.xy;
	uv-=0.5;
	
	float fff = sin(length(uv*5.0)+t);
	uv*=0.5;
	
	uv *= 1.2;
    vec2 p0 = (uv - 0.5) * vp;
    vec2 hvp = vp * 0.5;
	vec2 p1d = vec2(cos( t / 13.5),  sin( t / 13.0)) * hvp - p0;
	vec2 p2d = vec2(sin(-t / 6.2), cos(-t / 6.0)) * hvp - p0;
	vec2 p3d = vec2(cos(-t / 3.7), cos( t / 3.5))  * hvp - p0;
	
	
    float sum = 0.5 + 0.5 * (
		cos(length(p1d) / 4.0) +
		cos(length(p2d) / 4.0) +
		sin(length(p3d) / 4.0) * sin(p3d.x / 1.2) * sin(p3d.y / 7.6));
	float ff = 0.5+sin(t*.3+fract(sum)*6.28)*0.5;
	
	ff *= 0.15;
	vec3 ccol = hsv2rgb(fff+ff+t*0.3,0.8,0.8);
	
    fragColor = vec4(ccol,1.0);
}


// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}//