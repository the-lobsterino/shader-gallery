#ifdef GL_ES
precision mediump float;
#endif

// a bit more bouncy --joltz0r

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const vec2 pixelSize = vec2(8.0);
vec2 chunkyRes = resolution / pixelSize;

float PI = atan(-1.0) * 4.0;
float drawPixel(vec2 pos, float c)
{
	vec2 p = gl_FragCoord.xy;
	vec2 p0 = pos * pixelSize;
	vec2 p1 = p0 + pixelSize;
	//if (p.x >= p0.x && p.x < p1.x && p.y >= p0.y && p.y < p1.y)
	if (length(p-p0) < 2.0*length(pixelSize))
		return length(p-p0) / length(chunkyRes);
	return 0.0;
}

float tri(float t) {
	return (abs((mod(t/(4.*PI), 1.0) - 0.5) * 2.0) - 0.5) * 2.0;
}

void main( void ) {

	vec2 p = gl_FragCoord.xy;

	vec4 c = vec4(
		(p.y / resolution.y) * 0.5,
		(1.0 - p.y / resolution.y) * 0.25,
		(1.0 - p.x / resolution.x),
		1.0
	)/1.5;
	
	for (int i=0; i<128; i++)
	{
		float t = float(i)*0.1 + 0.5*time;
		vec2 pos = (vec2(tri(PI*t + cos(float(i))), tri(2.0*t+tri(float(i)+t))) * chunkyRes/2.5) + chunkyRes / 2.0;
		c += vec4(
			drawPixel(pos, sin(float(i))),
			drawPixel(pos, sin(1.5*float(i))),
			drawPixel(pos, sin(2.0*float(i))),
			1.0
		);
	}
	
	c += texture2D(backbuffer, gl_FragCoord.xy / resolution)/1.5;
	gl_FragColor = c;

}