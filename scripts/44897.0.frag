#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

#define PI 3.14159265359
#define T (time / .99)

const int octaves = 8;
const float seed = 43758.5453123;
const float seed2 = 73156.8473192;
const float zoom = 0.8;  
const float rotSpeed = 0.1;

float random(float val) { return fract(sin(val) * seed); }
  
vec2 random2(vec2 st, float seed)
{
  st = vec2( dot(st,vec2(127.1,311.7)), dot(st,vec2(269.5,183.3)) );
  return -1.7 + 2.0*fract(sin(st)*seed);
}
  
float random2d(vec2 uv) 
{ return fract( sin( dot( uv.xy, vec2(12.9898, 78.233) ) ) * seed); }
  
// Value Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st, float seed) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0), seed ), f - vec2(0.0,0.0) ), 
                     dot( random2(i + vec2(1.0,0.0), seed ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0), seed ), f - vec2(0.0,1.0) ), 
                     dot( random2(i + vec2(1.0,1.0), seed ), f - vec2(1.0,1.0) ), u.x), u.y);
}
// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }


const float aoinParam1 = 0.7;

float snow(vec2 uv,float scale)
{
	float w=smoothstep(9.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;
	uv+=(time*aoinParam1)/scale;uv.y+=time*0./scale;uv.x+=sin(uv.y+time*.05)/scale;
	uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;
	p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);
	k=smoothstep(0.,k,sin(f.x+f.y)*0.01);
    	return k*w;
}

float snoise(vec2 v){
	const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
	vec2 i  = floor(v + dot(v, C.yy) );
	vec2 x0 = v -   i + dot(i, C.xx);
	vec2 i1;
	i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	vec4 x12 = x0.xyxy + C.xxzz;
	x12.xy -= i1;
	i = mod(i, 289.0);
	vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
	vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
	m = m*m ;
	m = m*m ;
	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;
	m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
	vec3 g;
	g.x  = a0.x  * x0.x  + h.x  * x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
}
  
vec3 plotCircle(vec2 pos, vec2 uv, float size) {
	return vec3(smoothstep(size, size + 0.05, length(uv - pos)));
}
  
float fbm (in vec2 st, float seed) {
      // Initial values
      float value = 0.0;
      float amplitude = .5;
      float frequency = 0.;
      //
      // Loop of octaves
      for (int i = octaves; i > 0; i--) {
          value += amplitude * abs(noise(st, seed));
          st *= 2.;
          amplitude *= .5;
      }
      return value;
}

float fbm1(in vec2 _st, float seed) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      // Rotate to reduce axial bias
      mat2 rot = zoom*mat2(cos(0.5), sin(0.5),
                      -sin(0.5), cos(0.50));
      for (int i = 0; i < octaves; ++i) {
          v += a * noise(_st, seed);
          _st = rot * _st * 2.0 + shift;
          a *= 0.45;
      }
      return v;
}

  float pattern(vec2 uv, float seed, float ptime, inout vec2 q, inout vec2 r) {
    
    ptime *= 0.1;
    q = vec2( fbm1( uv + vec2(0.0,0.0), seed ),
                   fbm1( uv + vec2(5.2,1.3), seed ) );

    r = vec2( fbm1( uv + 4.0*q + vec2(1.7 - ptime / 2.,9.2), seed ),
                   fbm1( uv + 4.0*q + vec2(8.3 - ptime / 2.,2.8), seed ) );

    vec2 s = vec2( fbm1( uv + 4.0*r + vec2(21.7 - ptime / 2.,90.2), seed ),
                   fbm1( uv + 4.0*r + vec2(80.3 - ptime / 2.,20.8), seed ) );

    vec2 t = vec2( fbm1( uv + 4.0*s + vec2(121.7 - ptime / 2.,90.2), seed ),
                   fbm1( uv + 4.0*s + vec2(180.3 - ptime / 2.,20.8), seed ) );
    
    float rtn = fbm1( uv + 4.0*t, seed );
    
   rtn = clamp(rtn, 0., .5); // This shit is magic!
    
    return rtn;
  }
  
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - 0.5);
	position.x *= resolution.x / resolution.y;
	
	vec3 color = vec3(0.);
	                

	vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y); 
	vec3 finalColor=vec3(0);
	float c=smoothstep(1.,0.3,clamp(uv.y*.3+.9,1.,.85));
	c+=snow(uv,30.)*.3;
	c+=snow(uv,20.)*.5;
	c+=snow(uv,15.)*.8;
	c+=snow(uv,10.);
	c+=snow(uv,8.);
	c+=snow(uv,6.);
	c+=snow(uv,5.);
	
	/**** Playground *******/
	
	vec2 uv2 = (gl_FragCoord.xy - 0.7 * resolution.xy) / resolution.y;
	uv2 *= 1. + dot(uv2, uv2)*.3;
	float rtime = time * rotSpeed;
	mat2 rot = mat2(cos(rtime), sin(rtime),-sin(rtime), cos(rtime));
	uv2 = rot * uv2;
      	uv2 *= 1.4 + sin(rtime) * .3;
      	uv2.x -= rtime;
	vec2 q = vec2(0.,0.);
        vec2 r = vec2(0.,0.);
	vec3 colour = vec3(pattern(uv, seed, time, q, r));
	float QR = clamp(dot(q, r), -1., 1.);
	colour += vec3( (q.x + q.y) + QR * 10., 
                       QR * 15.,   r.x * r.y + QR * 5.);
        colour += .1;
        colour = clamp(colour, 0.05, 1.)*normalize(sqrt(colour*colour));
	vec4 tmpc = vec4((colour*0.5), 1.0);
	
	
	/*************************/
	
	finalColor=(vec3(c));	
	gl_FragColor = tmpc;
	//gl_FragColor = ((vec4( color, 1.0 ) + vec4(finalColor,1)) / vec4(2, 2, 2, 1));

}

/*




 





  


    void main() {
      
      
    
      
      
      
      
      
      
      
      
      
      gl_FragColor = 
    }
*/