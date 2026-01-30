// the interior of the julia set

// bicubic_copypasta because i like this
// ...hsv cycling & white 'exciter'

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
varying vec2 surfacePosition;

#define ITER 64

vec3 hsv(float h,float s,float v) {
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

float MNweights(float x)
{
	float a = abs(x);
	return step(a,2.)*((step(a,1.0000001)*((3.*a-6.)*a*a+4.)/6.)
			   +(step(1.0000001,a)*(((6.-a)*a-12.)*a+8.)/6.));
}

vec4 texture2D_bicubic(sampler2D tex, vec2 uv)
{
	vec2 ps = 1./resolution;
	vec2 uva = uv-ps*.5;
	vec2 f = fract(uva*resolution);
	vec2 texel = uv-f*ps;
	vec4 result = vec4(0);
	for (float r = -1.; r < 3.; ++r)
	{
		vec4 tmp = vec4(0);
		for (float t = -1.; t < 3.; ++t)
			tmp += texture2D(tex, texel+vec2(t,r)*ps)
				* MNweights(abs(t)-sign(t+.5)*f.x);
		result += tmp   * MNweights(abs(r)-sign(r+.5)*f.y);
	}
	return result;
}

void main( void ) {
	const float ITER_F = float(ITER);
	vec2 scrpos = gl_FragCoord.xy / resolution.xy;
	vec2 p = surfacePosition*3.0;
	float a = time*0.3;
	vec2 z = p;
	vec2 c = mouse*2.0-1.0;
	vec2 o = vec2(sin(time), cos(time))*0.1+0.5;
	vec2 zp = vec2(1);
	float iter = 0.0;
	float m2;
	
	for (int i = 0; i < ITER; i++) {
		zp = 2.0*vec2(z.x*zp.x - z.y*zp.y, z.x*zp.y + z.y*zp.x);
		z = vec2(2.0*z.x*z.y, z.y*z.y - z.x*z.x) + c;
		m2 = dot(z, z);
		
		if (m2 > 1000.0) {
			break;
		}
		iter++;
	}
	if (iter > ITER_F-1.0) {
		vec2 p = (scrpos-o)*1.005+o;
		vec4 last = texture2D_bicubic(backbuffer, p);
		float v = last.a + 0.01;
		gl_FragColor = vec4(hsv(v+time*0.05, 0.95, length(last.rgb)*0.89), fract(v));	
	} else if (iter < 24.0) {
		vec2 p = (scrpos-o)*0.995+o;
		vec4 last = texture2D_bicubic(backbuffer, p);
		float v = last.a - 0.01;
		gl_FragColor = vec4(hsv(v+time*0.05, 0.95, length(last.rgb)*0.89), fract(v));	
	} else {
		float c = sqrt(m2/dot(zp, zp))*0.1*log(m2);
		gl_FragColor = vec4(1.0);

	}

}
