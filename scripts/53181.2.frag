#ifdef GL_ES
precision mediump float;
#endif

// Improved Julia set shader - by Graham Scheaffer

uniform float time;
uniform vec2 resolution;

const vec4 K = vec4(1.0, 2./3., 1./3., 3.0);
const int MAX_I = 100;


void main() {

	vec2 p = (gl_FragCoord.xy - resolution / 2.) / resolution.y * 3.;
	vec2 z = p;

	float t = time / 19.;
	vec2 c = (0.7885 + 0.1 * sin(time / 23.)) * vec2(cos(t), sin(t));
	
	float n = 0.;
	for(int i = 0; i < MAX_I; i++){
		if(dot(z,z) > 4.) break;
		
		z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
		n++;
	}
	
	float o = min(1., pow((n - log2(log2(dot(z,z))) + 4.) / float(MAX_I), 0.5) / 1.25);
	
	vec3 color = vec3((time + p.x)/ 29., 1., o);
	
	gl_FragColor = vec4( color.z * mix(K.xxx, clamp(abs(fract(color.xxx + K.xyz) * 6.0 - K.www) - K.xxx, 0.0, 1.0), color.y), 1.0 );

}
