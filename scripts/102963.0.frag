/*
 * Original shader from: https://www.shadertoy.com/view/mdVXzd
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
#define EPS 0.0013
#define MAX 9999.0
#define PI 3.14159265359
#define BPM 50.0
#define AO_NUM 4.0
#define MARCHING_NUM 64
#define CAMERA_DEPTH 1.0
#define TUNNEL_END vec3(0.0, 0.0, 50.0)
#define ROOM_POS vec3(0.0, 0.0, 60.0)
#define FLOOR_CENTER vec3(150.0, 0.0, 0.0)
#define COLUMN_CENTER vec3(-150.0, 0.0, 0.0)

#define TUNNEL_AREA_MIN vec3(-10.0, -50.0, -10.0)
#define TUNNEL_AREA_MAX vec3(10.0, 50.0, 50.0)
#define ROOM_AREA_MIN vec3(-10.0, -50.0, 50.0)
#define ROOM_AREA_MAX vec3(10.0, 50.0, 70.0)
#define FLOOR_AREA_MIN vec3(100.0, -100.0, -100.0)
#define FLOOR_AREA_MAX vec3(200.0, 100.0, 100.0)
#define COLUMN_AREA_MIN vec3(-200.0, -100.0, -100.0)
#define COLUMN_AREA_MAX vec3(-100.0, 100.0, 100.0)

#define PHASE0_TIME 0.0
#define PHASE1_TIME 60.0 / BPM * 4.0 + 60.0 / BPM * 0.5
#define PHASE2_TIME 60.0 / BPM * 4.0 * 2.0 + 60.0 / BPM * 0.5
#define PHASE3_TIME 60.0 / BPM * 4.0 * 3.0 + 60.0 / BPM * 0.5
#define PHASE4_TIME 60.0 / BPM * 4.0 * 6.0 + 60.0 / BPM * 0.5
#define PHASE5_TIME 60.0 / BPM * 4.0 * 8.0 + 60.0 / BPM * 0.5
#define PHASE6_TIME 60.0 / BPM * 4.0 * 10.0 + 60.0 / BPM * 0.5
#define PHASE7_TIME 60.0 / BPM * 4.0 * 15.0 + 60.0 / BPM * 0.5
#define PHASE8_TIME 120.0

#define PHASE0_POS vec3(0.0)
#define PHASE1_POS vec3(0.0, 0.0, 60.0)
#define PHASE2_POS vec3(150.0, 0.0, 0.0)
#define PHASE3_POS vec3(-158.0, 0.0, -0.5)
#define PHASE4_POS vec3(0.0)
#define PHASE5_POS vec3(150.0, 0.0, 0.0)
#define PHASE6_POS vec3(-160.0, 0.0, 0.0)
#define PHASE7_POS vec3(0.0, 0.0, 45.0)
#define PHASE8_POS vec3(0.0, 0.0, 60.0)

struct surface { float dist; int id; };

float Hash(float s) { return fract(sin(12.9898 * s) * 43.54); }
float Noise(float s) { return (mix(Hash(floor(s)),Hash(ceil(s)),smoothstep(0.0, 1.0, fract(s))) * 2.0 - 1.0); }
mat2 Rotate(float t) { return mat2(cos(t), -sin(t), sin(t), cos(t)); }

float randomSeed = 0.;
float Random() { return randomSeed = Hash(randomSeed); }

float phase1Frag = 0.;
float phase2Frag = 0.;
float phase3Frag = 0.;
float phase4Frag = 0.;
float phase5Frag = 0.;
float phase6Frag = 0.;
float phase7Frag = 0.;
float phase8Frag = 0.;

float Phase1Frag(){ return step(PHASE0_TIME, iTime)  * step(iTime, PHASE1_TIME); }
float Phase2Frag(){ return step(PHASE1_TIME, iTime)  * step(iTime, PHASE2_TIME); }
float Phase3Frag(){ return step(PHASE2_TIME, iTime)  * step(iTime, PHASE3_TIME); }
float Phase4Frag(){ return step(PHASE3_TIME, iTime)  * step(iTime, PHASE4_TIME); }
float Phase5Frag(){ return step(PHASE4_TIME, iTime)  * step(iTime, PHASE5_TIME); }
float Phase6Frag(){ return step(PHASE5_TIME, iTime)  * step(iTime, PHASE6_TIME); }
float Phase7Frag(){ return step(PHASE6_TIME, iTime)  * step(iTime, PHASE7_TIME); }
float Phase8Frag(){ return step(PHASE7_TIME, iTime)  * step(iTime, PHASE8_TIME); }

float phaseTime = 0.;
float PhaseTime()
{
  return phase1Frag * (iTime - PHASE0_TIME) +
         phase2Frag * (iTime - PHASE1_TIME) + 
         phase3Frag * (iTime - PHASE2_TIME) + 
         phase4Frag * (iTime - PHASE3_TIME) + 
         phase5Frag * (iTime - PHASE4_TIME) + 
         phase6Frag * (iTime - PHASE5_TIME) + 
         phase7Frag * (iTime - PHASE6_TIME) + 
         phase8Frag * (iTime - PHASE7_TIME);
}

float phaseRate = 0.;
float PhaseRate()
{
  return phaseTime / (phase1Frag * (PHASE1_TIME - PHASE0_TIME) + 
                      phase2Frag * (PHASE2_TIME - PHASE1_TIME) + 
                      phase3Frag * (PHASE3_TIME - PHASE2_TIME) + 
                      phase4Frag * (PHASE4_TIME - PHASE3_TIME) + 
                      phase5Frag * (PHASE5_TIME - PHASE4_TIME) + 
                      phase6Frag * (PHASE6_TIME - PHASE5_TIME) +
                      phase7Frag * (PHASE7_TIME - PHASE6_TIME) +
                      phase8Frag * (PHASE8_TIME - PHASE7_TIME));
}

int scene = 0;
int Scene()
{
  return int(
         phase1Frag * 2.0 +
         phase2Frag * 3.0 +
         phase3Frag * 4.0 +
         phase4Frag * 1.0 +
         phase5Frag * 3.0 +
         phase6Frag * 4.0 +
         phase7Frag * 2.0 +
         phase8Frag * 2.0 + 0.1);
}

float beatTime = 0.;
float BeatTime()
{
    float scaledTime = iTime * BPM / 60.0;
    return floor(scaledTime) + pow(smoothstep(0.0, 1.0, fract(scaledTime)), 20.0);
}

vec3 cameraPos = vec3(0.);
vec3 CameraPos()
{
  vec3 shake = vec3(Random(),Random(),Random()) * 0.03;
  
  return phase1Frag * (PHASE1_POS + shake * 0.2 + vec3(0.6, 0.3, 0.5) * vec3(Noise(phaseTime * 0.7), Noise(phaseTime * 0.3), Noise(phaseTime * 0.4))) +
         phase2Frag * (PHASE2_POS + shake) +
         phase3Frag * (PHASE3_POS + shake * (4.0, 2.0, 1.0)) + 
         phase4Frag * (PHASE4_POS + shake * 0.4 + vec3(0.1 * Noise(phaseTime * 2.7), 0.1 * Noise(phaseTime * 2.3), 0.1 * Noise(phaseTime * 2.4) + (phaseTime - 5.8) * 0.5) * smoothstep(5.8, 7.0, phaseTime)) + 
         phase5Frag * (PHASE5_POS + shake + 3.0 * vec3(0.0,0.0,phaseTime) + shake + vec3(5.6, 7.3, 8.5) * vec3(Noise(phaseTime * 0.7), Noise(phaseTime * 0.3), Noise(phaseTime * 0.4))) + 
         phase6Frag * (PHASE6_POS + shake + vec3(0.0,0.0,phaseTime) + shake + vec3(0.6, 0.3, 0.5) * vec3(Noise(phaseTime * 0.7), Noise(phaseTime * 0.3), Noise(phaseTime * 0.4))) + 
         phase7Frag * (
          ((PHASE7_POS + shake * 0.4 +
          smoothstep(5.0, 10.0, phaseTime) * vec3(9.0, 9.0, 2.0) * 
          vec3(Noise(phaseTime * 0.3 + 9.0), Noise(phaseTime * 0.2 + 15.0), Noise(phaseTime * 0.4 + 12.0))
          + vec3(0.0, 0.0, mix(phaseTime, 5.0 + phaseTime * 0.2, smoothstep(5.0, 6.0, phaseTime))))
          * (1.0 - smoothstep(0.8, 1.0, phaseRate))
           + smoothstep(0.8, 1.0, phaseRate) * ROOM_POS)
          ) +
         phase8Frag * PHASE8_POS;
}

vec3 cameraDir = vec3(0.);
vec3 CameraDir()
{
  return phase1Frag * normalize(ROOM_POS + vec3(0.0, 0.0, 1.0) - cameraPos) +
         phase2Frag * normalize(vec3(-0.3,-0.5,1.)) +
         phase3Frag * normalize(vec3(0.4,0.0,1.)) +
         phase4Frag * normalize(vec3(0.,0.,1.)) +
         phase5Frag * normalize(vec3(0.,0.,1.)) +
         phase6Frag * normalize(vec3(0.,0.,1.)) +
         phase7Frag * (normalize(ROOM_POS - cameraPos + EPS) * (1.0 - smoothstep(0.8, 1.0, phaseRate)) + smoothstep(0.8, 1.0, phaseRate) * normalize(vec3(0.,0.,1.))) +
         phase8Frag * normalize(vec3(0.,0.,1.));
}

vec3 cameraUp = vec3(0.);
vec3 CameraUp()
{
  return mix(vec3(0.0, 1.0, 0.0), vec3(-0.5, 1.0, -0.1), phase5Frag);
}

vec3 cameraSide = vec3(0.);
vec3 CameraSide()
{
  return -cross(cameraDir,cameraUp);
}

vec3 HSV2RGB(float h, float s, float v)
{
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

float Box( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

vec2 FoldRotate(vec2 p, float s) 
{
    float t = PI * 2.0 / s;
    float a = -atan(p.x, p.y) + PI / 2.0 + t / 2.0;
    a = mod(a, t) - t / 2.0;
    a = abs(a);
    return length(p) * vec2(cos(a), sin(a));
}

surface Sponge(vec3 p0, float foldXY, float foldYZ, float offset) 
{
    vec4 p = vec4(p0, 1.0);
    int id = int(Hash(floor((p0.y * 0.5 + 0.5) * 3.0)) * 3.0);
    
    for (int n = 0; n < 3; n++) 
    {
        p.xy = FoldRotate(p.xy, foldXY);
        p.yz = FoldRotate(p.yz, foldYZ);
        p = abs(p);
        p *= 3.0; 
        p.xyz -= 2.0;
        p.z += 1.0;
        p.z = abs(p.z);
        p.z -= 1.0;
    }
  
    return surface(Box(p.xyz, vec3(1.0)) / p.w + offset, id);
}

surface Map(vec3 p)
{
  float t = step(TUNNEL_AREA_MIN.x, p.x) * step(TUNNEL_AREA_MIN.y, p.y) * step(TUNNEL_AREA_MIN.z, p.z) * step(p.x, TUNNEL_AREA_MAX.x) * step(p.y, TUNNEL_AREA_MAX.y) * step(p.z, TUNNEL_AREA_MAX.z);
  float r = step(ROOM_AREA_MIN.x, p.x) * step(ROOM_AREA_MIN.y, p.y) * step(ROOM_AREA_MIN.z, p.z) * step(p.x, ROOM_AREA_MAX.x) * step(p.y, ROOM_AREA_MAX.y) * step(p.z, ROOM_AREA_MAX.z);
  float f = step(FLOOR_AREA_MIN.x, p.x) * step(FLOOR_AREA_MIN.y, p.y) * step(FLOOR_AREA_MIN.z, p.z) * step(p.x, FLOOR_AREA_MAX.x) * step(p.y, FLOOR_AREA_MAX.y) * step(p.z, FLOOR_AREA_MAX.z);
  float c = step(COLUMN_AREA_MIN.x, p.x) * step(COLUMN_AREA_MIN.y, p.y) * step(COLUMN_AREA_MIN.z, p.z) * step(p.x, COLUMN_AREA_MAX.x) * step(p.y, COLUMN_AREA_MAX.y) * step(p.z, COLUMN_AREA_MAX.z);

  float x = mix(4.0, 4.0 + sin(beatTime), t + r);
  float y = mix(4.0, 8.0 + 3.0 * cos(beatTime), t + r);
  float z = mix(0.0, abs(Noise(phaseTime * 0.5)) * 0.03, t + r);
  z = mix(z, abs(Noise(phaseTime * 0.5)) * 0.03, c);
  
  
  z = mix(z, smoothstep(0.4, 0.0, phaseTime * 0.2 + 0.2) , phase1Frag); 
  z = mix(z, smoothstep(0.4, 0.0, phaseTime * 0.2) , phase2Frag); 
  z = mix(z, 
      smoothstep(0.4, 0.0, (phaseTime * 0.2 + 0.05) * step(0.0, p.z) * step(p.z, 3.0)) *
      smoothstep(0.4, 0.0, (phaseTime * 0.2 - 0.2) * step(3.0, p.z) * step(p.z, 6.0)) *
      smoothstep(0.4, 0.0, (phaseTime * 0.2 - 0.45) * step(6.0, p.z) * step(p.z, 9.0)) *
      smoothstep(0.4, 0.0, (phaseTime * 0.2 - 0.7) * step(9.0, p.z) * step(p.z, 12.0)), 
      step(PHASE2_TIME, iTime) * step(iTime, PHASE3_TIME)
  ); 
  z = mix(z, smoothstep(0.4, 0.0, phaseTime * 0.2 + 0.05) , phase4Frag); 

  //Tunnel
  p.z = mix(p.z, mod(p.z, 2.0) - 1.0, t);
  p.xy = mix(p.xy, FoldRotate(p.xy, 10.0 + 4.0 * Noise(2.0 + beatTime)), t);
  p.x -= mix(0.0, (2.0 + 0.5 * Noise(beatTime)), t);
  
  //Room
  p -= mix(vec3(0.0), ROOM_POS, r);
  p.xy = mix(p.xy, FoldRotate(p.xy, 12.0), r);
  p.xz = mix(p.xz, FoldRotate(p.xz, 12.0), r);
  p.x -= mix(0.0, 3.5, r);
  
  //Floor
  p.y = mix(mix(p.y, abs(p.y), f), p.y, phase5Frag) ;
  p.y -= mix(0.0, 10.0, f);
  vec2 s = mix(floor((p.xz - mod(p.xz, 2.0))), floor((p.xz - mod(p.xz, 3.5))),phase5Frag);
  p.xz = mix(mix(p.xz, mod(p.xz, 2.0) - 1.0, f), mod(p.xz, 3.5) - 1.75, phase5Frag);
  p.y += mix(mix(0.0, 3.0 * Noise((Hash(s.y) + Hash(s.x)) * 20.0 + beatTime) * 2.0 + (Hash(s.y) + Hash(s.x)), f), 0.0, phase5Frag);
  p.y += mix(0.0, -(Hash(s.y) * Hash(s.x)) * 100.0 + 10.0 + 30. * (Hash(s.y) * Hash(s.y + 0.5) * Hash(s.x) * Hash(s.x + 0.5)) * phaseTime, phase5Frag);
  p.xz = mix(p.xz, Rotate((Hash(s.y) * Hash(s.x)) * 3.0 * beatTime) * p.xz, phase5Frag);
  p.xy = mix(p.xy, Rotate((Hash(s.y) + Hash(s.x)) * 3.0 * beatTime) * p.xy, phase5Frag);
  
  z = mix(z, smoothstep(0.4, 0.0, (phaseTime + 30.0 + (Hash(s.y) * Hash(s.x)) * 40.0 - 40.0) * 0.2) , phase5Frag); 
  
  //Column
  p -= mix(vec3(0.0), COLUMN_CENTER, c);
  float s1 = floor(p.z - mod(p.z, 3.0));
  p.x += mix(0., Hash(s1) * 60.0 - 30.0, phase6Frag);
  p.xy = mix(p.xy, Rotate(PI * Hash(2.4 + s1)) * p.xy, c);
  p.y = mix(p.y, mod(p.y, 2.0) - 1.0, c);
  p.z = mix(p.z, mod(p.z, 3.0) - 1.5, c);
  p *= mix(1.0, 0.5 * (sin(beatTime * PI * 2.0) * 0.5 + 0.5) + 0.5, phase6Frag);
  
  return Sponge(p, x, y, z);
}

vec3 Normal(vec3 p) 
{
    vec2 e = vec2(1.0, -1.0) * 0.5773 * EPS;

    return normalize(
            Map(p + e.xyy).dist * e.xyy +
            Map(p + e.yyx).dist * e.yyx +
            Map(p + e.yxy).dist * e.yxy +
            Map(p + e.xxx).dist * e.xxx
           );
}

float AO(vec3 p, vec3 n)
{
  float l = EPS;
  float h = 0.0;
  vec3 p2 = p;
  float s = 1.0;

  for(float i = 0.0; i < AO_NUM; i++)
  {
    p2 = p + l * n;
    l += EPS * 40.0;
    h += abs(l - Map(p2).dist) * s;
  }
  h = 1.0 - clamp(h, 0.0, 1.0);
  return pow(h, 2.5) * 2.0;
}

void RayMarch(vec2 c, inout vec3 color)
{
  float d = 0.0;
  vec3 r = normalize(cameraSide * c.x + cameraUp * c.y + cameraDir * CAMERA_DEPTH);
  vec3 p0 = cameraPos;
  vec3 p = p0;
  float l = 0.0;
  float ml = 50.0;
  for(int i = 0; i < MARCHING_NUM; i++)
  {
    surface s = Map(p);
    d = s.dist;

    color += 0.001 / s.dist * HSV2RGB(beatTime, 0.6, 1.0);
    
    if(l > ml)break;
    
    if(abs(d) < EPS)
    {
      vec3 n = Normal(p + vec3(EPS, 0.0, 0.0));
      vec3 nx = Normal(p + vec3(EPS, 0.0, 0.0));
      vec3 ny = Normal(p + vec3(0.0, EPS, 0.0));
      vec3 nz = Normal(p + vec3(0.0, 0.0, EPS));
      
      vec3 ec = HSV2RGB(beatTime, 1.0, 1.0) * abs(sin(phaseTime * 3.0 + p.z));
      vec3 sc = s.id == 0 ||s.id == 1 ? 
      vec3(0.7, 0.3,0.2) :
      vec3(0.95, 0.9, 0.75);
      sc *= AO(p,n);
   
      color = length(nx - ny) > EPS || length(ny - nz) > EPS || length(nz - nx) > EPS
      ? ec
      : sc;
     
     //color = sc;

      color *= iTime > PHASE3_TIME
      ? 1.0 - HSV2RGB(n.x * n.y * n.z * 10.0, 0.7, 0.7) * smoothstep(0.9, 1.0, abs(sin(iTime * 1.5 + p.z)))
      : vec3(1.0);
      
      color += HSV2RGB(Hash(p.y + phaseTime), 1.0, Hash(Hash(p.x + phaseTime) + p.z / 100.0) - 0.5);
      
      break;
    }
    
    l += mix(mix(mix(mix(d, 
    min(min((2.0 * step(0.0, r.x) - mod(p.x, 2.0)) / r.x, (2.0 * step(0.0, r.z) - mod(p.z, 2.0)) / r.z) + EPS, d),
    phase2Frag),
    min((3.0 * step(0.0, r.z) - mod(p.z, 3.0)) / r.z + EPS, d),
    step(PHASE2_TIME, iTime) * step(iTime, PHASE3_TIME)),
    min(min((3.5 * step(0.0, r.x) - mod(p.x, 3.5)) / r.x, (3.5 * step(0.0, r.z) - mod(p.z, 3.5)) / r.z) + EPS, d),
    phase5Frag), 
    min((3.0 * step(0.0, r.z) - mod(p.z, 3.0)) / r.z + EPS, d),
    phase6Frag);
    
    p = p0 + r * l;
  }
  return;
}

void Glitch(vec2 uv, float threshold, inout vec3 color)
{
  for(float i = 0.0; i < 2.0; i++)
  {
    uv = (uv * 3.0 + 20.0);
    float r = Noise(uv.x * Hash(uv.y) + Random()) * 0.5 + 0.5;
    color *= r > threshold ? vec3(1.0) : HSV2RGB(Hash(r), 1.0, 1.0) * 2.0; 
  }
}

void PostEffect(vec2 uv, inout vec3 color)
{
    Glitch(uv * vec2(0.2, 0.0002), 0.5 * step(iTime, PHASE1_TIME) * step(PHASE1_TIME - 0.6, iTime), color);
    Glitch(uv * vec2(0.2, 0.0002), 0.5 * step(iTime, PHASE2_TIME) * step(PHASE2_TIME - 0.5, iTime), color);
    Glitch(uv * vec2(0.2, 0.0002), 0.5 * step(iTime, PHASE3_TIME) * step(PHASE3_TIME - 0.5, iTime), color);
    Glitch(uv * vec2(0.2, 0.0002), 0.5 * step(iTime, PHASE4_TIME) * step(PHASE4_TIME - 0.5, iTime), color);
    Glitch(uv * vec2(0.2, 0.0002), 0.5 * step(iTime, PHASE5_TIME) * step(PHASE5_TIME - 0.5, iTime), color);
    Glitch(uv * vec2(0.2, 0.0002), 0.5 * step(iTime, PHASE6_TIME) * step(PHASE6_TIME - 0.5, iTime), color);
      
    color *= 1.0 - smoothstep(0.4, 0.8, length(uv- vec2(0.5)));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  randomSeed = Hash(iTime);
  phase1Frag = Phase1Frag();
  phase2Frag = Phase2Frag();
  phase3Frag = Phase3Frag();
  phase4Frag = Phase4Frag();
  phase5Frag = Phase5Frag();
  phase6Frag = Phase6Frag();
  phase7Frag = Phase7Frag();
  phase8Frag = Phase8Frag();
  phaseTime = PhaseTime();
  phaseRate = PhaseRate();
  scene = Scene();
  beatTime = BeatTime();
  cameraPos = CameraPos();
  cameraDir = CameraDir();
  cameraUp = CameraUp();
  cameraSide = CameraSide();
  
  vec2 r=iResolution.xy;
  vec2 c=(gl_FragCoord.xy * 2.0-r)/min(r.x,r.y);
  vec3 color = HSV2RGB(Hash(c.y + phaseTime), Hash(c.y + phaseTime), Hash(Hash(c.x + phaseTime) + c.x / 100.0) - 0.5) + vec3(0.0, 0.15, 0.25);
  RayMarch(c, color);
  vec2 uv = gl_FragCoord.xy/r;
  PostEffect(uv, color);
  fragColor=vec4(color, 1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}