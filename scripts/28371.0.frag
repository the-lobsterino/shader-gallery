// CBS
// ported from https://www.shadertoy.com/view/lslGWr
// Added some stars: Thanks to http://glsl.heroku.com/e#6904.0



// fusion of starnest and CBS 


#ifdef GL_ES
precision mediump float;
#endif


#define iterations 7
#define formuparam 0.89

#define volsteps 7
#define stepsize 0.160

#define zoom   2.900
#define tile   0.850
#define speed  0.0001

#define brightness 0.04
#define darkmatter 0.400
#define distfading 0.560
#define saturation 0.800

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//#define time 8.0*time

// http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/
float field(in vec3 p) {
	float strength = 7. + .03 * log(1.e-6 + fract(sin(time) * 4373.11));
	float accum = 0.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < 7; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-.5, -.4, -1.5);
		float w = exp(-float(i) / 7.);
		accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
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


void main() {
	vec2 uv2 = 2. * gl_FragCoord.xy / resolution.xy - 1.;
	vec2 uvs = uv2 * resolution.xy / max(resolution.x, resolution.y);
	vec3 p = vec3(uvs / 4., 0) + vec3(1., -1.3, 0.);
	//p *= 0.5;
	//p += 
	
	float a1 = 0.00003*time;
	float a2 = .9;
	
	mat2 rot1 = mat2(cos(1.*a1), -sin(1.*a1),  sin(1.*a1), cos(1.*a1) );
	mat2 rot1a = mat2(cos(10.*a1), -sin(10.*a1),  sin(10.*a1), cos(10.*a1) );
	mat2 rot2 = mat2(cos(a2), -sin(a2),  sin(a2), cos(a2) );
	
	//p.y += 2.0;
	
	p.x -= 0.25*mouse.x;
	p.y -= 0.25*mouse.y;
	
	p.x += 0.25*(1.0+0.001*time)*5.0*cos(0.01*time);
		p.y += 0.25*(1.0+0.001*time)*5.0*sin(0.01*time);

	//p.yz *= rot1a;
	p.z += 0.003*time;

	p.xy *= rot2;
	p.xz *= -rot2;
	p.yz *= rot2;
	
	p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
		
	
	float t = field(p);
	float v2 = (1. - exp((abs(uv2.x) - 1.) * 6.)) * (1. - exp((abs(uv2.y) - 1.) * 6.));
	
	
	

	//get coords and direction
	//vec2 uv=gl_FragCoord.xy/resolution.xy-.5;
	//uv.y*=resolution.y/resolution.x;
	
	vec2 uv = uvs;
	
	vec3 dir=vec3(uv*zoom,1.);
	//float a2=time*speed+.5;
	
	//float a1=0.0;
	//mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	//mat2 rot2=rot1;//mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
//	dir.yz*=rot2;
	
	//from.x-=time;
	//mouse movement
	vec3 from=vec3(2.,-3.4,0.7);
	//from.xz*=rot2*rot2;
	//from.yz *= -rot2;
	
	//from+=vec3(.05*time,.05*time,-2.);
	
	
	from.x += 5.0*(1.0+0.001*time)*cos(0.01*time);
		from.y += 5.0*(1.0+0.001*time)*sin(0.01*time);
	from.z += 0.003*time;
	//from.yz *= rot1;
	from.x-=mouse.x;
	from.y-=mouse.y;
	
	dir.xy*=rot2;
	from.xy *= rot2;
	
	dir.xz *= -rot2;
	from.xz*=-rot2;
	
	dir.yz*=rot2;
	from.yz *= rot2;
	
	
	
	//from.xy*=rot2;
	
	//volumetric rendering
	float s=.4,fade=.2;
	vec3 v=vec3(0.4);
	for (int r=0; r<volsteps; r++) {
		vec3 p=from+s*dir*.5;
		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) { 
			p=abs(p)/dot(p,p)-formuparam; // the magic formula
			a+=abs(length(p)-pa); // absolute sum of average change
			pa=length(p);
		}
		float dm=max(0.,darkmatter-a*a*.001); //dark matter
		a*=a*a*2.; // add contrast
		if (r>3) fade*=1.-dm; // dark matter, don't render near
		//v+=vec3(dm,dm*.5,0.);
		v+=fade;
		v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
		fade*=distfading; // distance fading
		s+=stepsize;
	}
	v=mix(vec3(length(v)),v,saturation); //color adjust
	
	vec4 forCol = vec4(v*.01,1.);
	
	vec4 backCol = mix(.4, 1., v2) * vec4(1.8 * t * t * t, 1.4 * t * t, t, 1.0);
	
	backCol *= 0.2;
	backCol.b *= 1.0;
	//backCol.r = mix(backCol.r, backCol.b, 0.2);
	
	//forCol.g *= max((backCol.r * 4.0), 1.0);
	
	forCol.r += backCol.r * 0.05;
	
	forCol.b += 0.5*mix(backCol.g, backCol.b, 0.8);
	
	gl_FragColor = forCol;
	
	
	
}