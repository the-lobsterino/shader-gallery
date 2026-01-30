/*
 * Original shader from: https://www.shadertoy.com/view/3lBBD3
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
precision mediump float;

#define MAX_STEP 100
#define MAX_DIST 100.0
#define SURFACE_DIST 0.01

#define S(a, b, t) smoothstep(a, b, t)

float smoothMin(float a, float b, float k) {
  float h = clamp(0.5+0.5*(b-a)/k, 0. , 1.);
  return mix(b,a,h)-k*k*(1.0-h);
}

float smoothMax(float a, float b, float k) {
  float h = clamp(0.5+0.5*(b-a)/k, 0. , 1.);
  return max(b,a)-k*k*(1.0-h);
}

mat2 Rotate(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

float sdCapsuel(vec3 p, vec3 a, vec3 b, float r) {
  vec3 ab = b-a;
  vec3 ap = p-a;

  float t = dot(ap, ab)/dot(ab, ab);
  t = clamp(t, 0.0, 1.0);

  vec3 c = a + t*ab;
  float d = length(p-c)-r;

  return d;
}

float sdTorus(vec3 p, vec2 r) {
  float x = length(p.xz)-r.x;
  float y = p.y;
  return length(vec2(x,y))-r.y;
}

float dBox(vec3 p, vec3 size) {
  float d = length(max(abs(p)-size, 0.0));
  return d;
}

float sdGyroid(vec3 p, float scale, float thickness, float bias) {
  p *= scale;
  float gyroid = abs(dot(sin(p), cos(p.zxy))-bias)/scale-thickness;
  return gyroid;
}
vec3 Transform(vec3 p) {
  p.xy *= Rotate(p.z*.1);
  p.z -= iTime * .1;
  p.y -= .3;
  return p;
}

float GetDist(vec3 p) {
  p = Transform(p);
  float dP = p.y; // plane distance
  float bd = dBox(p, vec3(1));

  float gyroid = sdGyroid(p, 5.23, 0.03, 1.4);
  float gyroid2 = sdGyroid(p, 10.76, 0.03, .3);
  float torus = sdTorus(p, vec2(p.x, p.z));
  

  
  gyroid -= gyroid2 * 1.5;
  
  float d = gyroid * .95;
  
  return abs(d);

}

float RayMarch(vec3 ro, vec3 rd) {
  float dO = 0.0; // start origin
  for(int i=0; i<MAX_STEP; i++) {
    vec3 p = ro+dO*rd; // current march position
    float dS = GetDist(p);
    dO += dS;
    if(dS<SURFACE_DIST || dO>MAX_DIST) break;
  }
  return dO;
}

vec3 GetNormal(vec3 p) {
  float d = GetDist(p);
  vec2 e = vec2(0.02, 0);
  vec3 n = d -vec3(
    GetDist(p-e.xyy),
    GetDist(p-e.yxy),
    GetDist(p-e.yyx)
  );
  return normalize(n);
}

float GetLight(vec3 p) {
  vec3 lightPos = vec3(3, 5, 4);
  // lightPos.xz += vec2(sin(iTime), cos(iTime));
  vec3 l = normalize(lightPos -p);
  vec3 n = GetNormal(p);

  float diff = clamp(dot(n, l)*.5+.5, 0., 1.);
  float d = RayMarch(p+n*SURFACE_DIST*2., l);
  return diff;

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

vec3 Background(vec3 rd) {
  vec3 col = vec3(0.);
  float y = rd.y*.5+.5;
  float t  = iTime;
  col += (1.-y) * vec3(1., 1., 1.)*2.;
  float a = atan(rd.x, rd.z);
  float flames = sin(a*10.+t)*sin(a*7.-t)*sin(a*6.-t);
  flames *= S(.8, .5, y);
  col += flames;
  col = max(col, 0.);
  col += S(.5, .0, y);
  return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    // normalize
    vec2 uv = (fragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
    vec3 col = vec3(0.0);
    float t  = iTime;
    
    vec3 ro = vec3(0, 0, -.03);
    ro.yz *= Rotate(-iMouse.y*3.14+1.);
    ro.xz *= Rotate(-iMouse.x*6.2831);
    
    vec3 lookat = vec3(0,0,0);

    vec3 rd = R(uv, ro, lookat, .8); // last zoom

    float d = RayMarch(ro, rd);

    if(d<MAX_DIST) {
      vec3 p = ro + rd * d;
      vec3 n = GetNormal(p);

      float height = p.y;

      p = Transform(p);

      float diff = n.y*.5+.5;
      col += diff * diff;

      float g2 = sdGyroid(p, 10.76, 0.03, .3);
      col *=S(-0.1, .1, g2); // blackening

      float crackWidth = -0.02+S(0., -.5, n.y) * 0.04;
      float cracks = S(crackWidth, -.03, g2); // first crack's width

      float g3 = sdGyroid(p+t * .1, 5.76, 0.03, .0);
      float g4 = sdGyroid(p-t * .05, 4.76, 0.03, .0);
      cracks *= g3 * g4 *20.+.2 * S(.2, .0, n.y);

      col += cracks * vec3(.1, .4, 1.) * 3. * sin(iTime);

      float g5 = sdGyroid(p-vec3(0., t, 0.), 3.76, 0.03, .0);

      col += g5*vec3(.1, .4, 1.);

      col += S(0., -2., height)*vec3(.1, .4*sin(iTime), 1.*cos(iTime));


    }

    col = mix(col, Background(rd), S(0., 7. , d));
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}