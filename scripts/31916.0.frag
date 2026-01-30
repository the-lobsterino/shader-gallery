// Smock
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float PI = 3.14159265358979323 ;// lol ya right, but hey, I memorized it

float fn(float t) {
	return mix( sin(t), cos(t*3.0*(sin(time*0.01))), sin(time*0.5) * 0.5 + 0.5 );
}

vec4 pixelAt(vec2 uv)
{
	vec4 result;
	float thickness = 0.05;
	float movementSpeed = -0.5;
	float wavesInFrame = 2.5;
	float waveHeight = 0.5;
	float point = (fn(time * movementSpeed + uv.x * wavesInFrame * 2.0 * cos(sin(time))*PI) * waveHeight );
	const float sharpness = 2.001;
	float dist = 1.0 - abs(clamp((point - uv.y) / thickness, -1.0, 1.0));
	float val;
	float brightness = 0.8;

	// All of the threads go the same way so this if is easy
	if (sharpness != 1.0)
		dist = pow(dist, sharpness);
	
	dist *= brightness;
		
	result = vec4(vec3(0.0, dist, 0.), 1.0);
	
	return result;
}

void main( void ) {

	vec2 fc = gl_FragCoord.xy;
	
	float yy = fc.y;
	
	yy += 1.0*(fc.x/resolution.x*0.5);
	yy *= sin(yy*PI*13.0); // fake scanlines
	
	fc.y = mix(fc.y,yy,sin(time));
	
	vec2 uv = fc / resolution - 0.5;
	vec4 pixel;
	
	pixel = vec4(0);//pixelAt(uv);
	
	const float e = 10.0, s = 2.0 / e;
	for (float i = 0.0; i < e; ++i) {
		pixel = max(pixel,pixelAt(uv + (uv * (i*s))) * (0.5-i*s*0.325));
	}
	pixel *= PI;
	
	gl_FragColor = pixel;
}