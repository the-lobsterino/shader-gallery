/*
 * Original shader from: https://www.shadertoy.com/view/4dKGWW
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
float iTime = 0.;
#define iResolution resolution
const vec4 iMouse = vec4(0.);

// Emulate a black texture
#define texture(s, uv) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
/*
"Cloth Texture Simulation" by Emmanuel Keller aka Tambako - February 2016
License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
Contact: tamby@tambako.ch
*/

#define pi 3.141593

struct Lamp
{
  vec3 position;
  vec3 color;
  float intensity;
  float attenuation;
};
    
Lamp lamps[2];

const vec3 campos0 = vec3(40.3, -26.0, 1.2);
vec3 campos;
vec3 camdir = vec3(0., 0.75, -1.);
vec3 camtarget0 = vec3(40.3, -26.0 , 0.);
float fov = 10.;

const vec3 ambientColor = vec3(0.3, 0.4, 0.5);
const float ambientint = 0.03;
const vec3 objcolor1 = vec3(0.87);
const vec3 objcolor2 = vec3(0.39, 0.62, 0.85);
const vec3 objcolor3 = vec3(0.85, 0.33, 0.23);

const float tbrl = 3.;
const float difi = 0.73;
const float specint = 0.002;
const float specshin = 0.8;
const float aoint = 0.42;
const float ssstrmr = 0.18;
const float sssInt = 0.35;

const float txti0 = 0.4;
const float txtf = 30.;

float normdelta = 0.00002;

const float fr0 = 0.022;
float fr;
const float fe = 0.057;
const float fd = 0.395;
const float fds = 0.176;
const float twf = 65.;
const float twfs = -110.;
const float clsize = 60.;
const float tdv = 0.22;
const float tdd = 0.15;
const float ttwd = 0.002;
const float crv = 0.2;
const vec2 ffa = vec2(0.14, 0.37);
const float fft = 0.68;

const float maxdist = 1500.;

// Be careful setting it, since it drastically increase the compiling time, but in the other
// hand, it reduces the moire quite much.
//#define ANTIALIASING
const float aawidth = 0.63;
const int aasamples = 1;

#define SPECULAR
#define SH_OA
#define SS_SCATERING
#define COL_TEXTURE
#define POSSIZE_VAR

float gtf;
float gtf2;

vec2 rotateVec(vec2 vect, float angle)
{
    vec2 rv;
    rv.x = vect.x*cos(angle) + vect.y*sin(angle);
    rv.y = vect.x*sin(angle) - vect.y*cos(angle);
    return rv;
}

// Simple "random" function
float random(float co)
{
    return fract(sin(co*752.19) * 238.5);
}

float map_f_hor(vec3 pos, vec2 delta, float n)
{
    return length(vec2(mod(pos.y + delta.x, fe) - fe*0.6, pos.z + delta.y + fr*sin((pos.x + fe*2. + fe*floor(pos.y/fe))/fe*pi))) - fr*fds*0.86;
}

float hsf;
float map_hor_small(vec3 pos, vec2 delta, float n)
{
    float fy = 132.*random(12.54*floor(pos.y/fe));
    float ad = 1. + ttwd*hsf;
                          
    float angle = ad*twf*pos.x;
    vec2 d1 = rotateVec(vec2(fr*fd, fr*fd), angle);
    vec2 d2 = d1.yx*vec2(1., -1);
    return min(min(min(map_f_hor(pos, d1 + delta, n + 1.), map_f_hor(pos, d2 + delta, n + 2.)), map_f_hor(pos, -d2 + delta, n + 3.)), map_f_hor(pos, -d1 + delta, n + 4.)); 
}

float pyd;
float map_hor(vec3 pos)
{  
    float fy = 132.*random(1.254*floor(pos.y/fe));

    fy = 17.5*random(2.452*floor(pos.y/fe));
    pyd = fe*tdd*(1. - 0.45*0.5*sin(pos.x*2.15 + 13.*fy) - 0.3*0.5*sin(pos.x*4.12 + 42.*fy) - 0.25*0.5*sin(pos.y*8.72 + 70.*fy));
    pos.y+= pyd;

    hsf = 0.35*sin(pos.x*4.3 + 20.*fy) + 0.4*sin(pos.x*5.7 + 45.*fy) + 0.25*sin(pos.x*8.48 + 55.*fy);
    fr = fr0*(-tdv*0.5 + 1. - 0.5*tdv*hsf);
    
    float angle = twfs*pos.x;
    vec2 d1 = rotateVec(vec2(fr*fds, fr*fds), angle);
    vec2 d2 = d1.yx*vec2(1., -1);
    return min(min(min(map_hor_small(pos, d1, 1.), map_hor_small(pos, d2, 5.)), map_hor_small(pos, -d2, 9.)), map_hor_small(pos, -d1, 13.)); 
}

