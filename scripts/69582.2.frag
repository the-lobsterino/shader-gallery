/*
 * Original shader from: https://www.shadertoy.com/view/3llBWj
 */

#ifdef GL_ES
precision mediump float;
// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
#endif


// shadertoy emulation
//#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define R iResolution.xy
#define SS(U) smoothstep(0.,PX,U)
#define T iTime/225.
#define S 5.
#define PX (S*6.)/R.y
vec3 hsv(float h, float s, float v){
    vec4 t = vec4(.9, 1.90 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

void mainImage( out vec4 c, in vec2 f )
{
    vec2 p = S*(2.*f-R)/R.y /(10.+300.*(1.-mouse.y));
    p+=vec2(-mouse.x+.3,.18);
    
    float s = 1., l;
    
    for(int i=0;i<99;i++)
    {
        l = dot(p,p)/2.;
        
        s /= l;
        p /= l;
        
        p.xy = p.yx;
        
        p.x = mod(p.x,3.)-1.;
    }
    
    p/=s;
    
    float col=length(p)* SS(length(p))*2.;
	col=pow(mod(col,7.)*11.8,.33);
	col+=sqrt(col);
    float 
	    sat=floor(col*100.), 		// 1st 2 d.p. of input = larger variations -> output level of saturation
	    hue=floor(col*10000.)-sat;	// 3rd and 4th d.p. of input = small brightness variations -> output color hue
    c.rgb = 1.-hsv(hue/10000.,sat/100.,1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}