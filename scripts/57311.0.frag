/*
 * Original shader from: https://www.shadertoy.com/view/td33z7
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

// Protect glslsandbox uniform names
#define time        stemu_time

// --------[ Original ShaderToy begins here ]---------- //
/*
Shader coded live on twitch (https://www.twitch.tv/nusan_fx)
The shader was made using Bonzomatic.
You can find the original shader here: http://lezanu.fr/LiveCode/FluidTank.glsl
*/

float time = 0.;

float cyl(vec2 p, float s) {
  return length(p)-s;
}

float sph(vec3 p, float s) {
  return length(p)-s;
}

float box(vec3 p, vec3 s) {
  p=abs(p)-s;
  return max(p.x, max(p.y,p.z));
}

vec3 repeat(vec3 p, vec3 s) {
  return (fract(p/s-0.5)-0.5)*s;
}

vec2 repeat(vec2 p, vec2 s) {
  return (fract(p/s-0.5)-0.5)*s;
}

float repeat(float p, float s) {
  return (fract(p/s-0.5)-0.5)*s;
}

vec3 tunnel(vec3 p) {
  vec3 off=vec3(0);
  float dd = p.z*0.02;
  dd = floor(dd) + smoothstep(0.,1.,smoothstep(0.,1.,fract(dd)));
  dd *= 1.7;
  off.x += sin(dd)*10.;
  off.y += sin(dd*0.7)*10.;
  
  return off;
}

mat2 rot(float a) {
  float ca=cos(a);
  float sa=sin(a);
  return mat2(ca,sa,-sa,ca);  
}

float blue = 0.;
float tmpo = 0.;
float part1(vec3 p2) {
    
  // main tunnel
  float d = -cyl(p2.xy,10.);
  
  // details holes
  vec3 p3 = repeat(p2, vec3(2));
  float db = d;
  d = max(d, -sph(p3, 1.1));
  d = min(d, db+2.);
  
  // electric arcs
  vec3 p4 = p2;
  p4.xy *= rot(p4.z*0.05);
  p4.x = abs(p4.x) - 3.;
  p4.z = repeat(p4.z, 10.);
  p4.x += sin(p4.y*0.3 + p2.z*0.08)*2.;
  float go = min(sin(p2.z*0.2 + time*3.)*0.6,0.);
  float cy = cyl(p4.xz, 0.3+go);
  tmpo = abs(cy);
  d = min(d, cy);
  
  // polar coordinates
  vec3 p5 = p2;
  p5.x = atan(p2.y,p2.x) * 20. / 3.141592;
  p5.x -= p2.z*0.5;
  p5.y = length(p2.xy) - 10.;
  
  p5.xz = repeat(p5.xz, vec2(5,5));
  // box on the side of tunnel
  d = min(d, box(p5, vec3(1)));
  
  return d;
}

float smin(float a, float b, float h) {
  float k=clamp((a-b)/h*.5+.5,0.,1.);
  return mix(a,b,k) - k * (1.-k) * h;
}

float part2(vec3 p) {
  
  float d = -cyl(p.xy,25.);
  float d1 = d;
  
  p.xy *= rot(sin(p.z*0.05 - time) * sin(p.z*0.07 - time)*3.);

  
  for(int i=0; i<4; ++i) {
    
    vec3 p3 = p;
    
    p3.xy *= rot(0.7*(float(i)+1.)+time*0.007);
    p3.zy *= rot(0.9*(float(i)+1.)-time*0.009);
    
    p3 = repeat(p3, vec3(12 + i));
    
    float f = sph(p3, 1. + float(i)*1.);
    //f = smin(f, cyl(p3.xy, 0.5), 3);
    d = smin(d, f, 5.);
    
  }
  
  d = smin(d, d1-4., -3.);
  
  
  return d;
  
}

vec3 lpos = vec3(0,-4,0);

float light = 0.;

