// complex sin(1/z-t) iterated 10 times

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
float t = 0.1*time;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 complex_sq(vec2 z) {
	return vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y);
}
vec2 complex_qu(vec2 z) {
	return complex_sq(complex_sq(z));
}
void main(void)
{
	vec2 c = surfacePosition;//(gl_FragCoord.xy-resolution/2.0) / min(resolution.x, resolution.y);
	
	float r = length(c);
	float th = atan(c.x, c.y);
	c = 1e-1*vec2(sin(th), cos(th))*pow(r, -0.9);
	
	c *= 2.5;
	//c.x -= 0.5;
	
	vec2 z = c;
	int it2 = 0;
	for(int it = 0; it < 60; it++) {
		z = complex_qu(z) + c;
		if(length(z) > 2.0) break;
		it2 = it;
	}
	
	float h = atan(z.y, z.x)/3.141592/2.0 + t*0.4;
	gl_FragColor = 1.-vec4(hsv2rgb(vec3(h, (length(z)-2.0)*0.6, 1.0-float(it2)/60.0)), 1.0);
}