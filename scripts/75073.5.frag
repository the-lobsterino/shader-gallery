#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define M_PI 3.1415926535897932384626433832795
#define M_TAU 6.283185307





//	Simplex 3D Noise 
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
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

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

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





float smoothInOut(float i, float mi, float mid, float w, float mx){
	return smoothstep(mi, mid, i) - smoothstep(mid + w, mx, i);
}

vec2 toPolarNorm(vec2 xy){
	vec2 xysq = xy * xy;
	float r1 = sqrt(xysq.x + xysq.y);
	float phi = atan(xy.y, xy.x) + M_PI;
	return vec2(r1, phi / M_TAU);
}

vec2 fromPolarNorm(vec2 polar){
	float x = polar.x * sin(polar.y * M_TAU);
	float y = polar.x * cos(polar.y * M_TAU);
	return vec2(x,y);
}

float spiral(vec2 xy, float scale, float w, float t){
	vec2 polar = toPolarNorm(xy);
	//polar.x = log(polar.x) / log(1.1);
	
	float spLim = mod(t + polar.y, 1.);
	float sp = mod(polar.x / scale - spLim, 1.);
	vec4 fade = (vec4(0.1, 0.21, 0.03, 0.3) * w) ;
	return smoothInOut(sp, fade.x, fade.y, fade.z, fade.a);
}

void main( void ) {
	
	const float scale = 10.;
	vec2 unitScreen = gl_FragCoord.xy / scale; // / min(resolution.x, resolution.y);
	unitScreen -= resolution / (scale * 2.);
	
	//float sf = spiral(unitScreen, 8., 3., time);
	float n0 = snoise(vec3(unitScreen/10., time / 8.));
	//float n0 = snoise(vec3(unitScreen/20., 0));
	float n = pow(n0 + 1., 2.) / 4.;
	float n1 = (atan(dFdy(n), dFdx(n)) + M_PI) / M_TAU;
	
	
	
	vec2 movement = vec2(100. * sin(time / 122.34563456), 100. * cos(time / 117.456873459));
	
	
	float r = toPolarNorm(unitScreen).x + 20.;
	float sf = spiral(fromPolarNorm(vec2(r, n1)) + movement, 60.0, 1.1, time / 10.);
	//float sf = spiral(fromPolarNorm(vec2(r, n)), 3.0, 1., time / 3.);
	//float sf = spiral(unitScreen/2., 20.0, 1., time / 10.);
	
	float tf = smoothInOut(mod(n / 4., 1.), 0., 0.005, 0.002, 0.01);
	
	//float ph = 1.0 - smoothstep(0.98, 1., sf);
	vec3 pink = vec3(1.,0,1.) * sf * tf;
	vec3 blue = vec3(0,0,1.) * sf;
		

	gl_FragColor = vec4( pink, 1.0 );

}
