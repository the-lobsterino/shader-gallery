/*
 * Original shader from: https://www.shadertoy.com/view/tsfyRM
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
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
#define MAX_STEPS 40
#define MAX_DIST 3.5
#define SURF_DIST .001


vec2 condmin(in vec2 d1, in vec2 d2) {
return vec2(min(d1.x, d2.x), mix(d1.y, d2.y, step(d2.x, d1.x)));
}

const float PI = 3.14159265;

mat3 rotate( in vec3 v, in float angle)
{
 float c = cos(radians(angle));
 float s = sin(radians(angle));	
 return mat3(c + (1.0 - c) * v.x * v.x, (1.0 - c) * v.x * v.y - s * v.z, (1.0 - c) * v.x * v.z + s * v.y,
 (1.0 - c) * v.x * v.y + s * v.z, c + (1.0 - c) * v.y * v.y, (1.0 - c) * v.y * v.z - s * v.x,
 (1.0 - c) * v.x * v.z - s * v.y, (1.0 - c) * v.y * v.z + s * v.x, c + (1.0 - c) * v.z * v.z
 );
}

float box( in vec3 p, in vec3 data )
{
 return max(max(abs(p.x)-data.x,abs(p.y)-data.y),abs(p.z)-data.z);
}

float sdOctahedron( vec3 p, float s)
{
 p = abs(p);
 return (p.x+p.y+p.z-s)*0.57735027;
}

mat2 Rot(float a) {
 float s = sin(a);
 float c = cos(a);
 return mat2(c, -s, s, c);
}

float smin( float a, float b, float k ) {
 float h = clamp( 0.5+0.5*(b-a)/k, 0., 1. );
 return mix( b, a, h ) - k*h*(1.0-h);
}

float sdSphere(vec3 p, float s)
{
 return length(p) - s;
}

float sdBox(vec3 p, vec3 s) {
 p = abs(p)-s;
 return length(max(p, 0.))+min(max(p.x, max(p.y, p.z)), 0.);
}

float g1 = 0.;
float g2 = 0.;
float g3 = 0.;

vec2 path(float z){
 float x = sin(z) + 3.0 * cos(z * 0.5) + .1 * sin(z * 0.12345);
 float y = cos(z) + 1.5 * sin(z * 0.3) + .1 * cos(z * 2.12345);
 return vec2(x,y);
}


float GetDist(vec3 p) {
 float d;
 vec3 p2 = p;
 float gap = 1.;
 p2.y = mod(p.y + gap,2.0 * gap) - gap;
 p2.z = mod(p.z + gap,2.0 * gap) - gap;
 p2.x = mod(p.x + gap,2.0 * gap) - gap;
 float box = sdBox(p2-vec3(0,0.,0), vec3(0.3,.6,.3));
 float box2 = sdBox(p2-vec3(0,0.,0), vec3(0.3,.2,1.));
 float box3 = sdBox(p2-vec3(0,0.,0), vec3(1.,.4,0.3));
 float prev = 1.;
 vec3 p1 = vec3( p- vec3(1.,1.,sin(iTime-3.)+iTime)); 
 float the = iTime *1.3;
 p1.x = abs(p1.x)-1.;
 p1.yz *= mat2(cos(the), -sin(the), sin(the), cos(the));
 the = iTime *0.1;
 p1.zx *= mat2(cos(the), -sin(the), sin(the), cos(the));
 p2 = vec3( p- vec3(1.,1.,sin(iTime-.5)+iTime)); 
 the = iTime *-.5;
 p2.xz *= mat2(cos(the), -sin(the), sin(the), cos(the));
 the = iTime *.5;
 p2.xy *= mat2(cos(the), -sin(the), sin(the), cos(the));
 float dbox = sdOctahedron( p1,.2);
 float dbox2 = sdBox( p2,vec3(.2));
 g1 +=1./(.1+pow(abs(dbox2),5.));
 g2 +=1./(0.1+pow(abs(dbox),5.));
 g3 +=1./(1.+pow(abs(box),1.));
 prev = dbox;
 dbox = min(dbox,dbox2);
 box = min(box3,box);
 box = min(box2,box);
 dbox = min(dbox,box);
 d = dbox;
 return d ;
}

float RayMarch(vec3 ro, vec3 rd) {
 float dO=0.;  
 for(int i=0; i<MAX_STEPS; i++) {
  vec3 p = ro + rd*dO;
  float dS = GetDist(p);      
  if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
   dO += dS;
  }  
 return dO;
}

vec3 GetNormal(vec3 p) {
 float d = GetDist(p);
 vec2 e = vec2(.001, 0);
 vec3 n = d - vec3(
 GetDist(p-e.xyy),
 GetDist(p-e.yxy),
 GetDist(p-e.yyx));
 return normalize(n);
}

float GetLight(vec3 p) {
 vec3 lightPos = vec3(1, 0.,iTime);
 vec3 l = normalize(lightPos-p);
 vec3 n = GetNormal(p);
 float dif = clamp(dot(n, l)*.5+.5, 0., 1.);
 float d = RayMarch(p+n*SURF_DIST*10., l);
 return dif;
}

vec3 R(vec2 uv, vec3 p, vec3 l, float z) {
 vec3 f = normalize(l-p),
 r = normalize(cross(vec3(0,1,0), f)),
 u = cross(f,r),
 c = p+f*z,
 i = c + uv.x*r + uv.y*u,
 d = normalize(i-p);
 return d;
}

float clampeddot(vec3 a, vec3 b){
 return max(0.,dot(a, b));
}


float specular(vec3 normal, vec3 dir){
 vec3 h = normalize(normal - dir);
 float specularityCoef = 20.;
 return clamp( pow(clampeddot(h, normal), specularityCoef), 0.0, 1.0);
}


mat3 setCamera( in vec3 ro, in vec3 ta, float cr ){
 vec3 cw = normalize(ta-ro);
 vec3 cp = vec3(sin(cr), cos(cr),0.0);
 vec3 cu = normalize( cross(cw,cp) );
 vec3 cv = cross(cu,cw);
 return mat3( cu, cv, cw );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
 vec2 uv =( 2. * fragCoord.xy - iResolution.xy ) / iResolution.y;
 vec2 m = iMouse.xy/iResolution.xy;
 vec3 col = vec3(0);

 vec3 eye = 1.0*vec3(1.,1.,iTime+1.5); 
 vec3 hoek = vec3(0., 1, 0.0);  
 mat3 camera = setCamera( eye, hoek,sin(iTime*0.2));
 float fov = 0.8;
 vec3 dir = camera * normalize(vec3(uv, fov));

 const float lensResolution = 2.;
 const float focalLenght =1.;
 const float lensAperture = .03;
 float shiftIteration =1.;
 const float inc = 1./lensResolution;
 const float start = inc/2.-.5;
 vec3 red = vec3(1.0, 0., 0.);
 vec3 blu = vec3(0., 0.0, 1);
 vec3 focalPoint = eye + (dir * focalLenght);
 for (float stepX = start; stepX < 0.5; stepX+=inc){
 for (float stepY = start; stepY < .5; stepY+=inc){
 vec2 shiftedOrigin = vec2(stepX, stepY) * lensAperture;
  if (length(shiftedOrigin)<(lensAperture/2.)){
  vec3 shiftedRayOrigin = eye;
  shiftedRayOrigin.x += shiftedOrigin.x;
  shiftedRayOrigin.y += shiftedOrigin.y;
  vec3 shiftedRay = (focalPoint - shiftedRayOrigin);
  float d = RayMarch(shiftedRayOrigin, shiftedRay);
  float fog =1. / (2. + d * d * 1.);
  d = (fog);
   if (d < MAX_DIST) {
    vec3 p = (shiftedRayOrigin += (d) * shiftedRay );
    vec3 normal = GetNormal(p);
    float diffLight = GetLight(normal);
    float specLight = specular(normal, shiftedRay);
    col += (diffLight + specLight ) * red;
   } else {
    col += blu;
   }
  shiftIteration ++;
  }
 }
 }
 vec3 d = sqrt(clamp(col/shiftIteration, 0., 1.));
 d *=g3*vec3(0.001)*vec3(0.,0.5,1.);   
 d +=g1*vec3(0.002)*vec3(sin(iTime-2.),0,sin(iTime-2.)-.8);    
 d +=g2*vec3(0.001)*vec3(cos(iTime),cos(iTime),0);    
 vec3 sky = vec3(1., 0., 1.);
 d = mix(sky, d, 1.0/(d.x*d.x/1./1.*.1+1.13)); 
 d*= 1.2;
 fragColor = vec4(d,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}