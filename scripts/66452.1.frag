#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable
#define PI 3.14159
float rand(float n){return fract(sin(n) * 43758.5453123);}
float rand(vec2 n) {return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);}
float randp(vec2 c){return fract(sin(dot(c.xy ,vec2(12.989833,78.23188))) * 43758.5453);}

// Simplex

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float noiseSimplex(vec2 v){
  const vec4 C = vec4(
	  0.211324865405187, 0.366025403784439,
         -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = 
    permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = 
    max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
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

// Perlin

float noisePerlinIteration(vec2 p, float freq ){
	float unit = 720.0/freq;
	vec2 ij = floor(p/unit);
	vec2 xy = mod(p,unit)/unit;
	//xy = 3.*xy*xy-2.*xy*xy*xy;
	xy = .5*(1.-cos(PI*xy));
	float a = randp((ij+vec2(0.,0.)));
	float b = randp((ij+vec2(1.,0.)));
	float c = randp((ij+vec2(0.,1.)));
	float d = randp((ij+vec2(1.,1.)));
	float x1 = mix(a, b, xy.x);
	float x2 = mix(c, d, xy.x);
	return mix(x1, x2, xy.y);
}

float noisePerlin(vec2 p, int res){
	float persistance = .5;
	float n = 0.;
	float normK = 0.;
	float f = 4.;
	float amp = 1.;
	int iCount = 0;
	for (int i = 0; i<50; i++){
		n+=amp*noisePerlinIteration(p, f);
		f*=2.;
		normK+=amp;
		amp*=persistance;
		if (iCount == res) break;
		iCount++;
	}
	float nf = n/normK;
	return nf*nf*nf*nf*11.0-1.0;
}

// Generic McGuire (Kinda Squary too)

float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float noiseMorganMcGuire(vec2 x) {
	vec2 i = floor(x);
	vec2 f = fract(x);
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));	
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Generic Kinda Squary 
	
float noiseGeneric(vec2 n) {
  const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
  return mix(mix(randp(b), randp(b + d.yx), f.x), mix(randp(b + d.xy), randp(b + d.yy), f.x), f.y);
}

//

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

float getElevation( vec2 p ) {
  //return noiseSimplex( p * .40 );
//  return noisePerlin( p * 100.0, 5 );
//  return -1.0 + 2.0 * noiseMorganMcGuire( p );
  return -1.0 + 2.0 * noiseGeneric( p );
}

float getElevation( vec2 p, bool o ) {	
  if( !o ) return getElevation( p );

  float sum = 0.0;
  float ele = 0.0;
  float mul = 1.0;
	
  for( int i = 0; i < 8; i++ )
  {
    sum += mul;
    ele += mul * getElevation( p / mul );
    mul *= 0.5;
  }
	
  return ele / sum;
}

vec4 getColor( float e ) {
  e = min(1.0,max(-1.0,e));
  return e < 0.0 ? 
    vec4( .25 + e * .1, .1 - e * .4, .4 - e * .3, 1.0 ) :
    //vec4( .15, .2, .4, 1.0 ) :
    vec4( .75 + e * .2, .3 + e * .6, .1 + e * .4, 1.0 );
    //vec4( .80, .6, .4, 1.0 );
}

vec4 genClouds()
{
  vec2 p = gl_FragCoord.xy + surfacePosition * 720.0;
	p.x = dot(p,p)*0.002;
	
  p.x += time * 40.0;
  
  float c = 0.0;
	c += .65 * noiseMorganMcGuire( p * .0040 );
	c += .19 * noiseMorganMcGuire( p * .0140 );
	c += .10 * noiseMorganMcGuire( p * .0400 );
	c += .06 * noiseMorganMcGuire( p * .1000 );
	
  return vec4(c*c*c*c);
}

void main( void ) {	
  vec2 p = ( gl_FragCoord.xy ) + surfacePosition;
	p.x += sin(time)*100.0;
	p.y += cos(time)*100.0;
	p-=0.5;
	
	p.x = dot(p,p)*0.002;
  float elevation = 0.0;
  p *= 5.0;	
  
  elevation = getElevation( p * .0014, true ); 
  
	p *= .002;
	elevation += .26*sin( 1.0 + sqrt(p.x*p.x+p.y*p.y) );
	
  //gl_FragColor = getColor( elevation ) + genClouds(); return;
	
  vec4 c = genClouds();
  
  gl_FragColor = ( 1.0 - c.a ) * getColor( elevation ) + c;
}






