//Ethereal Head
//Perlin noise flame like eyes, Worley noise sockets


#ifdef GL_ES
precision mediump float;
#endif
varying vec2 surfacePosition;
#define R length(surfacePosition+vec2(0., -0.5))*1.2
uniform float time;
#define time time*1e-2 +2e3+ R/sin(R+time*5e-2)
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define PI 3.14159265

//////////////////
// Perlin noise
//////////////////

#define LINEAR_INTERPOLATION

// 1D random numbers
float rand(float n)
{
    return fract(sin(n) * 43758.5453123);
}

// 2D random numbers
vec2 rand2(in vec2 p,float t)
{
	return fract(vec2(sin(p.x * 591.32 + p.y * 154.077 + t), cos(p.x * 391.32 + p.y * 49.077 + t)));
}

// 1D noise
float noise1(float p)
{
	float fl = floor(p);
	float fc = fract(p);
	return mix(rand(fl), rand(fl + 1.0), fc);
}

// voronoi distance noise, based on iq's articles
float voronoi(in vec2 x,float t)
{
	vec2 p = floor(x);
	vec2 f = fract(x);
	
	vec2 res = vec2(8.0);
	for(int j = -1; j <= 1; j ++)
	{
		for(int i = -1; i <= 1; i ++)
		{
			vec2 b = vec2(i, j);
			vec2 r = vec2(b) - f + rand2(p + b,t);
			
			// chebyshev distance, one of many ways to do this
			float d = sqrt(abs(r.x*r.x) + abs(r.y*r.y));
			
			if(d < res.x)
			{
				res.y = res.x;
				res.x = d;
			}
			else if(d < res.y)
			{
				res.y = d;
			}
		}
	}
	return res.y - res.x;
}




vec3 worly_star(vec3 pos,vec2 uv,vec2 suv,float r,float t){
	float flicker = noise1(time * 2.0) * 0.8 + 0.4;
	float v = 0.0;
	
	// that looks highly interesting:
	v = 1.0 - length(uv-pos.xy)/r;
	
	
	// a bit of camera movement
	//uv *= 0.6 + sin(time * 0.1) * 0.4;
	//uv = rotate(uv, sin(0.0 * 0.3) * 1.0);
	//uv += time * 0.4;
	
	
	// add some noise octaves
	float a = 0.16, f = 12.0;
	
	for(int i = 0; i < 4; i ++) // 4 octaves also look nice, its getting a bit slow though
	{	
		float v1 = voronoi(uv * f + 5.0,t);
		float v2 = 0.0;
		
		// make the moving electrons-effect for higher octaves
		if(i > 0)
		{
			// of course everything based on voronoi
			v2 = voronoi(uv * f * 0.5 + 50.0 + t,t);
			
			float va = 0.0, vb = 0.0;
			va = 1.0 - smoothstep(0.0, 0.1, v1);
			vb = 1.0 - smoothstep(0.0, 0.08, v2);
			v += a * pow(va * (0.5 + vb), 2.0);
		}
		
		// make sharp edges
		v1 = 1.0 - smoothstep(0.0, 0.3, v1);
		
		// noise is used as intensity map
		v2 = a * (noise1(v1 * 0.5 + 0.1));
		
		// octave 0's intensity changes a bit
		if(i == 0)
			v += v2 * flicker;
		else
			v += v2;
		
		f *= 3.0;
		a *= 0.7;
	}

	// slight vignetting
	v *= exp(-0.6 * length(suv)) * 1.2;
	
	/*
	// old blueish color set
	vec3 cexp = vec3(1.0, 2.0, 4.0);
		cexp *= 1.3;

	vec3 col = vec3(pow(v, cexp.x), pow(v, cexp.y), pow(v, cexp.z)) * 8.0;*/
	vec3 cexp = vec3(2.0, 1.0, 1.0);
		cexp *= 1.3;

	vec3 col = vec3(pow(v, cexp.x), pow(v, cexp.y), pow(v, cexp.z)) * 2.0;
	return col;
}

