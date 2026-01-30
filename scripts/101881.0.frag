/*
 * Original shader from: https://www.shadertoy.com/view/slKcRW
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define pi 3.1415926535

mat2 Rot(float a) {
    float s=sin(a), c=cos(a);
    return mat2(c, -s, s, c);
}
vec2 N(float angle) {
    return vec2(sin(angle), cos(angle));
}

float circle(vec2 p, float r){
   return length(p)-r;
}

vec4 smin(vec4 a, vec4 b, float k) {
    float h = clamp(0.5 + 0.5*(a.a-b.a)/k, 0.0, 1.0);
    return mix(a, b, h) - k*h*(1.0-h);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float t = iTime*0.05+100.;
    vec2 uv = (fragCoord - iResolution.xy * 0.5) / iResolution.y;
    uv*=2.;
    
    vec2 id = floor(uv);
    float dir = 0.;
    mat2 rot = Rot(dir*pi);
    uv*=rot;
    vec2 center = vec2(0.);
    
    vec4 d1 = vec4(vec3(0), 10000.);
    vec4 d2 = vec4(vec3(0), 10000.);
    float n = 45.;
    float r = 0.04;//point size
    float dr = 0.08;//point scale
    float dk = 3.;//max k
    float w = 1.;//1 - circle, 2 - eight
    float sk = 3.;//speed of the worm
    
    float f = pi*2./n;
    float z = t*16.;
    float s = 3.;//speed of circle rotation
    float i1 = -z*s+floor(z*0.5)*(2.*sk+2.*s);
    float i2 = i1+n;;
    z = z*f*sk+pi-f*s;//+dir*f*n/4.;
    float i=i1;
    for(int ii=0;ii<100;ii++){
       if (i>=i2) break;
       float a = i*f;

       vec2 co = vec2(cos(a), sin(a*w)*1.);//position of single circle
       co.x = sign(co.x)*pow(abs(co.x), w)*w;

       float c = circle(uv-co*0.7-center,r+dr*(cos((a)*2.)*.5+.5));
       
       float ka = (a+z*(dir*2.-1.))*1.;
       float k = cos(ka)*.5+.5;
       k = pow(k, 250.)*dk;
       
       float tr = mod(i-i1, 3.);
       vec3 col = vec3(tr!=0., tr!=1.,tr!=2.);
       vec4 cc = vec4(col, c);
       
       k*= 9./n;
       if (i-i1<n/3.) d1 = smin(d1, cc, k);
       else  d2 = smin(d2, cc, k);
       i++;
    }
    vec4 dd = smin(d1, d2,0.)*5.;

    vec3 col = vec3(0);
    col+=dd.rgb*smoothstep(.01,.0, dd.a);
   
    float y = z+0.07;
    vec2 co = vec2(cos(y), sin(y*w)*1.);//eye
    co.x = sign(co.x)*pow(abs(co.x), w)*w;
    float c = circle(uv-co*0.79-center,0.02);
  
    float d = dd.a*.5;
    col-=vec3(5)*smoothstep(.01,.0, c);
   
  
   fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}