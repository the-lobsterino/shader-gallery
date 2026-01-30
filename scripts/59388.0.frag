/*
 * Original shader from: https://www.shadertoy.com/view/wtt3Dr
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

// Emulate a black texture
#define texelFetch(s, uv, lod) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
mat3 rotX (in float a) 
{
 float c = cos(a); float s = sin (a); 
 return mat3 (vec3 (1., .0, .0), vec3 (.0, c, s), vec3 (.0, -s, c));
}
mat3 rotY (in float a) 
{
 float c = cos(a); float s = sin (a); 
 return mat3 (vec3 (c, .0, s), vec3 (.0, 1., .0), vec3 (-s, .0, c));
}
mat3 rotZ (in float a) 
{
 float c = cos(a); float s = sin (a);
 return mat3 (vec3 (c, s, .0), vec3 (-s, c, .0), vec3 (.0, .0, 1.));
}
mat2 rot2d (in float a) 
{ 
 float c = cos (a); float s = sin (a); 
 return mat2 (vec2 (c, s), vec2 (-s, c)); 
}

float sdTorus (in vec3 p, in vec2 r) 
{ 
 float x = length(p.xz) -r.x;
 return length(vec2(x,p.y))-r.y;
}

vec3 opRepeat (in vec3 p, in vec3 size) 
{
 return mod (p, 2. * size) - size;
}

vec3 doTwist(in vec3 p)
{
 float f = sin(iTime)*3.;
 float c = cos(f*p.x);
 float s = sin(f*p.x);
 mat2  m = mat2(c,-s,s,c);
 return vec3(p.y,m*p.yx);
}

vec3 doTwist2(in vec3 p)
{
 float f = sin(iTime)*4.;
 float c = cos(f*p.z);
 float s = sin(f*p.z);
 mat2  m = mat2(c,-s,s,c);
 return vec3(p.y,m*p.yz);
}

vec3 doTwist3(in vec3 p)
{
 float f = sin(iTime)*2.;
 float c = cos(f*p.y);
 float s = sin(f*p.y);
 mat2  m = mat2(c,-s,s,c);
 return vec3(p.y,m*p.xy);
}

float sdTruchet (in vec3 p, in vec3 t)
{
 float offset = t.y;
 vec3 p2 = vec3 (doTwist2(p - vec3 (.0, -offset, offset))) * rotZ (radians (90.));
 vec3 p3 = vec3 (doTwist3(p - vec3 (-offset, .0, -offset))) * rotY (radians (90.));
 float t2 = sdTorus (p2, t.xy);
 float t3 = sdTorus (p3, t.xy);    
 return min(t3,t2);
}






float map (vec3 p)
{
 float selector = fract(sin(dot(floor(p) + 13.37, vec3(7., 157., 113.)))*43758.5453);
 if (selector > .75) {
  p = p;
 } else if (selector > .15) {
  p = p.yzx;
 } else if (selector > .25) {
  p = p.zxy;
 } 	
 float u = sdTruchet ( opRepeat (p, vec3 (.5)), vec3(.4,.05,0.4));
 return u;
}

float GetDist (vec3 p) 
{
 float d;
 return  d ;
}

float trace(vec3 o, vec3 r)
{
 float t = 0.0;
 for(int i=0; i<164; i++)
 {
  vec3 p = o + r * t;
  float d = map(p);
  t += d * 0.15;
 }
 return t;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
 vec2 uv = fragCoord/iResolution.xy;
 uv = uv * 2.0 - 1.0;
 uv.x *= iResolution.x / iResolution.y;
 vec3 r = normalize(vec3(uv,.5));   
 //motion blurr algorithm // by noby:   https://www.shadertoy.com/view/wljSz1
 const float tm = 3.;
 const int samples = 1;
 float T = iTime*tm / 3.;
 float ot = T;
 for(int y = 0; y < samples; ++y)
 for(int x = 0; x < samples; ++x)
 {
  vec2 p = -1.0 + 3.0 * (uv + (-0.5+(vec2(x, y)/float(samples)))/iResolution.xy);
  p.x *= iResolution.x/iResolution.y;  
  float r = texelFetch(iChannel0, ivec2(mod(fragCoord*float(samples)+vec2(x,y),1024.)),0).r;
  T = ot+(tm*r)/36.0;
 };
     
     
 float the = iTime *0.15;
 r.yz *= mat2(cos(the), -sin(the), sin(the), cos(the));
 r.xz *= mat2(cos(the), -sin(the), sin(the), cos(the));
 vec3 o = vec3(atan(-3.),atan(-3.),T );
 float t = trace(o,r);
 float fog = 1. / (1. + t * t * 1.8); 
 vec3 fc = vec3(fog); 
 fc *=vec3((smoothstep(0.,2.,tan(-iTime+t*.5)))+0.3);   
 fragColor = vec4(fc,1.0);    
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}