vec3 worly_star_custum(vec3 pos,vec2 uv,vec2 suv,float r,float t,vec3 c){
	float flicker = noise1(time * 2.0) * 0.8 + 0.4;
	float v = 0.0;
	
	// that looks highly interesting:
	v = 1.0 - length(uv-pos.xy)/r;
	
	
	// a bit of camera movement
	//uv *= 0.6 + sin(time * 0.1) * 0.4;
	//uv = rotate(uv, sin(0.0 * 0.3) * 1.0);
	//uv += time * 0.4;
	
	
	// add some noise octaves
	float a = 0.16, f = 12.0;
	
	for(int i = 0; i < 4; i ++) // 4 octaves also look nice, its getting a bit slow though
	{	
		float v1 = voronoi(uv * f + 5.0,t);
		float v2 = 0.0;
		
		// make the moving electrons-effect for higher octaves
		if(i > 0)
		{
			// of course everything based on voronoi
			v2 = voronoi(uv * f * 0.5 + 50.0 + t,t);
			
			float va = 0.0, vb = 0.0;
			va = 1.0 - smoothstep(0.0, 0.1, v1);
			vb = 1.0 - smoothstep(0.0, 0.08, v2);
			v += a * pow(va * (0.5 + vb), 2.0);
		}
		
		// make sharp edges
		v1 = 1.0 - smoothstep(0.0, 0.3, v1);
		
		// noise is used as intensity map
		v2 = a * (noise1(v1 * 0.5 + 0.1));
		
		// octave 0's intensity changes a bit
		if(i == 0)
			v += v2 * flicker;
		else
			v += v2;
		
		f *= 3.0;
		a *= 0.7;
	}

	// slight vignetting
	v *= exp(-0.6 * length(suv)) * 1.2;
	
	
	// old blueish color set
	vec3 cexp = c;
		cexp *= 1.3;

	vec3 col = vec3(pow(v, cexp.x), pow(v, cexp.y), pow(v, cexp.z)) * 8.0;
	//vec3 cexp = vec3(2.0, 1.0, 1.0);
	//	cexp *= 1.3;

	//vec3 col = vec3(pow(v, cexp.x), pow(v, cexp.y), pow(v, cexp.z)) * 2.0;
	return col;
}

float permutation(float index) {
	return mod(index * index, 257.0);
}

vec3 gradient(float index) {
	
	index = mod(index * index, 251.0);
	
	float angleAroundZ = mod(index, 16.0) * (2.0 * PI / 16.0);
	float angleAroundY = floor(index / 16.0) * (2.0 * PI / 16.0);
	
	vec3 gradient = vec3(cos(angleAroundZ), sin(angleAroundZ), 0.0);
	vec3 rotatedGradient;
	rotatedGradient.x = gradient.x * cos(angleAroundY);
	rotatedGradient.y = gradient.y;
	rotatedGradient.z = gradient.x * sin(angleAroundY);

	return rotatedGradient;
}
 
float hermit3D(vec3 position) {
	vec3 square = position * position;
	vec3 cube = square * position;
	return (3.0*square.x - 2.0*cube.x) * (3.0*square.y - 2.0*cube.y) * (3.0*square.z - 2.0*cube.z);
}

