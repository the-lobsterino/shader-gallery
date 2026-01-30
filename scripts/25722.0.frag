#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
#define iter 50

vec3 hsv2rgb(vec3 c) 
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(void) {
	vec2 uv = (2.*gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
	
	vec2 c = 1.2*vec2(-0.75 + uv.x, uv.y);
	vec2 z = c;
	for(int i = 0; i < iter; i++) {
		float x = (z.x*z.x - z.y*z.y) + c.x;
		float y = (z.y*z.x * 2.) + c.y;
		    
		float zn = x*x + y*y;
		if(zn > 4.0) {
			float smoothcolor = log(0.5*(float(i) - zn)) / 8.;
			gl_FragColor = vec4(hsv2rgb(vec3(smoothcolor, 1., 1.)), 1.);
			return;
		}
		z = vec2(x, y);
	}
	gl_FragColor = vec4(0., 0., 0., 1.);
}