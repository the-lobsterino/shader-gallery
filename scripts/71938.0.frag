/*
 * Original shader from: https://www.shadertoy.com/view/NslGRM
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
#define ft float
#define num 20.

float rand(vec2 v, float n){
    return fract(n+sin(dot(fract((v+3.1415)*5545.7),v)));
}

float in_tri(ft x, ft y, ft x1, ft y1, ft x2, ft y2, ft x3, ft y3){
	ft a = ((y2 - y3)*(x - x3) + (x3 - x2)*(y - y3)) / ((y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3));
	ft b = ((y3 - y1)*(x - x3) + (x1 - x3)*(y - y3)) / ((y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3));
	ft c = 1. - a - b;
    return step(0.,a)*step(a, 1.)*step(0., b)*step(b, 1.)*step(0., c)*step(c, 1.);
}

void mainImage( out vec4 cc, in vec2 fc )
{
    vec2 uv = (2.*fc-iResolution.xy)/iResolution.y;

    vec2 v = uv*num;
    float t = iTime*.4;
    vec2 vf = mix(vec2(rand(floor(v+t),t)), vec2(rand(floor(v+t+.5),t)), abs(fract(v)-.5)*2.);     
    float cf = dot(vf,vec2(1.));

    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
    
    float xedge = sin(iTime)*.7;   
    ft f = in_tri(uv.x, uv.y, -xedge, .0, .0, .9, .0, .3);
      f += in_tri(uv.x, uv.y, xedge, .0, .0, .3, .0, .9);
      f += in_tri(uv.x, uv.y, -xedge, -.02, .0, -.32, .0, .28);
      f += in_tri(uv.x, uv.y, xedge, -.02, .0, -.32, .0, .28);
      f += in_tri(uv.x, uv.y, -xedge, -.1, .0, -.9, .0, -.4);
      f += in_tri(uv.x, uv.y, xedge, -.1, .0, -.9, .0, -.4);

    vec3 ccf = cos(t+vec3(2.5,2.2,1.3)*cf)*.5+.5;
    ccf.y *= .4;
    cc = vec4(ccf*(1.-f)+(f*col),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}