float perlinNoise3D(int gridWidth, int gridHeight, int gridDepth, vec3 position) {

	// Takes input position in the interval [0, 1] in all axes, outputs noise in the range [0, 1].
	vec3 gridDimensions = vec3(gridWidth, gridHeight, gridDepth);
	position *= gridDimensions;
		
	// Get corners,
	vec3 lowerBoundPosition = floor(position);

	// Calculate gradient values!
	float gradientValues[8];
	for (float z=0.0; z<2.0; z++) {
		for (float y=0.0; y<2.0; y++) {
			for (float x=0.0; x<2.0; x++) {
				vec3 currentPointPosition = lowerBoundPosition + vec3(x, y, z);
				
				vec3 displacementVector = (currentPointPosition - position);
				vec3 gradientVector = gradient(mod(currentPointPosition.x + permutation(mod(currentPointPosition.y + permutation(currentPointPosition.z), 256.0)), 256.0));
				
				gradientValues[int((z*4.0) + (y*2.0) + x)] = (0.0 + dot(gradientVector, displacementVector)) * 2.0;
			}
		}
	}
	

	
	// Interpolate using Hermit,
	vec3 interpolationRatio = position - lowerBoundPosition;
	float finalNoise = 0.0;
	finalNoise += gradientValues[7] * hermit3D(interpolationRatio);
	finalNoise += gradientValues[6] * hermit3D(vec3(1.0 - interpolationRatio.x,       interpolationRatio.y,       interpolationRatio.z));
	finalNoise += gradientValues[5] * hermit3D(vec3(      interpolationRatio.x, 1.0 - interpolationRatio.y,       interpolationRatio.z));
	finalNoise += gradientValues[4] * hermit3D(vec3(1.0 - interpolationRatio.x, 1.0 - interpolationRatio.y,       interpolationRatio.z));

	finalNoise += gradientValues[3] * hermit3D(vec3(      interpolationRatio.x,       interpolationRatio.y, 1.0 - interpolationRatio.z));
	finalNoise += gradientValues[2] * hermit3D(vec3(1.0 - interpolationRatio.x,       interpolationRatio.y, 1.0 - interpolationRatio.z));
	finalNoise += gradientValues[1] * hermit3D(vec3(      interpolationRatio.x, 1.0 - interpolationRatio.y, 1.0 - interpolationRatio.z));
	finalNoise += gradientValues[0] * hermit3D(vec3(1.0 - interpolationRatio.x, 1.0 - interpolationRatio.y, 1.0 - interpolationRatio.z));
	
	
		
	return finalNoise;
}


vec3 sphereCenter = vec3(0.0, 0.0, 0.5);
const float sphereRadius = 0.25;

float field(in vec3 p,float s,float t) {
	float strength = 7. + .03 * log(1.e-6 + fract(sin(t) * 4373.11));
	float accum = s/4.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < 28; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-.5, -.4, -1.5);
		float w = exp(-float(i) / 7.);
		accum += w * exp(-strength * pow(abs(mag - prev), 2.2));
		tw += w;
		prev = mag;
	}
	return max(0., 5. * accum / tw - .7);
}

vec3 nrand3( vec2 co )
{
	vec3 a = fract( cos( co.x*8.3e-3 + co.y )*vec3(1.3e5, 4.7e5, 2.9e5) );
	vec3 b = fract( sin( co.x*0.3e-3 + co.y )*vec3(8.1e5, 1.0e5, 0.1e5) );
	vec3 c = mix(a, b, 0.5);
	return c;
}

vec4 greenstars(){
	vec2 uv = 2. * gl_FragCoord.xy / resolution.xy - 1.;
        
	vec2 uvs = uv * resolution.xy / max(resolution.x, resolution.y);
	vec3 p = vec3(uvs / 4., 0) + vec3(1., -1.3, 0.);
	
	p += .2 * vec3(sin(time / 16.), sin(time / 12.),  sin(time / 128.));
	
    
	float freqs[4];
	//Sound
	freqs[0] = 0.2;
	freqs[1] = 0.97;
	freqs[2] = .04;
	freqs[3] = -0.22;

	float f=freqs[2];
	float t = 1.2*field(p,f,time);
	float v = 1.; //(1. - exp((abs(uv.x) - 1.) * 6.)) * (1. - exp((abs(uv.y) - 1.) * 6.));
	
        vec4 starcolor;
        vec4 c2;

	vec2 seed = p.xy * 2.0;	
	seed = floor(seed * resolution.x);
	vec3 rnd = nrand3( seed );
	starcolor = vec4(pow(rnd.y,40.0))*10.;

	return mix(freqs[3]-.3, 1., v) * vec4(1.5*freqs[2] * t * t* t , 1.2*freqs[1] * t * t, freqs[3]*t, 1.0)+c2;//+starcolor;
}

