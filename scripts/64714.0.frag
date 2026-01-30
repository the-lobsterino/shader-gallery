/*
 * Original shader from: https://www.shadertoy.com/view/tdVGR1
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
float rand(vec2 p)
{
    vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 ouv = (fragCoord.xy - iResolution.xy * 0.5) / iResolution.x;
    
    float fCol = 0.;
    float t = iTime * 0.25;
    
    const float total = 7.;
    for(float i=1.; i<total; i+=1.){
        float iTotal = i/total;
        float niTotal = 1. - i/total;
                
        vec2 uv = ouv * (10. + i*1.) - vec2(0., t*(1.-i/total));
        vec2 id = floor(uv) + vec2(i*1000.);
        uv = fract(uv) - 0.5;
        
        for(float y=-1.; y<=1.; y+=1.){
            for(float x=-1.; x<=1.; x+=1.){   
                
                vec2 iuv = uv + vec2(x,y);    
                vec2 iid = id - vec2(x,y);  
                
                if(rand(iid * 200.) > .25){
                    iuv.x += rand(iid)-.5;
                    iuv.y += rand(vec2(rand(iid)))-.5;        

                    float l = length(iuv * (niTotal)*1.5);  
                    float size = rand(iid*5.)*.1 + .25 - .1;
                    float force = rand(iid*10.)*.5+.5;
                    fCol += 
                        smoothstep(l, l + (iTotal)*.25, size) *                         
                        niTotal *
                        force;        
                }                         
            }
        }        
    }
      
    fragColor = vec4(fCol);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}