float water = 1.;
float map(vec3 p) {
  
  p += tunnel(p);
  
  float d1 = part1(p);
  float d2 = part2(p);
  
  vec3 p2 = p;
  p2.z = repeat(p2.z, 120.);
  float mi = box(p2, vec3(100,100,34));
  
  // mix part 1 and part 2
  d1 = max(d1, -mi);
  d1 = min(d1, max(d2, mi));
  
  // enter hatch
  float cc = abs(cyl(p.xy,11.))-2.;
  cc = max(cc, abs(mi)-1.);
  d1 = min(d1, cc);
  
  //d1 = d2; // tmp
  
  // light position
  p.z = repeat(p.z, 67.);
  vec3 relp = lpos-p;
  float dl = length(relp)-0.5;
  light += 1.0/(0.2+dl*dl);
  d1 = min(d1, dl);
  d1 = min(d1, max(-relp.y,length(relp.xz)-0.3));
  
  
  tmpo = max(tmpo, -mi);
  blue += 0.7/(0.2+abs(tmpo));
  
  water = (d1 == d2) ? 0. : 1.;
  
  d1 *= 0.7;
  
  return d1;
  
}

float rnd(float t) {
  return fract(sin(t*754.652)*652.642);
}

float curve(float t, float d) {
  float g=t/d;
  return mix(rnd(floor(g)), rnd(floor(g)+1.), pow(smoothstep(0.,1.,fract(g)), 10.));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  time =  mod(iTime, 200.);
    
  vec2 uv = vec2(fragCoord.x / iResolution.x, fragCoord.y / iResolution.y);
  uv -= 0.5;
  uv /= vec2(iResolution.y / iResolution.x, 1);

  vec3 s=vec3(0,0,8);
  vec3 t=vec3((curve(time, 1.8)-0.5)*5.,0,0);
  
  float advance = time * 12. + curve(time, 2.)*4.;
  s.z -= advance;
  t.z -= advance;
  s -= tunnel(s);
  t -= tunnel(t);
  
  //lpos = vec3(0,0,-30);
  //lpos.z -= advance;
  
  //vec3 r=normalize(vec3(-uv, 1));
  vec3 cz = normalize(t-s);
  vec3 cx = normalize(cross(cz, vec3(sin(time*0.3)*0.3,1,0)));
  vec3 cy = normalize(cross(cz, cx));
  
  float fov = 0.7 + curve(time, 2.8) * 0.7;
  vec3 r = normalize(cx * uv.x + cy * uv.y + cz * fov);
  
  vec2 off=vec2(0.01,0);
  //vec2 off=vec2(0,0.01); // This was a mistake made during the stream
  
  vec3 p=s;
  float alpha = 1.;
  float dd=0.;
  for(int i=0; i<100; ++i) {
    float d=map(p);
    if(d<0.001) {
      if(water<0.5) {
        vec3 n=normalize(d-vec3(map(p-off.xyy), map(p-off.yxy), map(p-off.yyx)));
        alpha *= pow(1.-abs(dot(n,r)),2.0);
        r = reflect(r,n);
        d = 0.2;
        if(alpha<0.01) break;
      } else {
        break;
      }
    }
    p+=r*d;
    dd+=d;
  }
  
  vec3 n=normalize(map(p)-vec3(map(p-off.xyy), map(p-off.yxy), map(p-off.yyx)));
  
  vec3 lpos2 = lpos;
  lpos2 -= tunnel(lpos2)*0.5;
  vec3 pl = p;
  pl.z = repeat(pl.z, 67.);
  vec3 l = normalize(lpos2-p);
  
  float ao = clamp(map(p+n),0.,1.);
  
  vec3 col=vec3(0);
  //col += pow(1-i/101.0, 6) * 3;
  float falloff = 10./(1.+length(lpos-pl));
  vec3 lightcol = vec3(1,0.7,0.3);
  col += (dot(n,-l)*0.5+0.5) * falloff * lightcol * alpha * ao;
  col += light*lightcol;
  col += pow(dd * 0.007,4.) * vec3(0.5,0.7,1);
  col += blue * 0.05 * vec3(0.4,0.5,1);
  
    
  col *= 1.2-length(uv);
  col = 1.-exp(-col * 2.);
  col = pow(col, vec3(1.4));
  
  
  fragColor = vec4(col, 1);
}
// --------[ Original ShaderToy ends here ]---------- //

#undef time

void main(void)
{
    iTime = time;
    mainImage(gl_FragColor, gl_FragCoord.xy);
}