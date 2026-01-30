// N080920N

/*
 * Original shader from: https://www.shadertoy.com/view/WtjfRG
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
float iTime;
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// Author: bitless
// Title: Microwaves

// Thanks to Patricio Gonzalez Vivo & Jen Lowe for "The Book of Shaders"
// and Fabrice Neyret (FabriceNeyret2) for https://shadertoyunofficial.wordpress.com/
// and Inigo Quilez (iq) for  http://www.iquilezles.org/www/index.htm
// and whole Shadertoy community for inspiration.

#define p(t, a, b, c, d) ( a + b*cos( 6.28318*(c*t+d) ) ) //palette function (https://www.iquilezles.org/www/articles/palettes/palettes.htm)
#define S(x,y,z) smoothstep(x,y,z)

float w(float x, float p){ //sin wave function
    /*x *= 5.;
    float t= p*.5+sin(iTime*.25)*10.5;
    return (sin(x*.25 + t)*5. + sin(x*4.5 + t*3.)*.2 + sin(x + t*3.)*2.3  + sin(x*.8 + t*1.1)*2.5)*0.275;*/
	
	return sin(x)*cos(p*iTime*0.01);
}



void mainImage( out vec4 fragColor, in vec2 g)
{
    vec2 r = iResolution.xy
        ,st = (g+g-r)/r.y;

    float 	th = .05 //thickness
    		,sm = 15./r.y+.85*length(S(vec2(01.,.2),vec2(2.,.7),abs(st))) //smoothing factor
    		,c = 0. 
            ,t = iTime*0.25
            ,n = floor((st.y+t)/.1)
            ,y = fract((st.y+t)/.1);
    
    vec3 clr = vec3(0.);
    for (float i = -5.;i<5.;i++)
    {
        float f = w(st.x,(n-i))-y-i;
        c = mix(c,0.,S(-0.3,abs(st.y),f));
        c += S(th+sm,th-sm,abs(f))
            *(1.-abs(st.y)*.75)
            + S(5.5-abs(f*0.5),0.,f)*0.25;
            
        clr = mix(clr,p(sin((n-i)*.15),vec3(.5),vec3(.5), vec3(.270), vec3(.0,.05,0.15))*c,S(-0.3,abs(st.y),f)*1.);
    }
    fragColor = vec4(clr,1.);
}
// --------[ Original ShaderToy ends here ]---------- //

uniform sampler2D backbuffer;
varying vec2 surfacePosition;
void main(void)
{
	iTime = 0.;
	vec4 fc = texture2D(backbuffer, gl_FragCoord.xy/resolution);
	iTime = 7.*cos(time/4.+length(fc)*10.);
	iTime *= (1. + length(fc)*8.-fc.r*fc.r*5.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
	float f1 = iTime;
	vec2 v1 = vec2(cos(f1),sin(f1));
	float f2 = iTime + gl_FragCoord.x;
	vec2 v2 = vec2(cos(f2),sin(f2));
	float f3 = iTime + gl_FragCoord.y;
	vec2 v3 = vec2(cos(f3),sin(f3));
	float f4 = iTime + gl_FragCoord.y*resolution.x + gl_FragCoord.x;
	vec2 v4 = vec2(cos(f4),sin(f4));
	
	float l1 = 7.;
	float l2 = 4.;
	
	vec4 s1 = texture2D(backbuffer, fract((gl_FragCoord.xy-normalize(surfacePosition)*l1+l2*v1)/resolution));
	vec4 s2 = texture2D(backbuffer, fract((gl_FragCoord.xy-normalize(surfacePosition)*l1+l2*v2)/resolution));
	vec4 s3 = texture2D(backbuffer, fract((gl_FragCoord.xy-normalize(surfacePosition)*l1+l2*v3)/resolution));
	vec4 s4 = texture2D(backbuffer, fract((gl_FragCoord.xy-normalize(surfacePosition)*l1+l2*v4)/resolution));
	
	gl_FragColor = max(gl_FragColor, .25*(s1+s2+s3+s4)-1./256.);
	
}