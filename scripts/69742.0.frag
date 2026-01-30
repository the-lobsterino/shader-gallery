#ifdef GL_ES
  precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

// roentgen.glsl
// Leon 05 / 07 / 2017
// using lines of code of IQ, Mercury, LJ, Koltes, Duke
// tweaked by psyreco

//TOP SECRET======================================EYES ONLY===========================================TOP SECRET
// T---------------- SCAN OF SUSPECTED ALIEN INCUBATION IN HUMAN CHEST CAVITY ------------------ Anonymous addendum
// O Move mouse to scan Chest cavity.
// P This is a Baby scan of chest cavity of Patient X, found coccooned at outpost 7 of epsilon Signus, Andromeda galaxy
//   Outpost 7 was a secret Nazi Galactic outpost known to have suffered an outbreak of Aliens in the 1930's after a Nazi experiment went wrong.
// S This scan is an incubated Alien embryo, coiled up in the later stages of developmenT, it has consumed all the vital internal organs, yet the patient is still alive and in good spirits.
// E As you will observe, this embryo has been twitching and seems close to bursting through the chest cavity, thRough the ribcage visible to the right of the scan.
// C This information is to be safeguarded for the medical record of humanity. 
// R Patient X, Human, Male, unknown age but estimated 300+ years old, was one of two coccooned males secretly taken back to his home planet Earth, Solar Syatem, 
// E Milky Way Galaxy by the Nazis in the late 1930's, the second coccooned individual was identified as Adolf Hitler, who also had an embryo inside him causing his hand to twitch 
// T making people wrongly believe the twitch was due to Parkinson's. Adolf Hitler died in 1945 when 
//   the alien embryo burst out of his ribcage in the fuhrerbunker in the final days of the Reich.
// T Patient X, however, is mysteriously said to be still alive, thr;ving and in good spirits, it is thought that the alien he is hosting inside him is giving him an unnatural long life.
// O Patient X is understood to be still carrying the twitching Alien embryo inside him, which for unknown reasons never burst out of his body.
// P Since the fall of the Reich in 1945, Patient X is known to have gone on to become a person of significant negative influence on humanity, 
//   regularly funding wars with his vast stolen wealth, and participating in the international interference of political systems to destabilize nations on Planet Earth
// S Patient X is also known to have weaved himself into the lives of the elite of Planet Earth, including past US presidents
// E Patient X is believed to be at the forefront of a massive and sinister globalist leftist progressive effort to undermine a US presidency by influencing
// C the media, educational institutions and political systems, successfully deposing said president by means of mass media propaganda against said president, to
// R manipulate the US population to vote out said president (Trump). 
// E The extent to which Patient X is being controlled by his host alien is not known, but it is believed that much of his
// T evildoing is the work of the alien reptile he is hosting inside his body. It is thought that the alien host may be using the body to sabotage humanity.
//
// Addendum Dec. 2020,  Patient X's original name has now finally been traced Ge 0r Ge 50 R 05
//=====================THIS DOCUMENT IS CLASSIFIED============================================================== 

#define PI 3.1415926535
#define TAU PI*2.

#define DITHER
#define STEPS 66.
#define BIAS 0.005
#define DIST_MIN 0.01

const vec4 baseColor = vec4 (0.3, 0.4, 1.0, 1.0);	

mat2 rot (float a)             { float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
float sphere (vec3 p, float r) { return length(p)-r; }
float cyl (vec2 p, float r)    { return length(p)-r; }
float torus( vec3 p, vec2 s )  { return length(vec2(length(p.xz)-s.x,p.y))-s.y; }

float smin (float a, float b, float r) 
{
    float h = clamp(.5+.5*(b-a)/r,0.,1.);
    return mix(b,a,h)-r*h*(1.-h);
}

float rand(vec2 co)     { return fract(sin(dot(co*0.123,vec2(12.9898,78.233))) * 43758.5453); }

vec3 camera (vec3 p) 
{
    p.xy+=mouse/2.-.25;
    //p.xz *= rot(PI*(mouse.x / resolution.y-.5) * mouse.x);
    //p.yz *= rot(PI*(mouse.y / resolution.y-.5) * mouse.y);
    p.xz *= rot(-PI*.32);
    p.yz *= rot(-PI*.5);
    //p.yz *= rot(PI*(mouse.y / resolution.y-.5) * mouse.y);
    return p;
}

float map (vec3 p) 
{
  vec3 p1 = p;
  float geo = fract(2.5);
  float cy = 0.5;
  const float repeat = 9.;
  p1.xy *= rot(length(p)*.5);
  float t = .1;//time*0.001;
  for (float i = 0.; i < repeat; ++i) 
  {
    p1.yz *= rot(0.3+t*0.5);
    p1.xy *= rot(0.2+t);
    p1.xz *= rot(.15+.02*pow(sin(time),146.)+t*2.);
    p1.xy *= rot(p.x*.35+t);
        
    // gyroscope
    geo = abs(smin(geo, torus(p1,vec2(1.+i*.12,.01)), .5));
        
    // tentacles cylinders
    geo = abs(smin(geo, sin(cyl(p1.xz,.04)), .35));
        
    // torus along the cylinders
    vec3 p2 = p1;
    p2.y *= mod(p2.y,log2(cy)) - log2(cy)/2.0;
    geo =abs(smin(geo, torus(p2,vec2(abs(.4*fract(p2.y)),.01)), .2));
  }
  return geo;
}

void main( void ) 
{
  vec2 uv = (gl_FragCoord.xy-.5*resolution.xy) / resolution.y;
  vec3 eye = camera(vec3(uv,-3));
  vec3 ray = camera(normalize(vec3(uv,.5)));
  vec3 pos = eye;
  float shade = 0.0;
  #ifdef DITHER
     vec2 dpos = ( gl_FragCoord.xy / resolution.xy );
     vec2 seed = dpos + fract(time*0.);
  #endif 
  for (float i = 0.0; i < STEPS; ++i) 
  {
    float dist = map(pos);
    if (dist < BIAS) 
      shade += 2.0;
        
    #ifdef DITHER
      dist=abs(dist)*(.8+0.2*rand(seed*vec2(i)));
    #endif 
    dist = max(DIST_MIN,dist);
    pos += ray*dist;
  }
  vec4 color = vec4(shade * baseColor / STEPS);
  vec4 buffer = texture2D(renderbuffer, gl_FragCoord.xy / resolution);
  color = max(color, buffer - 0.1);
  gl_FragColor = color;
}