vec4 eye(vec2 pos,vec3 pointPosition){
  float noise = 0.0;
  vec3 noisePoint = vec3(pointPosition.xy, pointPosition.z-(time*0.06));
  noise +=         abs(perlinNoise3D(4, 4, 4, noisePoint));
  noise += 0.500 * abs(perlinNoise3D(8, 8, 8, noisePoint));
  noise += 0.250 * abs(perlinNoise3D(16, 16, 16, noisePoint));
  noise += 0.125 * abs(perlinNoise3D(32, 32, 32, noisePoint));
  noise += 0.0625 * abs(perlinNoise3D(64, 64, 64, noisePoint));
	    
  float radius = length(pointPosition) - 1.0*sphereRadius;
  radius /= sphereRadius * 0.4;
  float phase = clamp(radius + 1.0*noise, 0.0, 0.5*PI);
  radius = sin(phase);
  
  vec4 color;
  color = mix(vec4(0.8, 0.55, 0.2, 1.0), vec4(1.0, 0.1, 0.0, 1.0), radius)* 2.*(1.0 - radius);
  color*=5.*pow(smoothstep(0.0,1.0,2.0*length(pos)),0.85);
  vec3 col=clamp(worly_star(vec3(0.),pos,pos,0.075,time),0.,1.);
  col=clamp(col,0.,1.);
  color=color-0.2;
  color=clamp(color,0.,1.);
  color+=vec4(col,1.);
  return color;
}

// srtuss, 2014

#define pi2 3.1415926535897932384626433832795

float tri(float x, float s)
{
    return (abs(fract(x / s) - 0.5) - 0.25) * s;
}

float hash(float x)
{
    return fract(sin(x * 171.2972) * 18267.978 + 31.287);
}

vec3 pix(vec2 p, float t, float s)
{
    s += floor(t * 0.25);
    float scl = (hash(s + 30.0) * 4.0);
    scl += sin(t * 2.0) * 0.25 + sin(t) * 0.5;
    t *= 3.0;
    vec2 pol = vec2(atan(p.y, p.x), length(p));
    float v;
    float id = floor(pol.y * 2.0 * scl);
    pol.x += t * (hash(id + s) * 2.0 - 1.0) * 0.4;
    float si = hash(id + s * 2.0);
    float rp = floor(hash(id + s * 4.0) * 5.0 + 4.0);
    v = (abs(tri(pol.x, pi2 / rp)) - si * 0.1) * pol.y;
    v = max(v, abs(tri(pol.y, 1.0 / scl)) - (1.0 - si) * 0.11);
    v = smoothstep(0.01, 0.0, v);
    return vec3(v);
}

vec3 pix2(vec2 p, float t, float s)
{
    return clamp(pix(p, t, s) - pix(p, t, s + 8.0) + pix(p * 0.1, t, s + 80.0) * 0.2, vec3(0.0), vec3(1.0));
}

vec2 hash2(in vec2 p)
{
	return fract(1965.5786 * vec2(sin(p.x * 591.32 + p.y * 154.077), cos(p.x * 391.32 + p.y * 49.077)));
}

vec3 blur(vec2 p)
{
    vec3 ite = vec3(0.0);
    for(int i = 0; i < 20; i ++)
    {
        float tc = 0.15;
        ite += pix2(p, time * 3.0 + (hash2(p + float(i)) - 0.5).x * tc, 5.0);
    }
    ite /= 20.0;
    ite += exp(fract(time * 0.25 * 6.0) * -40.0) * 2.0;
    return ite;
}


