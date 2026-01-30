#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//eat some pi
const float pi   = 3.1415926535897932384626433832795; //pi
const float pisq = 9.8696044010893586188344909998762; //pi squared
const float picu = 31.006276680299820175476315067101; //pi cubed
const float pipi = 36.462159607207911770990826022692; //pi pied
const float sqpi = 1.7724538509055160272981674833411; //sqrt of pi
const float cupi = 1.4645918875615232630201425272638; //curt of pi
const float prpi = 1.4396194958475906883364908049738; //pirt of pi
const float twpi = 6.283185307179586476925286766559 ; //2 x pi 
const float hfpi = 1.5707963267948966192313216916398; //0.5 x pi
const float lgpi = 0.4971498726941338543512682882909; //log pi 
const float rcpi = 0.31830988618379067153776752674503;// 1/pi

const int   complexity  =6; 
const float   rez      	= pipi*pipi; 
const float speed  	= rcpi/pi; 

uniform sampler2D backbuffer;

vec3 smear(vec3 xyz)
{
	
	vec2 fcn= gl_FragCoord.xy/resolution;
	const float ssiz= .001;
	vec4 xp= texture2D(backbuffer, fcn+vec2( ssiz,0));
	vec4 xn= texture2D(backbuffer, fcn+vec2(-ssiz,0));
	vec4 yp= texture2D(backbuffer, fcn+vec2(0, ssiz));
	vec4 yn= texture2D(backbuffer, fcn+vec2(0,-ssiz));
	
	vec4 xpyp= texture2D(backbuffer, fcn+vec2( ssiz, ssiz));
	vec4 xpyn= texture2D(backbuffer, fcn+vec2( ssiz,-ssiz));
	vec4 xnyp= texture2D(backbuffer, fcn+vec2(-ssiz, ssiz));
	vec4 xnyn= texture2D(backbuffer, fcn+vec2(-ssiz,-ssiz));
	
		
	//return vec3(0.,0.,0.);
	return ((vec4( ((xp+xn+yp+yn)/8. + ( xpyp+xpyn+xnyp+xnyn)/8.) ).xyz)+xyz*3.)/2.5;
}
 
vec3 smoot(vec3 v) 
{
	//some fixex
	v.z/=pipi;
	float tc = sin(v.z*pi);
	vec3 p=vec3(cos(v.x)*sin(tc+v.z*sqpi),sin(v.y*cupi)*cos(tc+v.z),cos(lgpi*v.x+tc)*sin(lgpi*v.y+tc));
	vec3 q=normalize(vec3(v.x+cos(tc*hfpi+cupi)*pi,v.y+sin(tc*hfpi+cupi)*pi,v.x+v.y));
	vec3 r=normalize(p);
	p = normalize((p+q+r));
	vec3 swapp=p;
	
  	for(int i=1;i<complexity+1;i++)
  	{
		swapp = p + vec3( cos(sqrt(abs(p.x*q.z))*pi)+sin(p.y)*(cos(float(i)*lgpi)), 
				 sin(sqrt(abs(p.y*q.z))*pi)+cos(p.x)*(sin(float(i)*lgpi)), 
				 ((sin(p.z+p.z)+cos((q.y*q.x)+tc)+sin(p.z+float(i)/pi))) );
		p = swapp;
		
		q += cos(sqrt(abs(p))*pi)+0.5;
		r += (normalize(q)/pi)+((q*float(i)/(pisq))*pi)+0.5;
  	}
	q = normalize((q+r));
	float d = cos((q.x+q.y+q.z)*twpi)*0.4+0.6;
	p=(((cos(p))))*pi;
	vec3 col=(vec3((sin(p.x)*0.5+0.5)*d,((sin(p.y)*cos(p.z))*0.5+0.5)*d,(cos(p.z+p.y)*0.5+0.5)*d));
	vec3 hol = normalize(col);

	vec3 sol=vec3(d,d,d);
	//if(length(xy)>.08) col=normalize(col*(q*0.5+0.5));
	return normalize(smear((sol*sol)*normalize(smear(col))));
	
}
vec3 rotate(vec3 v,vec2 r) 
{
	mat3 rxmat = mat3(1,   0    ,    0    ,
			  0,cos(r.y),-sin(r.y),
			  0,sin(r.y), cos(r.y));
	mat3 rymat = mat3(cos(r.x), 0,-sin(r.x),
			     0    , 1,    0    ,
			  sin(r.x), 0,cos(r.x));
	
	
	return (v*rxmat)*rymat;
	
}

float snoise(vec3 v);

void main( void ) {

	vec2 nMouse;
	nMouse.x = mouse.x;
	nMouse.y = mouse.x;

	vec2 res = vec2(resolution.x/resolution.y,1.0);
	vec2 p = ( gl_FragCoord.xy / resolution.y ) -(res/2.0);
	
	vec2 m = (nMouse-0.5)*pi*vec2(2.,1.);
	
	vec3 color = vec3(0.0);
	
	vec3 pos = normalize(rotate(vec3(p,0.5),vec2(m)));
	

	color = vec3(1.-abs(snoise(pos*4.0+vec3(0,time,0))));
	color *= pos.y+0.75;
	color *= (mix(vec3(1.0,0.5,0.0),vec3(0.,1,.5),pos.x));
		
	gl_FragColor = vec4(  smoot(color) , 1.0 );

}



//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
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

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }