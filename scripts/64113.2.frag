/*
 120520 Necip's mix

 * Original shader from: https://www.shadertoy.com/view/MdtfDM
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




#define N(h) fract(sin( vec4(6.0,9.0,1.0,0.0) * h)) 

void mainImage3( out vec4 fragColor, in vec2 fragCoord ) 
{
  vec4 o; 
  vec2 u = fragCoord.xy/resolution.y;
    
  float e = 0.0;
  float d = 0.0;
  float i = 0.0;
	
  vec4 p;
    
  float max = 50.*abs(sin(time*0.1));
  for(float i=1.0; i < 55.0; i++)
  {
	  
	  if (i > max)
		  break;
	  
    e = i * 9.1 + time;
	  
    d = floor(e);
	  
    p = N(d) + 0.3;
	  
    e -= d;
	  
    for(float d = 0.0; d < 10.0; d++)
    {
      o += p * (1. - e) / 500.0 / length(u - (p - e *(N(d * i) - 0.5)).xy);  
    }
  }
	
  fragColor += o;
}


// --------[ Original ShaderToy begins here ]---------- //
const int MAX_STEPS = 256;
const float CLOSENESS = .00001;
const float EPSILON = 0.105;

float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.6-2.*f);
	
    float n = p.x + p.y*157. + 113.*p.z;
    
    vec4 v1 = fract(753.5453123*sin(n + vec4(0., 1., 157., 158.)));
    vec4 v2 = fract(753.5453123*sin(n + vec4(113., 114., 270., 271.)));
    vec4 v3 = mix(v1, v2, f.z);
    vec2 v4 = mix(v3.xy, v3.zw, f.y);
    return mix(v4.x, v4.y, f.x);
}

float field(vec3 p) {
   // random rotation reduces artifacts
   mat3 M = mat3(0.28862355854826727, 0.6997227302779844, 0.6535170557707412,
                 0.06997493955670424, 0.6653237235314099, -0.7432683571499161,
                 -0.9548821651308448, 0.26025457467376617, 0.14306504491456504);
   vec3 p1 = M*p;
   vec3 p2 = M*p1;
   float n1 = noise(p1*5.);
   float n2 = noise(p2*10.);
   float n3 = noise(p1*20.);
   float n4 = noise(p1*40.);
   float rocky = 0.1*n1*n1 + 0.05*n2*n2 + 0.02*n3*n3 + 0.01*n4*n4;
   float sph_dist = length(p) - 1.0;
   return sph_dist + (sph_dist < 0.1 ? rocky*0.2 : 0.);
}

float field_lores(vec3 p) {
   // random rotation reduces artifacts
   mat3 M = mat3(0.28862355854826727, 0.6997227302779844, 0.6535170557707412,
                 0.06997493955670424, 0.6653237235314099, -0.7432683571499161,
                 -0.9548821651308448, 0.26025457467376617, 0.14306504491456504);
   vec3 p1 = M*p;
   float n1 = noise(p1*5.);
   float rocky = 0.1*n1*n1;
   return length(p) - 1.0 + rocky*0.2;
}


vec3 getNormal(vec3 p, float value, mat3 rot) {
    vec3 n = vec3(field(rot*vec3(p.x+EPSILON,p.y,p.z)),
                  field(rot*vec3(p.x,p.y+EPSILON,p.z)),
                  field(rot*vec3(p.x,p.y,p.z+EPSILON)));
    return normalize(n - value);
}

void mainImage2( out vec4 fragColor, in vec2 fragCoord ) {
    vec3 src = vec3(3. * (fragCoord.xy - 0.5*iResolution.xy) / iResolution.yy, 2.0);
    vec3 dir = vec3(0., 0., -1.);
    
    float ang = iTime*0.2;
    mat3 rot = mat3(-sin(ang),0.0,cos(ang),0.,1.,0.,cos(ang),0.,sin(ang));

    
    float t = 0.0;
    float atmos = 0.0;

    vec3 loc = src;
    float value;
    int steps = 0;
    for (int i=0; i < MAX_STEPS; i++) {
        steps++;
        loc = src + t*dir;
        if (loc.z < -1.) break;
        value = field(rot*loc);
        if (value <= CLOSENESS) break;
                if (value > 0.00001)
            atmos += 0.03;


        t += value*0.5;
    }
    // attempt at self-occlusion
    float shad1 = max(0.,field_lores(rot*(loc+normalize(vec3(0.,5.,1.))*0.1)))/0.1;
    float shad2 = max(0.,field_lores(rot*(loc+normalize(vec3(0.,5.,1.))*0.15)))/0.15;
    float shad3 = max(0.,field_lores(rot*(loc+normalize(vec3(0.,5.,1.))*0.2)))/0.2;
    float shad = clamp(shad1*0.333333 + shad2*0.333333 + shad3*0.333333, 0., 1.);
    shad = mix(shad, 1.0, 0.3);
    // attempt at some sort of ambient "glow"
    float ambient = clamp(field(rot*(loc - 0.5 * dir))/0.5*1.2, 0., 1.);
        

    if (value > CLOSENESS) fragColor = vec4(0., 0., 0., 1.);
    else {
      vec3 normal = getNormal(loc, value, rot);
      float light = dot(normal, normalize(vec3(0.,3.,1.)));

      float totalLight = mix(ambient, 1.0*max(0.,shad*light), 0.7);

    
      vec3 color = mix(vec3(0.1,.3,0.5), vec3(0.5,.6,1.2), 1.-(1.0-length(loc))*20.);
      fragColor -= vec4(1.0*color*totalLight, 1.0);
    }
	vec2 p = 2.0* (fragCoord.xy / iResolution.yy - vec2(0.5 /  iResolution.y * iResolution.x, 0.5));
	float q = max(0.1, min(1.0, dot(vec3(p, sqrt(1. - dot(p,p))), vec3(0., 2., 1.))));
        fragColor += q * vec4(shad * max(0.0, pow(dot(normalize(src), normalize(vec3(0.,2., 1))),1.0)) * pow(atmos,1.5) * vec3(0.5, 0.5, 0.9), 1.0);

	fragColor += vec4(q, 0.0, 0.0, 1.0);
}

// --------[ Original ShaderToy begins here ]---------- //
// ***********************************************************
// Conelight sphere
// by Jochen "Virgill" Feldkötter
//
// Just an early experiment for my 4k intro "the explorer"
// http://www.pouet.net/prod.php?which=75741
// ***********************************************************


vec3 lightpos = vec3(0),schein;
float scatter =0.;


float rnd(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.98,78.23))) * 43758.54);
}

float sdCone( vec3 p, vec2 c )
{
    float q = length(p.xy);
    return dot(c,vec2(q,p.z));
}

void pR(inout vec2 p,float a) 
{
	p = cos(a)*p+sin(a)*vec2(p.y,-p.x);
}

float map(in vec3 p) 
{
		
	float d = p.y-.5*log(1.*pow(length(p.xz),1.)+0.2);
 	d = min(d,length(p)-0.4);
   	schein=(p-lightpos);
    pR(schein.zx,iMouse.x*-0.03+0.8);
    pR(schein.yz,iMouse.y*0.03-.5);
	float s= sdCone(schein,normalize(vec2(1,.9)))/length(schein*schein);
    scatter += max(-s,0.)*0.2;
   
    float f = length(p-lightpos)-0.1; 
    return min(f,d);
}


vec3 calcNormal(vec3 pos)
{
    float eps = 0.0002, d = map(pos);
	return normalize(vec3(map(pos+vec3(eps,0,0))-d,map(pos+vec3(0,eps,0))-d,map(pos+vec3(0,0,eps))-d));
}


float castRay(in vec3 ro, in vec3 rd, in float maxt, in vec2 co) {

    float precis = 0.001;
    float h = precis * 2.0;
    float t = -3.5+rnd(co+0.01*iTime)*7.;
    for(int i = 0; i < 200; i++) 
    {
    	if(abs(h) < precis || t > maxt) break;
        h = map(ro+rd*t);
        t += 0.5*h;
    }
    return t;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
{
	// camera setup (iq)   
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= iResolution.x / iResolution.y;
    float theta = iTime * 3.141592 * 0.20;
    float x = 5.0 * cos(theta*0.5);
    float z = 5.0 * sin(theta*0.5);
    vec3 ro = vec3(0.5*x, 4.0, 5.3);
    
    vec3 ta = vec3(0.0, 0.25, 0.0);
    vec3 cw = normalize(ta - ro);
    vec3 cp = vec3(0.0, 1.0, 0.0);
    vec3 cu = normalize(cross(cw, cp));
    vec3 cv = normalize(cross(cu, cw));
    vec3 rd = normalize(p.x * cu + p.y * cv + 7.5 * cw);
   
    lightpos = vec3(1,0.7 + 0.2 * sin(theta*2.0),1); 

    vec3 col = vec3(0);
   	float t= castRay(ro, rd, 15.0,uv);    
	float depth = clamp(t/5.-1.3,0.,1.);
	if (t>15.) t=-1000000.;

	col+=0.3*scatter*vec3(1,0.8,0.6);


	fragColor *= vec4(col,0.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{

	
    mainImage2(gl_FragColor, gl_FragCoord.xy);
	mainImage3(gl_FragColor, gl_FragCoord.xy);
	mainImage(gl_FragColor, gl_FragCoord.xy);
	
	
    gl_FragColor.a = 1.;
}