void main() {
  vec2 uv=gl_FragCoord.xy/resolution.xy-.5;
  uv.y*=resolution.y/resolution.x;
  vec3 pointPosition = vec3((gl_FragCoord.xy / resolution)*2.0 - 1.0, 0.0);
  vec4 color;
  vec2 pos;
  pos=(uv-vec2(-0.20,0.1))*2.;
  pointPosition=vec3(pos,pos.x*pos.x+pos.y+pos.y);
  pointPosition.y *= 0.5;
  color=eye(pos,pointPosition);

  pos=(uv-vec2( 0.20,0.1))*2.;
  pointPosition=vec3(pos,pos.x*pos.x+pos.y+pos.y);
  pointPosition.y *= 0.5;
  color+=eye(pos,pointPosition);
	
  color+=vec4(clamp(worly_star_custum(vec3(0.,0.3,0.),uv,uv,0.15,time,vec3(1.0, 2.0, 4.0)),0.,1.),2.5);
  //color-=0.4;
  //color=clamp(color,0.,1.);

  float a=2.;
  float b=3.2;
  
  float d=clamp( (uv.x*uv.x/(a*a)+uv.y*uv.y/(b*b)-0.03)*100.  ,0.,1.);
  d=1.0-d;
	
  //color=vec4(d);
  //color*=4.;
  vec4 stars=2.*greenstars()*d*1./(1.00-0.99*(0.5+0.5*sin(mod(uv.y*1.25-time*1.,3.14159*1.))));
  stars=clamp(stars,vec4(0.),stars);
  color=mix(stars,color,clamp(length(color)*0.20,0.,1.));//*(1.0 - pow(uv.x*uv.x+0.4*uv.y*uv.y,0.25))
	
  gl_FragColor = color;




// Star Nest by Pablo Román Andrioli
// Modified a lot.

// This content is under the MIT License.

#define iterations 15
#define formuparam 0.340

#define volsteps 12
#define stepsize 0.110

#define zoom   0.9
#define tile   0.750
#define speed  2.

#define brightness 0.0017
#define darkmatter 0.400
#define distfading 0.960
#define saturation 1.50

	//get coords and direction
	uv=gl_FragCoord.xy/resolution.xy-.5;
	uv.y*=resolution.y/resolution.x;
	vec3 dir=vec3(uv*zoom,1.);
	
	float a2=time*speed+.5;
	float a1=0.0;
	mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	mat2 rot2=rot1;//mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
	dir.xz*=rot1;
	dir.xy*=rot2;
	
	//from.x-=time;
	//mouse movement
	vec3 from=vec3(0.,0.,0.);
	from+=vec3(.05*time,.05*time,-2.);
		
	from.xz*=rot1;
	from.xy*=rot2;
	
	//volumetric rendering
	float s=.1,fade=.07;
	vec3 v=vec3(0.4);
	for (int r=0; r<volsteps; r++) {
		vec3 p=from+s*dir*1.5;
		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
		p.x+=float(r*r)*0.01;
		p.y+=float(r)*0.02;
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) { 
			p=abs(p)/dot(p,p)-formuparam; // the magic formula
			a+=abs(length(p)-pa*0.2); // absolute sum of average change
			pa=length(p);
		}
		//float dm=max(0.,darkmatter-a*a*.001); //dark matter
		a*=a*a*2.; // add contrast
		//if (r>3) fade*=1.-dm; // dark matter, don't render near
		//v+=vec3(dm,dm*.5,0.);
		//v+=fade;
		v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
		fade*=distfading; // distance fading
		s+=stepsize;
	}
	v=mix(vec3(length(v)),v,saturation); //color adjust
	gl_FragColor *= vec4(v*.01,1.);	
	
	
	
	
 	uv = gl_FragCoord.xy / resolution.xy;
    uv = 2.0 * uv - 1.0;
    uv.x *= resolution.x / resolution.y;
    uv += (vec2(hash(time), hash(time + 9.999)) - 0.5) * 0.03;
    vec3 c = vec3(blur(uv + vec2(0.005, 0.0)).x, blur(uv + vec2(0.0, 0.005)).y, blur(uv).z);
    c = pow(c, vec3(0.4, 0.6, 1.0) * 2.0) * 1.5;
    c *= exp(length(uv) * -1.0) * 2.5;
    c = pow(c, vec3(1.0 / 2.2));
	gl_FragColor -= vec4(c, 1.0);
}


// gpu stressin' copypasta... 880m is sweatin'