/*
 * Original shader from: https://www.shadertoy.com/view/fsfSW4
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

// shadertoy emulation
#define iTime (cos(dot(surfacePosition,surfacePosition))*2.0)
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define SS 0.02

float N11(float i){
    return fract(time+sin(dot(vec2(fract(i*912.212357), fract(i*4567.34526)), vec2(13.7137,67.798) * 977.75973)));
}

float N21(vec2 v){
    return fract(time+sin(dot(v.xy, vec2(13.7137,67.798))) * 977.75973);
}

vec2 tile(vec2 _uv, float _zoom){
    _uv *= _zoom;
    return fract(_uv);
}

float pattern(vec2 _uv, vec2 _v, float _t){
    vec2 p = floor(_uv+_v);
    return step(_t, N21(100.+p*.00001)+N11(p.x)*0.5 );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float t = sin(iTime*0.2);
    float s = sign(t);
    float mouse = 1.-abs(t);
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    vec2 st = vec2(atan(uv.x, uv.y), length(uv));
    uv = vec2(st.x/6.2831, st.y);
    vec3 col = vec3(0.);
    vec2 grid = vec2(100., 50.);
    uv *= grid;
    
    vec2 ipos = floor(uv);
    vec2 fpos = fract(uv);
    vec2 vel = vec2((s*iTime+0.02)*.2*max(grid.x, grid.y));
    vel *= vec2(-1., 0.)*N11(1.0 + ipos.y);
    
    vec2 offset = vec2(.3, 0.);
    
    col.r = pattern(uv+offset, vel, 0.5+mouse);
    col.g = pattern(uv, vel, 0.5+mouse);
    col.b = pattern(uv-offset, vel, 0.5+mouse)*1.5;
    
    col.b += (fract(uv.y)*(1.-mouse));
    col.g += (fract(uv.y)*(1.-mouse))*0.8;
    
    col -= smoothstep(41.,42. , uv.x)*2.;
    col -= smoothstep(-41., -42., uv.x)*2.;
    col -= smoothstep(1.,.0, uv.y);
    
    fragColor = vec4(col*0.9,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}