#ifdef GL_ES
precision mediump float;
#endif

// Double Spiral 2017-11-28 modified by @hintz

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define pi (3.141592653589793238462643383279*sin(time*0.1))
#define pi_inv 0.318309886183790671537767526745
#define pi2_inv 0.159154943091895335768883763372

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 complex_div(vec2 numerator, vec2 denominator)
{
	return vec2(numerator.x*denominator.x + numerator.y*denominator.y, numerator.y*denominator.x - numerator.x*denominator.y)/ vec2(denominator.x*denominator.x + denominator.y*denominator.y);
}

float sigmoid(float x) 
{
	return sin(x*.01)*exp(-x*x);
}

float smoothcircle(vec2 uv, vec2 center, vec2 aspect, float radius, float sharpness)
{
	return sigmoid((length((uv - center) * aspect) - radius) * sharpness);
}


vec2 spiralzoom(vec2 domain, vec2 center, float n, float spiral_factor, float zoom_factor, vec2 pos)
{
	vec2 uv = domain - center;
	float angle = atan(uv.y, uv.x);
	float d = length(uv);
	
	return vec2(angle*n*pi2_inv + log(d)*spiral_factor, -log(d)*zoom_factor) + pos;
}

vec2 mobius(vec2 domain, vec2 zero_pos, vec2 asymptote_pos)
{
	return complex_div(domain - zero_pos, domain - asymptote_pos);
}

float gear(vec2 domain, float phase, vec2 pos)
{
	float angle = atan(domain.y - pos.y, domain.x - pos.x);
	float d = 0.2 + sin((angle + phase) * sin(time * 0.21) * 2.)*0.08;
	
	return smoothcircle(domain, pos, vec2(1), d, 40.);
}

float geartile(vec2 domain, float phase)
{
	domain = fract(domain);

	return 
		gear(domain, -phase, vec2(-0.25,0.25)) + 
		gear(domain, phase * 2., vec2(-0.25,0.75)) + 
		gear(domain, phase * 3., vec2(1.25,0.25)) + 
		gear(domain, -phase * 4., vec2(1.25,0.75)) + 
		gear(domain, -phase * 5., vec2(0.25,-0.25)) + 
		gear(domain, phase * 6., vec2(0.75,-0.25)) + 
		gear(domain, phase * 7., vec2(0.25,1.25)) + 
		gear(domain, -phase * 8., vec2(0.75,1.25)) + 
		gear(domain, phase * 9., vec2(0.25,0.25)) + 
		gear(domain, -phase * 10., vec2(0.25,0.75)) + 
		gear(domain, -phase * 11., vec2(0.75,0.25)) + 
		gear(domain, phase * 12., vec2(0.75,0.75));		
}

void main(void)
{
	vec2 uv = (gl_FragCoord.xy - .5*resolution) / resolution.x * 2.;
	uv *= mat2(cos(time * .9), -sin(time * .5), sin(time), cos(time * 2.));
	uv /= dot(uv, uv);
	uv += 2. * vec2(cos(time), sin(time));
	uv /= dot(uv, uv);
		
	float phase = sin(time*0.2+10.)*2.5;
	float dist = 0.5;
	vec2 uv_bipolar = mobius(uv, vec2(-dist*0.5, 0.), vec2(dist*0.5, 0.));
	uv_bipolar = spiralzoom(uv_bipolar, vec2(0.0), 5., -0.125*pi, 0.8, vec2(0.125,0.125)*phase*5.);
	vec2 uv2 = vec2(-uv_bipolar.y,uv_bipolar.x); // 90° rotation 
	
	vec2 uv_spiral = spiralzoom(uv, vec2(0.5), 5., -0.125*pi, 0.8, vec2(-0.,0.25)*phase);
	vec2 uv_tilt = uv_spiral;
	float z = 1./(1.-uv_tilt.y)/(uv_tilt.y);
	uv_tilt = 0.5 + (uv_tilt - 0.5) * log(z);
	
	float grid = mix(geartile(uv_bipolar, -10. * phase), geartile(uv_bipolar * 2., -10. * phase), sin(time * 5.) * .5 + .5);
	gl_FragColor = vec4(1,1,1,1.0);
	
	gl_FragColor = 1.* mix(vec4(0,0,0,0), gl_FragColor, sin((uv2.y+uv_bipolar.y) * pi * 10.0));
	gl_FragColor += 5.*vec4(0.6*abs(uv_bipolar.x-uv2.y),0.8,1.0+((uv_bipolar.y-uv2.x) * pi * 5.0),1.0)* -grid*500.0;
	gl_FragColor = mix(gl_FragColor, gl_FragColor.gbra, sin(time) * .5 + .5);
	gl_FragColor = clamp(gl_FragColor, -0.5, 1.5);
	gl_FragColor += 0.5 * sin(time * 0.01);
	gl_FragColor = (floor(mod(gl_FragCoord.y / resolution.y * (sin(time * 2.) + 2.) - 2. * time, 2.)) * 2. - 1.) * (gl_FragColor - 0.5) + 0.5;
	gl_FragColor.a = 1.0;
}