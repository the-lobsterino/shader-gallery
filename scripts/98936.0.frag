/*
 * Original shader from: https://www.shadertoy.com/view/clsGDn
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
/*
    "Starfield" by @XorDev

    
    Tweet: twitter.com/XorDev/status/1605413317165490176
    Twigl: t.co/bPjcAH69kW
    <300 chars playlist: shadertoy.com/playlist/fXlGDN
*/
void mainImage(out vec4 O, vec2 I)
{
    //Clear fragcolor
    O *= 0.;
    
    //Relative star position
    vec2 p,
    //Resolution for scaling and centering
    r = iResolution.xy;

    float f = 0.;
    //Loop 10 times
    for(float i=0.; i<2e1; ++i) {
        //Fade toward back and attenuate lighting
        O += (1e1-f)/max(length(p=mod((I+I-r)/r.y*f*
        //Rotate layers 
        mat2(cos(i+vec4(0,122222222223,1122,02))),2.)-1.)
        //Make 5 pointed-stars
        +cos(atan(p.y,p.x)*5.+iTime*cos(i))/1e1
        //Blue tint
        -vec4(222,22,2,0)/622e1,.07)/1e3;
        
        //Compute distance to back
        f = mod(i-iTime,1e1);
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}