float map_f_ver(vec3 pos, vec2 delta, float n)
{
    return length(vec2(mod(pos.x + delta.x, fe) - fe*0.6, pos.z + delta.y - fr*sin((pos.y + fe*2. + fe*floor(pos.x/fe))/fe*pi))) - fr*fds*0.86;
}

float vsf;
float map_ver_small(vec3 pos, vec2 delta, float n)
{    
    float fx = 145.*random(19.36*floor(pos.x/fe));
    float ad = 1. + ttwd*vsf;            
    
    float angle = ad*twf*pos.y;
    vec2 d1 = rotateVec(vec2(fr*fd, fr*fd), angle);
    vec2 d2 = d1.yx*vec2(1., -1);
    return min(min(min(map_f_ver(pos, d1 + delta, n + 1.), map_f_ver(pos, d2 + delta, n + 2.)), map_f_ver(pos, -d2 + delta, n + 3.)), map_f_ver(pos, -d1 + delta, n + 4.)); 
}

float pxd;
float map_ver(vec3 pos)
{   
    float fx = 145.*random(1.936*floor(pos.x/fe));
    
    fx = 45.8*random(1.885*floor(pos.x/fe)); 
    pxd = fe*tdd*(1. + 0.45*0.5*sin(pos.y*1.3 + 27.*fx) + 0.3*0.5*sin(pos.y*3.7 + 74.*fx) - 0.25*0.5*sin(pos.y*9.48 + 112.*fx));
    pos.x+= pxd;
    
    vsf = 0.35*tdv*sin(pos.y*4.3 + 31.*fx) - 0.4*tdv*sin(pos.y*5.7 + 58.*fx) - 0.25*tdv*sin(pos.y*8.48 + 38.*fx);
    fr = fr0*(-tdv*0.5 + 1. - 0.5*tdv*vsf);
    
    float angle = twfs*pos.y;
    vec2 d1 = rotateVec(vec2(fr*fds, fr*fds), angle);
    vec2 d2 = d1.yx*vec2(1., -1);
    return min(min(min(map_ver_small(pos, d1, 1.), map_ver_small(pos, d2, 5.)), map_ver_small(pos, -d2, 9.)), map_ver_small(pos, -d1, 13.)); 
}

float map_s(vec3 pos)
{  
    vec3 pos0 = pos;
    float fy = 132.*random(1.254*floor(pos.y/fe));
    fr = fr0*(-tdv*0.5 + 1. - 0.5*hsf);

    pos.y+= pyd;
    float fh = length(vec2(mod(pos.y, fe) - fe*0.6, pos.z + fr*sin((pos.x + fe*2. + fe*floor(pos.y/fe))/fe*pi))) - fr*1.1;
 
    pos = pos0;
    
    float fx = 145.*random(1.936*floor(pos.x/fe));
    fr = fr0*(-tdv*0.5 + 1. - 0.5*vsf);
    
    pos.x+= pxd;
    
    float fv = length(vec2(mod(pos.x, fe) - fe*0.6, pos.z - fr*sin((pos.y + fe*2. + fe*floor(pos.x/fe))/fe*pi))) - fr*1.1;
    return min(fh, fv);
}

float map_s2(vec3 pos)
{
    return mix(map_s(pos), abs(pos.z) - fr*1.1, smoothstep(14., 23., iTime));
}

float map(vec3 pos)
{
    float disth = map_hor(pos);
    float distv = map_ver(pos);
    return mix(min(disth, distv), map_s2(pos), gtf);
}

// From https://www.shadertoy.com/view/Xds3zN;
float calcAO(vec3 pos, vec3 nor)
{
	float occ = 0.0;
    float sca = 1.;
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor*hr + pos;
        
    	float dd = map(aopos);
        
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}

