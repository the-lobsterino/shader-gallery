/*
 * Original shader from: https://www.shadertoy.com/view/tsy3zc
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
// Code by Flopine
// Thanks to wsmind, leon, XT95, lsdlive, lamogui, Coyhot, Alkama and YX for teaching me
// Thanks LJ for giving me the love of shadercoding :3

// Thanks to the Cookie Collective, which build a cozy and safe environment for me 
// and others to sprout :)  https://twitter.com/CookieDemoparty

#define PI 3.141592
#define anim (2.*(iMouse.xy/iResolution.xy)-1.)

mat2 rot (float a)
{return mat2(cos(a),sin(a),-sin(a),cos(a));}

float xor (float a, float b)
{return (1.-a)*b + (1.-b)*a;}

float head (vec2 uv)
{
    uv.y +=0.2;
    float c = step(length(uv), 1.8);
    float uux = abs(uv.x)-0.5, uuy = uv.y;
    uuy -= .5+sin(uux*PI)*0.5;
    vec2 uu = vec2(uux,uuy);
    
    return xor(step(uu.y, -0.2),c)*c;
}

float ear (vec2 uv)
{	
    uv.x = abs(uv.x)-0.2;
    uv.x += sin(uv.y*1.5+PI);
    return step(uv.x + uv.y,0.2) * step(-0.4,uv.y);
}

float ears (vec2 uv)
{
    uv.y -= 0.75;
    uv.x = abs(uv.x) -1.7;
    uv *= rot(-PI/4.);
    uv *= rot(sin(iTime)*0.2);
    return ear(uv);
}

float face (vec2 uv)
{

   	uv -= clamp(anim,vec2(-0.4,-0.53),vec2(0.4,0.15));
    uv.x = abs(uv.x);
    vec2 uu = uv;
    
    uv += vec2(-0.9,0.3);
    float c = step(length(uv), 0.2);
    
    uv = uu;
    uv.y += 0.6;
    float n = step(uv.x - uv.y,0.2)*step(uv.y,0.05);
    
    uv = uu;
    uv.y += .8;
    uv.y -= uv.x * uv.x ;
    float m = step(abs(uv.x*0.9 + uv.y), 0.05)*step(-0.5,uv.y);
    return c+n+m;
}

float outline (vec2 uv)
{
    uv.y += 0.1;
    return step(length(uv),1.8) * step(1.7,length(uv));
}

float background (vec2 uv)
{
    float per = .9;
    uv *= rot(iTime);
    uv *= sin(iTime*0.3)*0.5+0.8;
    uv = mod(uv,per)-per*0.5;
    uv.x = abs(uv.x)-0.05;
    uv *= rot(-PI/4.);
    return step(length(uv*vec2(1.,0.5)),0.1);
}

vec3 husky (vec2 uv)
{
    uv *= 2.;
    vec3 col = vec3(1.);
    col -= vec3(0.4,0.3,0.3)*clamp(ears(uv)+head(uv),0.,1.);
    col -= vec3(1.)*face(uv);
    col -= vec3(1.)*outline(uv);
	col -= vec3(0.,1.,1.)*clamp(background(uv)-(step(length(uv), 1.8)+ears(uv)),0.,1.);
    return clamp(col,0.,1.);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = 2.*(fragCoord/iResolution.xy)-1.;

    uv.x *= iResolution.x/iResolution.y;
   
    vec3 col = husky(uv);
    
    // Output to screen
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 0., 0.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}