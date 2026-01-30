//Peocedural solar texture by elijah.semenov@gmail.com

//perlin noise credits to https://github.com/ashima/webgl-noise/wiki
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265359;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

float taylorInvSqrt(float r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 

  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;


  float h = 1.0 - abs(2.0*ns.y);
  float s0 = floor(ns.y)*2.0 + 1.0;

  float a = ns.y + s0*h ;

  vec2 p = vec2(a,h);

//Normalise gradients
  p *= taylorInvSqrt(dot(p,p));

	  vec3 pxxy = p.xxy; 
// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m *= m;
  return 42.0 * dot( m*m, vec4( dot(pxxy,x0), dot(pxxy,x1), 
                                dot(pxxy,x2), dot(pxxy,x3) ) );
  }

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy);
	
	float yAngle = position.x*PI*2.;	
	float xAngle = PI*(position.y-0.5);
	
	float x = cos(yAngle)*cos(xAngle);
	float z = sin(yAngle)*cos(xAngle);
	float y = sin(xAngle);
	
	float noise = 0.;
	for(float i=0.; i<50.; i++)
	{		
		
		noise+= snoise(vec3(x+sin(fract(float(i)+sin(mouse.x))),y+mouse.y,z+ time*0.01)*i)/2.;
	}
	vec3 color = vec3(0.5);
	

	vec3 color2 = vec3(0.5,0.5,0.5);
	

	vec3 finalColor = color*noise+color2;
	
	gl_FragColor = vec4(finalColor,1.);

}