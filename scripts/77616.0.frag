/*
 * Original shader from: https://www.shadertoy.com/view/sl3SRH
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
#define S(a, b, t) smoothstep(a, b, t)

float TaperBox(vec2 p, float wb, float wt, float yb, float yt, float blur)
{
    float m = S(-blur,blur,p.y-yb);
    m *= S(blur,-blur,p.y-yt);
    
    p.x = abs(p.x);
    
    //0 p.y=yb 1 p.y=yt
    float w = mix(wb, wt, (p.y-yb) / (yt - yb));
    m *= S(blur,-blur,p.x-w);
    
    return m;
}

vec4 Tree(vec2 uv, vec3 col, float blur)
{
   
    float m = TaperBox(uv, .03, .03, -.05, .25,blur); //trunk
    m += TaperBox(uv, .2, .1, .25,0.5,blur); //canopy 1
    m += TaperBox(uv, .15, .05,0.5,0.75,blur); //canopy 2
    m += TaperBox(uv, .1, .0, .75, 1.,blur); //canopy 3
    
    float shadow = TaperBox(uv-vec2(.2,0), 0.1, 0.5, 0.15, 0.25, blur);
    shadow += TaperBox(uv+vec2(.3,0), 0.1, 0.5, 0.43, 0.5, blur);
    shadow += TaperBox(uv-vec2(.25,0), 0.1, 0.5, 0.7, 0.75, blur);
    
    col -= shadow*0.8;
    //m = 1.;
    
    return vec4(col, m);
}

float GetHeight(float x) 
{
    return sin(x*0.371)+sin(x)*0.274;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y; //normalize uv to centered on screen
    
    uv.x += iTime*.1;
    //uv.y += 0.5;
    uv *= 5.0;
    

    vec4 col = vec4(0.0);
    float blur = 0.005;
    
    float id = floor(uv.x);
    float n = fract(sin(id*139.13)*5234.2)*2.-0.1;
    float x = n*0.15;
    float y = GetHeight(uv.x);
    
    col += S(blur, -blur, uv.y+y);//ground
    
    y = GetHeight(id+0.5+x);
    
    
    uv.x = fract(uv.x)-0.5;
    
    vec4 tree = Tree((uv-vec2(x,-y))*vec2(1,0.8+n*0.2),vec3(1.0), blur);
    
    //col.rg = uv;
    
    col = mix(col, tree, tree.a);
    
    
    
    //Draw a graph
    float thickness = 1./iResolution.y;
    //if(abs(uv.x)<thickness) col.g = 1.0;
    //if(abs(uv.y)<thickness) col.r = 1.0;

    fragColor = col;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}