vec2 trace(vec3 cam, vec3 ray, float maxdist) 
{
    float o;
    float t = -cam.z/ray.z -0.05;
    
  	for (int i = 0; i < 27; ++i)
    {
    	vec3 pos = ray*t + cam;
    	float dist = map(pos);
        if (dist<0.0006 || dist>maxdist)
        {
            o = (abs(dist-map_ver(pos))<abs(dist-map_hor(pos))?1.:0.);
            break;
        }
        t+= dist*(0.75 + float(i)*0.06);
  	}
  	return vec2(t, o);
}

// From https://www.shadertoy.com/view/MstGDM
vec3 getNormal(vec3 pos, float e, float o)
{
    vec2 q = vec2(0., e); //vec2(0.,distance(campos, pos)*0.0005);
    return normalize(vec3(map(pos + q.yxx) - map(pos - q.yxx),
                          map(pos + q.xyx) - map(pos - q.xyx),
                          map(pos + q.xxy) - map(pos - q.xxy)));
}

vec3 color_hor(vec3 norm, vec3 pos)
{
    vec3 col = mix(mix(mix(objcolor1, mix(objcolor1, objcolor2, smoothstep(-0.1, 0.1, sin(abs(pos.y)*3.74*50./clsize))), smoothstep(0.66, 0.665, abs(pos.y/clsize))), objcolor2, smoothstep(0.88, 0.89, abs(pos.y/clsize))), objcolor3, smoothstep(0.62, 0.621, abs(pos.y/clsize))*smoothstep(0.6508, 0.6503, abs(pos.y/clsize)));

    #ifdef COL_TEXTURE
    float txti = txti0;
    float fx = 14.64*random(2.857*floor(pos.x/fe));
    float fc = 1. - crv*0.5*(1. + 0.5*sin(pos.y*1.6 + 60.*fx) + 0.5*sin(pos.y*2.5 + 90.*fx) + crv*0.5*sin(pos.y*3.88 + 155.*fx));
    
    col*= 1.1*fc*vec3(1. - txti + txti*clamp(2.*texture(iChannel0,pos.xy*vec2(5., txtf)).r, 0., 1.));
    #endif
    return col;
}

vec3 color_ver(vec3 norm, vec3 pos)
{
    vec3 col = mix(mix(mix(objcolor1, mix(objcolor1, objcolor2, smoothstep(-0.02, 0.02, sin(abs(pos.x + 0.02)*3.74*50./clsize))), smoothstep(0.66, 0.665, abs(pos.x/clsize))), objcolor2, smoothstep(0.88, 0.89, abs(pos.x/clsize))), objcolor3, smoothstep(0.62, 0.621, abs(pos.x/clsize))*smoothstep(0.6508, 0.6503, abs(pos.x/clsize)));

    #ifdef COL_TEXTURE
    float txti = txti0;
    float fy = 21.23*random(2.316*floor(pos.y/fe));
    float fc = 1. - crv*0.5*(1. + 0.2*sin(pos.x*1.6 + 70.*fy) + 0.3*sin(pos.x*2.2 + 90.*fy) + 0.25*sin(pos.x*3.88 + 130.*fy));    

    col*= 1.1*fc*vec3(1. - txti + txti*clamp(2.*texture(iChannel0,pos.xy*vec2(txtf, 5.)).r, 0., 1.));
    #endif
    return col;
}

vec3 lampShading(Lamp lamp, vec3 norm, vec3 pos, vec3 ocol)
{
	vec3 pl = normalize(lamp.position - pos);
    float dlp = distance(lamp.position, pos);
    vec3 pli = pl/pow(1. + lamp.attenuation*dlp, 2.);
    vec3 nlcol = normalize(lamp.color);
      
    // Diffuse shading
    float b = abs(dot(norm, pli));
    if (b<0.5 && norm.z<0.65 && iTime>18.4) b=1.3;
    vec3 col = (1. - 0.35*smoothstep(14.7, 19., iTime))*lamp.intensity*ocol*(1. - difi + difi*nlcol*pow(b, tbrl));

    // Specular shading
    #ifdef SPECULAR
    //if (dot(norm, lamp.position - pos) > 0.0)
        col+= vec3(1., 0.7, 0.3)*nlcol*lamp.intensity*specint*pow(max(0.0, dot(reflect(pl, norm), normalize(pos - campos))), specshin);
    #endif
    
	// Sub surface scattering from https://www.shadertoy.com/view/MdXSzX
    #ifdef SS_SCATERING
	float transmission = map(pos + pl*ssstrmr)/ssstrmr;
	vec3 sssLight = ocol*nlcol*smoothstep(0.0,1.0,transmission);
    col = col*(1. - sssInt) + sssInt*sssLight;
    #endif
    
    return col;
}

