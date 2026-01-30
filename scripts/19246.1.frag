#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float hash(float p)
{	
	return fract(sin(p) * 45768.23); 
}

float hash(vec2 p)
{	
	return fract(sin(10.27 * p.x + 35.8* p.y) * 45768.23); 
}

vec2 hash2(vec2 p)
{
	mat2 m = mat2(15.27, 35.8, 75.45, 152.5);
	return fract(sin(m * p) * 45768.23);
}

//value noise
float noise(vec2 p)
{
	vec2 g = floor(p);
	vec2 f = fract(p);
	
	float lb = hash(g + vec2(0.0, 0.0));
	float rb = hash(g + vec2(1.0, 0.0));
	float lt = hash(g + vec2(0.0, 1.0));
	float rt = hash(g + vec2(1.0, 1.0));
	
	float b = mix(lb, rb, f.x);
	float t = mix(lt , rt, f.x);
	
	float res = mix(b, t, f.y);
	
	return res;
}

float fbm(vec2 p) {
	float r = 0.0;
	r += noise(p) / 2.0;
	r += noise(p * 2.0) / 4.0;
	r += noise(p * 4.0) / 8.0;
	r += noise(p * 8.0) / 16.0;
	return r;
}
	
void main( void ) {
	vec2 p = gl_FragCoord.xy / resolution;
	
	float np = fbm((p * 10.0));
	float c = np;
	
	gl_FragColor = vec4(c, c, c, 1.0);	
}
