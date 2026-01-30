//Julia Set
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

vec2 pixelToPos(vec2 pos) {
	return (pos - resolution / 2.0) / min(resolution.x, resolution.y) * 2.0;
}

void main( void ) {
	vec2 c = pixelToPos(mouse*resolution);
	vec2 z = pixelToPos(gl_FragCoord.xy);
	vec3 color = vec3(0,0,0);
	for(int i=0; i<maxIter; i++) {
		float zx = z.x;
		z.x = z.x*z.x - z.y*z.y + c.x;
		z.y = 2.0*zx*z.y + c.y;
		if (dot(z,z) >= 4.) {
			float smooth = float(i) + 1.0 - log(log(sqrt(dot(z,z)))) / log(2.0);
			color = hsv2rgb(vec3(smooth / float(maxIter), 0.85, 1.0));
			break;
		}
	}	
	gl_FragColor = vec4(color, 1);
}