vec3 lampsShading(vec3 norm, vec3 pos, vec3 ocol)
{
    vec3 col = vec3(0.);
    for (int l=0; l<2; l++) // lamps.length()
        col+= lampShading(lamps[l], norm, pos, ocol);
    
    return col;
}

// From https://www.shadertoy.com/view/lsSXzD, modified
vec3 GetCameraRayDir(vec2 vWindow, vec3 vCameraDir, float fov)
{
	vec3 vForward = normalize(vCameraDir);
	vec3 vRight = normalize(cross(vec3(0.0, 1.0, 0.0), vForward));
	vec3 vUp = normalize(cross(vForward, vRight));
    
	vec3 vDir = normalize(vWindow.x * vRight + vWindow.y * vUp + vForward * fov);

	return vDir;
}

vec4 render(vec2 fragCoord)
{
  lamps[0] = Lamp(vec3(-70., 10., 190.), vec3(1., 0.99, 0.92), 1.5, .0001);
  lamps[1] = Lamp(vec3(70., -40., 190.), vec3(1., 1., 1.), 1.5, .0001);
    
  vec2 uv = fragCoord.xy;
  uv/= iResolution.xy;
  uv = uv*2.0 - 1.0;
  uv.x*= iResolution.x/iResolution.y;
    
  vec3 ray =  GetCameraRayDir(uv, camdir, fov);         
    
  vec2 t = trace(campos, ray, maxdist);
  float tx = t.x;
  vec3 col;

  if (tx<maxdist)
  {
      vec3 pos = campos + tx*ray;
      
      if (abs(pos.x)>clsize || abs(pos.y)>clsize)
          return vec4(ambientColor, 1.0);
      
      vec3 norm = getNormal(pos, normdelta, t.y);

      vec3 colh = color_hor(norm, pos);
      vec3 colv = color_ver(norm, pos);
      if (t.y==0.) // Horizontal
          col = colh;
      else // Vertical
          col = colv;
      col = mix(col, (colh + colv)/2., smoothstep(14., 21., iTime));
      
      // Shading
      col = ambientColor*ambientint + lampsShading(norm, pos, col);
      
      // Ambient Occlusion
      #ifdef SH_OA
      col*= 1. - aoint + 1.25*aoint*vec3(calcAO(pos, norm));
      #endif
  }
  else
  {
      // Background
      col = ambientColor;
  }
      
  return vec4(col, 1.0);
}

void setCamera()
{
   vec2 iMouse2;
   if (iMouse.x==0. && iMouse.y==0.)
      iMouse2 = iResolution.xy*vec2(0.5, 0.4);
   else
      iMouse2 = iMouse.xy;
   float tf = pow(80.*smoothstep(0., 80., iTime), 1.9)/9.;
   //float tf = 0.;
   //gtf2=0.;
   vec3 camtarget = camtarget0*(1. - gtf2);
   campos = campos0*(1. - gtf2) + tf*vec3(-5.*cos(2.*iMouse2.x/iResolution.x + 0.4),
                 5.*cos(1.2*iMouse2.y/iResolution.y + 1.5),
                 5.*sin(2.*iMouse2.x/iResolution.x)*sin(1.2*iMouse2.y/iResolution.y + 1.5));
   camdir = camtarget-campos;   
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
	gtf = smoothstep(5., 17., iTime);
	gtf2 = smoothstep(15., 55., iTime);
    
    setCamera();
    
    // Antialiasing
    #ifdef ANTIALIASING
    vec4 vs = vec4(0.);
    for (int j=0;j<aasamples ;j++)
    {
       float oy = float(j)*aawidth/max(float(aasamples-1), 1.);
       for (int i=0;i<aasamples ;i++)
       {
          float ox = float(i)*aawidth/max(float(aasamples-1), 1.);
          vs+= render(fragCoord + vec2(ox, oy));
       }
    }
    fragColor = vs/vec4(aasamples*aasamples);
    #else
    fragColor = render(fragCoord);
    #endif
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iTime = mod(time, 60.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}