/*
 * Original shader from: https://www.shadertoy.com/view/wlyBRd
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
// un-obfuscated version of 
// https://twitter.com/gaziya5/status/1366948486671790083

mat2 rotate2D(float r){
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}
vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}


float fractal(vec3 p){
	float d = 0.;
	
	for(int i = 0 ; i < 99;i ++){
	
	p.xz *= rotate2D(0.);	
	
	float e =  3./min(dot(p,p),50.);
	float s =  3. * e;
		
	p = abs(p)*e;
		
		for(int i = 0 ; i < 5; i ++){
		p = vec3(2.,4.,2.) - abs(p-vec3(2.,4.,2.));
			e = 8./ min(dot(p,p), 9.);
			p = abs(p) * e;
			s *= e;
		}
		
		e = min(length(p.xz-.1),p.y)/ s;
		d =+ e;
		
	}
	
	return 0.;
}


void mainImage( out vec4 o, in vec2 fragCoord )
{
    o = vec4(0.);
    vec2 r = iResolution.xy;
    float g = 0.;
    
    for(float i=0.; i<99.; ++i )
    {
        vec3 p = vec3(g*(fragCoord.xy-.5*r)/r.y+.4, g-1.);
        p.xz *= rotate2D(0.*.3);        
        
        float e = 3. / min(dot(p,p),50.);
        float s = 3. * e;
        
        p = abs(p)*e;
        
        for(int i=0; i<5; i++)
        {
            p = vec3(2,4,2)- abs(p-vec3(4,4,2));
            e = 8. / min(dot(p,p),9.);
            
            p = abs(p)*e;
            s*=e;
        }
        
        e = min(length(p.xz)-.1,p.y)/s;
        g += e;
        if (e <.001) 
        {
            o+=.4/i;
        }
    }
}


// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}