// clit
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float PI = 3.14159;

vec4 pixelAt(vec2 uv,float z)
{
	vec4 result;
	float thickness = 0.08;
	float movementSpeed = 0.4;
	float wavesInFrame = 3.6;
	float waveHeight = 0.5;
	float point = (sin(time * movementSpeed + 
			   uv.x * wavesInFrame * 2.0 * PI) *
		       waveHeight*z);
	const float sharpness = 1.40;
	float dist = 1.0 - abs(clamp((point - uv.y) / thickness, -1.0, 1.0));
	float val;
	float brightness = 0.8;
	if (sharpness != 1.0)
		dist = pow(dist, sharpness);
	
	dist *= brightness;
		
	result = vec4(vec3(0.3, 0.6, 0.3) * dist, 1.0);
	
	return result;
}

void main( void ) {

	vec2 fc = gl_FragCoord.xy;
	vec2 uv 	= fc / resolution - 0.5;
	vec4 pixel;
	
	uv.x = dot(uv,uv);
	
	pixel = pixelAt(uv,0.);
	
	const float e = 64.0, s = 1.0 / e;
	for (float i = 0.0; i < e; ++i) {
		pixel += pixelAt(uv + (uv * (i*s)),sin(i*0.1)) * (0.3-i*s*0.325);
	}
	pixel /= 1.0;
	
	gl_FragColor = pixel;
}