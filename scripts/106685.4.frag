


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
vec2 rand(vec2 p)
{
    float n = sin(dot(p, vec2(1, 113)));
    return fract(vec2(262144, 32768)*n);     
}


float sdRoundBox(vec2 p, vec2 b, float r)
{
  vec2 q = abs(p) - b;
  return length(max(q,.0)) + min(max(q.x,q.y),.0) - r;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec3 col;
    vec2 uv = (fragCoord-iResolution.xy*.5)/iResolution.y;
    float g = smoothstep(.0, .25, uv.y+.15)+.25;
//    uv *= 20.+sin(iTime+uv.x)*4.0;
    uv *= 20.+sin(iTime+uv.y+length(uv*4.0))*3.2;
	uv.y = 1. - abs(uv.y);
    vec2 fl = floor(uv);
    vec2 fr = (fract(uv)-.5)*2.;
    float a = sdRoundBox(fr, vec2(.7, .7), .1);
    float s = smoothstep(0.1, 0.01, a);
    vec2 ran = rand(fl);
    float t = pow(abs(sin(ran.x*6.2831 + iTime*(.25 + ran.y))), 8.);
    col = vec3(ran.x * ran.y*2.0, ran.y, 0.3+ran.x*0.7)*g*s*t;
    fragColor = vec4(col,1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}