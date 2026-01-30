#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;


//value noise
float noise(in vec2 uv) 
{
    float k = 23.;
    vec4 l  = vec4(floor(uv),fract(uv));
    float u = l.x + l.y * k;
    vec4 v  = vec4(u, u+1.,u+k, u+k+1.);
    v       = fract(fract(v*1.23456789)*9.18273645*v);
    l.zw    = l.zw*l.zw*(3.-2.*l.zw);
    l.x     = mix(v.x, v.y, l.z);
    l.y     = mix(v.z, v.w, l.z);
    return    mix(l.x, l.y, l.w);
}


// Ridged multifractal
// See "Texturing & Modeling, A Procedural Approach", Chapter 12
float ridge(float h, float offset)
{
	h = abs(h);
	h = offset - h;
	h = h * h;
	return h;
	
}

float Ridgedmf(vec2 p, float gain, int octaves, float lacunarity, float offset)
{
	float sum = 0.;
	float freq = 1.0, amp = 0.7;
	float prev = 3.0;
	for(int i=0; i<18; i++) {
		float n = ridge(noise(p * freq), offset);
		sum += n*amp*prev;
		prev = n;
		freq *= lacunarity;
		amp *= gain;
	}
	return sum;
}

float Turbulence(vec2 p,float gain)
{
	float lacunarity = 2.;
	float sum = 0.;
	float freq = 1.10, amp = 1.2;
	
	for(int i=0; i<8; i++) {
		sum += abs(noise(p * freq))*amp;
		freq *= lacunarity;
		amp *= gain;
	}
	
	return sum;
}

vec2 roundCloud(vec2 uv)
{
	uv = uv * 1. - 0.5;
	uv.x *= resolution.x/resolution.y;
	return uv;
}

vec3 nrand3( vec2 co )
{
   vec3 a = fract( cos( co.x*8.3e-3 + co.y )*vec3(1.3e5, 4.7e5, 2.9e5) );
   vec3 b = fract( sin( co.x*0.3e-3 + co.y )*vec3(8.1e5, 1.0e5, 0.1e5) );
   vec3 c = mix(a, b, 0.5);
   return c;
}

void main( void ) {
	

	vec2 orig = gl_FragCoord.xy / resolution.xy;
	orig = roundCloud(orig);
	
	vec2 old = orig;
	float scale = 3.;
	
	float n_x = Turbulence(orig * 2.,0.65);
	float n_y = Turbulence(orig * 2.,0.65);
	
	n_x = (n_x - .5) * 2.;
	n_y = (n_y - .5) * 2.;
	
	orig.x += 0.15*n_x + time/30.;
	orig.y += 0.15*n_y + time/30.;

	
	float noise = Turbulence(orig * scale / 5.,0.25) / 5.;
	float noise2 = Turbulence(orig * scale / 2.,0.25) / 2.;
	float noise3 = Ridgedmf(orig * scale / 4.,0.25,9,1.,1.) / 2.;
	
	float falloff 		= length(old);
	float n1		= clamp(pow(noise, 4. +max(falloff, noise)) * (1. - falloff), 0., 1.);
	float n2		= clamp(pow(noise2,  7. + max(falloff, noise)) * (1. - falloff), 0., 1.);
	float n3		= clamp(pow(noise3,  9. + max(falloff, noise)) * (1. - falloff), 0., 1.);
	
	vec4 color = vec4(0);
	
	color = vec4(n1, n1*n1, n1*n1*n1*n1,1);
	color = mix(color,vec4(2, 84, 161,1),n2 / 5.);
	color = mix(color,vec4(31, 183, 167,1),n3 / 5.);
	
	float freqs[4];
	freqs[0] = noise;
	freqs[1] = n1; 
	freqs[2] = n2;
	freqs[3] = n3; 

	
	// STARS (check http://glslsandbox.com/e#26608)
	vec2 seed = old.xy;   
	seed = floor(seed * 800.0);
	vec3 rnd = nrand3( seed );
	color += vec4(length(pow(rnd.y,25.)));
 
	
	float t = color.r + color.g + color.b;
	color += mix(freqs[3]-.5, 1.,1.0) *vec4(1.5*freqs[2] * t * t* t , 1.2*freqs[1] * t * t, freqs[3]*t, n1 * n2 * time);
	
	gl_FragColor = color;
	// By Cake

}