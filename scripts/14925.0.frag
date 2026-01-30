// Ray marched Menger Sponge by MG.
//
// Speacial thanks to the following.
// Ian McEwan, Ashima Arts. - https://github.com/ashima/webgl-noise/wiki
//	- For the Simplex noise.
// Iñigo Quílez - http://www.iquilezles.org/www/articles/raymarchingdf/raymarchingdf.htm
// 	- For the distance fields functions and general technique.
//	- And Menger Sponge function.
// This article - http://9bitscience.blogspot.com/2013/07/raymarching-distance-fields_14.html
// 	- For the ever so usefull getNormal function.
//	- And the ambient occlusion function.
// NRX - http://glsl.heroku.com/e#14872.2
// 	- For the optimization techniques that I have yet to understand...
//	- And the rotation functions.

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAXDIST		100000000000000.0
#define DELTA		4e-3
#define MAXITER		36
#define BACKGROUND	vec3(0.0, 0.0, 0.0)
#define M_PI		3.1415926535897932384626433832795
#define REFLECTIONS	4

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


vec3 vRotateX(vec3 p, float angle) {
	float c = cos(angle);
	float s = sin(angle);
	return vec3(p.x, c*p.y+s*p.z, -s*p.y+c*p.z);
}

vec3 vRotateY(vec3 p, float angle) {
	float c = cos(angle);
	float s = sin(angle);
	return vec3(c*p.x-s*p.z, p.y, s*p.x+c*p.z);
}

vec3 vRotateZ(vec3 p, float angle) {
	float c = cos(angle);
	float s = sin(angle);
	return vec3(c*p.x+s*p.y, -s*p.x+c*p.y, p.z);
}

float sdBox(vec3 p, vec3 b) {
	vec3 d = abs(p) - b;
	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float mengerSponge(in vec3 p) {
	float d = sdBox(p,vec3(1.0));
	float s = 1.0;
	for( int m=0; m<4; m++ )
	{
		vec3 a = mod( p*s, 2. )-1.0;
		s *= 3.0;
		vec3 r = abs(1.0 - 3.0*abs(a)+0.1*cos(time*365.));
		float da = max(r.x,r.y);
		float db = max(r.y,r.z);
		float dc = max(r.z,r.x);
		float c = (min(da,min(db,dc))-1.0)/s;

		d = max(d,c);
	}
	return d;
}

float getDistance(in vec3 position, out int object) {
	object = 1;
	position = mod(position,1.0/3.0+1.0)-0.5*(1.0/3.0+1.0);
	return mengerSponge(position);
}

float ambientOcclusion(vec3 p, vec3 n)
{
	float stepSize = 0.005;
	float t = stepSize;
	float oc = 0.0;
	int object = 0;
	for(int i = 0; i < 10; ++i)
	{
		float d = getDistance(p + n * t, object);
		oc += t - d; // Actual distance to surface - distance field value
		t += stepSize;
	}

	return 1.0-clamp(oc, 0.0, 1.0);
}

vec3 getNormal(vec3 p) {
	float h = DELTA;
	int object;
	return normalize(vec3(
			getDistance(p + vec3(h, 0.0, 0.0), object) - getDistance(p - vec3(h, 0.0, 0.0), object),
			getDistance(p + vec3(0.0, h, 0.0), object) - getDistance(p - vec3(0.0, h, 0.0), object),
			getDistance(p + vec3(0.0, 0.0, h), object) - getDistance(p - vec3(0.0, 0.0, h), object)));
}

float rayMarch(in vec3 origin, in vec3 direction, out int object) {
	float delta = MAXDIST;
	float dist = 0.0;
	object = 0;
	
	for (int i = 0; i < MAXITER; i++) {
		vec3 p = origin + direction * dist;
		
		delta = getDistance(p, object);
		
		dist += delta;
		if (delta <= DELTA) {
			return dist;
		}
		if (length(p - origin) > MAXDIST) {
			break;
		}
	}
	
	object = 0;
	return MAXDIST;
}

vec3 getLight(in vec3 position, in vec3 direction, in vec3 color) {
	vec3 lightVec = normalize(vec3(0.5, -0.75, 1.0));
	float ambient = 0.2;
	
	vec3 normal = getNormal(position);
	float diffuse = max(0.0, dot(normal, lightVec));
	
	vec3 reflection = normalize(reflect(normalize(direction), normal));
	float specular = pow(max(0.0, dot(reflection, lightVec)), 4.0);

	//ambient = ambient*ambientOcclusion(position, normal);
	return ambient*color + diffuse*color + specular*0.4;
}

vec3 getColor(in vec3 position, in vec3 direction, in int object) {
	vec3 color = BACKGROUND;
	
	if (object != 0) {
		if (object == 1) {
			color = vec3(0.25, 1.0, 0.5);
		}
		
		color = getLight(position, direction, color);
	}
	
	return color;
}

vec3 drawScene(in vec3 origin, in vec3 direction) {
	vec3 totalColor = BACKGROUND;
	float reflectance = 1.0;
	int object;
	
	float cameraDist = MAXDIST;
	for (int i = 0; i < 2; i++) {
		float dist = rayMarch(origin, direction, object);
		vec3 position = origin + direction * dist;
		cameraDist = length(origin - position);
		if (object != 0) {
			vec3 color = getColor(position, direction, object);
			totalColor = totalColor*(1.0-reflectance) + color*reflectance;
			totalColor = mix(totalColor, BACKGROUND, cameraDist/MAXDIST);
			reflectance *= 0.1;
			
			vec3 normal = getNormal(position);
			vec3 reflection = reflect(direction, normal);
			direction = normalize(reflection);
			origin = position + direction* DELTA * 4.0;
		}
		if (cameraDist > MAXDIST) {
			break;
		}
	}
	
	return totalColor;
}

void main() {
	vec2 p=(gl_FragCoord.xy/resolution.y)*2.0;
	p.x-=resolution.x/resolution.y*1.0;p.y-=1.0;
	vec3 origin = vec3(sin(time*3.)*0.1 + 0.15, time, cos(time*3.)*0.1 + 0.15);
	vec3 direction = normalize(vec3(p.x,1.0,p.y));
	
	vec2 aMouse = vec2((mouse.x-0.5)*resolution.x/resolution.y, -mouse.y+0.5) * 2.0;
	
	float cTime = time * 0.08;	
	origin += vec3(0.5, 0.5, 0.5);
	float noiseX = snoise(vec3(cTime, 0.0, 0.0))*0.08;
	float noiseY = snoise(vec3(0.0, cTime, 0.0))*0.02;
	float noiseZ = snoise(vec3(0.0, 0.0, cTime))*0.10;
	direction = vRotateX(direction, -0.2 + noiseX + aMouse.y);
	direction = vRotateZ(direction, 0.4 + noiseZ + aMouse.x);
	direction = vRotateY(direction, noiseY);
	vec3 color = drawScene(origin, direction);

	gl_FragColor = vec4(color, 1.0);
}