/*
	EyeB
	2023 stb
*/

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define res resolution.xy

#define PI 3.14159265

#define MOD3 vec3(443.8975, 397.2973, 491.1871) // uv range
float hash11(float p) {
	vec3 p3  = fract(vec3(p) * MOD3);
    p3 += dot(p3, p3.yzx + 19.191);
    return fract((p3.x + p3.y) * p3.z);
}
float sHash11(float a) {
    return
        mix(
            hash11(floor(a)),
            hash11(floor(a)+1.),
            smoothstep(0., 1., fract(a))
        );
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
//  repetition of x added - stb
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P, float rep){
    P.x = mod(P.x, rep); // x rep 1/2
  
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    
    Pi.z = mod(Pi.z, rep); // x rep 2/2
  
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}



float Eye(vec2 p, float pupil, vec2 lpos) {
	pupil += .1*(1.-length(lpos))-.1;
	
	
	//lpos.x = sin(time);
	
	// radial coords
	vec2 pr = vec2(atan(p.x, p.y) / PI / 2., clamp((length(p)-1.)/pupil+.8, 0., 1.));
	
	// smooth curve from pupil to outer iris
	pr.y = smoothstep(0., 1., pr.y);
	
	// noise frequency for radial coords
	vec2 freq = vec2(30., 1.5);
	
	// radial noise
	float f = pow((cnoise(pr*freq, freq.x)+1.)/4., .5);
	
	// more radial noise
	f -= 1.*pow((cnoise(pr*freq*vec2(2., 3.)+9., 2.*freq.x)+1.)/2.-.5, 2.);
	
	//vec2 lpos = vec2(.5, .75);
	
	// general shading
	float shade = dot(p, lpos);
	
	// lightening of iris
	f -= .7 * shade;
	
	// darker inner iris & pupil
	f *= pow(smoothstep(0., .5, pr.y), .15);
	
	// darker ring around iris
	f = mix(f, .25, smoothstep(0.5, 1., pr.y+.2));
	
	// mix in sclera
	f = mix(f, 1.-.2*dot(p, p)+.75*shade, smoothstep(0.7, .85, pr.y));
	
	// highlight
	f = mix(1., f, clamp((length(p-lpos/1.)-.15)/.025, 0., 1.));
	
	// eyelids
	f = mix(f, 0., clamp((length(vec2(p.x, abs(p.y))+vec2(0., 1.3))-2.15)/.04, 0., 1.));
	
	return f;
}

void main( void ) {

	vec2 p = 3. * (gl_FragCoord.xy-res/2.) / res.y;
	
	// pupil contraction/expansion
	float t = 1.+.05*sHash11(1.5*time);
	

	gl_FragColor = vec4( vec3(Eye(p, t, mouse-.5)), 1.0 );

}