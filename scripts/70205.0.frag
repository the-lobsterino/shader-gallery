/*
 * Original shader from: https://www.shadertoy.com/view/wdVBWd
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// https://twitter.com/gam0022/status/1339584625929175042

#define t fract(dot(surfacePosition,surfacePosition))
#define r iResolution
void mainImage( out vec4 o, in vec2 FC )
{
float z = dot(surfacePosition,surfacePosition);//surfaceSize.x+surfaceSize.y;
float s = exp(abs(tan(z))*11.0-6.0);
float v = fract(z)*128.0;
vec2 p=surfacePosition*v/(vec2(s,1.0-s));//FC.xy/min(r.x,r.y)*8.;
float a=length(p);
	a += 6.*t*smoothstep(22.10  ,1.20001,length(p-vec2(5.0,3.0))*1.06+2.08*sin(t)+1.06);;
p+=0.08*tan(a)*cos(a);
	
	 
	
o=vec4(1.20,.3,1.0,0)*mod(floor(p.x)+floor(p.y),2.1)*(2.+sin(a+3.0))+0.1;
o.a = 1.0;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}