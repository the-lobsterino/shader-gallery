//Mandelbrot Set
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;
const int maxIter = 150;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
	vec2 p = ((( gl_FragCoord.xy / resolution.xy ) ) - vec2(0.29,0) - (mouse - vec2(0.5,0.5)));
	p.x *= resolution.x  / resolution.y;
	vec3 c = vec3(2.*(p.x-0.5),2.*(p.y-0.5),0);
	vec2 z = vec2(0,0);
	vec3 color = vec3(0,0,0);
	for(int i=0; i<maxIter; i++) {
		float zx = z.x;
		z.x = z.x*z.x - z.y*z.y + c.x;
		z.y = 2.*zx*z.y + c.y;
		if (dot(z,z) >= 4.) {
			float smooth = float(i) + 1. - log(log(sqrt(dot(z,z)))) / log(2.);
			color = hsv2rgb(vec3(smooth / float(maxIter), 0.85, 1.0));
			break;
		}
	}	
	gl_FragColor = vec4(color, 1);
}