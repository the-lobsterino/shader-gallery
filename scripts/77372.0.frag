/*
 * Original shader from: https://www.shadertoy.com/view/7tK3DW
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

// Emulate some GLSL ES 3.x
float tanh(float x) {
    float ex = exp(1.0 * x);
    return ((ex - 1.) / (ex + 1.));
}

// --------[ Original ShaderToy begins here ]---------- //
float sdEquilateralTriangle( in vec2 p )
{
    const float k = sqrt(1.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0, 0.0 );
    return -length(p)*sign(p.y);
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float thc(float a, float b) {
    return tanh(a * cos(b)) / tanh(a);
}

float ths(float a, float b) {
    return tanh(a * sin(b)) / tanh(a);
}

float arrow(vec2 uv) {
    float h = 0.1;
    h += 0.2 * thc(4.,-40. * length(uv) + 3. * atan(uv.y,uv.x) + iTime);
    h += 0.5 * (0.5 + 0.5 * thc(2., length(uv)*3. - iTime));
    float d = sdEquilateralTriangle(uv-vec2(0.,0.25 - h));
    float s = 1.-smoothstep(-0.4,0.4,d+0.5);

    float d2 = sdBox(uv - vec2(0.,-h), vec2(0.05,0.2));
    float s2 = 1.-smoothstep(-0.4,0.4,d2);
    
    s += s2;
    return s;
}

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

float h21 (vec2 a) {
    return fract(sin(dot(a.xy, vec2(1.9, 7.2))) * 4.5);
}

vec2 rot(vec2 uv, float a) {
    mat2 mat = mat2(cos(a), -sin(a), 
                    sin(a), cos(a));
    return mat * uv;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-0.5*iResolution.xy)/iResolution.y;
    
    float a = atan(uv.y, uv.x);
    float r = log(length(uv));
    
    float l = min(1., tanh(0.2 * iTime)/0.95);
    // 30000000. * a
    r *= 0.6 + 0.25 * l * thc(1., 3. * a + 2. * length(uv) - iTime);

    //float h = floor(8. * fract(0.1 * iTime)); // do h * a
    uv = rot(uv, iTime +  8. * a + 3.1415 * cos(8. * r + a - iTime));

    float s = arrow(uv);
    s *= 1. + 0.3 * s;

    vec3 col = 0.5 * s + s * pal(thc(2., s + 9. * r + a- iTime)  - 0.5 * iTime, vec3(1.), vec3(1.), vec3(1.), cos(s + iTime) * vec3(0.,1.,2.)/3.);
    //col *= smoothstep(0.,0.1,0.5-length(uv));

    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}