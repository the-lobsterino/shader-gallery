#ifdef GL_ES
precision mediump float;
#endif

// The Epsilon Team


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float aaThres = 0.001;

float rectangle(vec2 TL, vec2 BR, vec2 pos)
{
	float c = 0.0;
	if (pos.x >= TL.x && pos.x <= BR.x && pos.y >= BR.y && pos.y <= TL.y) c = 1.0;
	return c;
}

float ring(float r1, float r2, vec2 pos)
{
	float c = 0.0;
	float l = length(pos);
	if (l >= r1 + aaThres && l <= r2 - aaThres)
		c = 1.0;
	else if (l >= r1 && l < r1 + aaThres)
		c = 1.0 - (r1 + aaThres - l) / aaThres;
	else if (l <= r2 && l > r2 - aaThres)
		c = 1.0 - (l - (r2 - aaThres)) / aaThres;
	return c;
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.x ) - vec2(0.5, 0.5 * (resolution.y / resolution.x));

	float c;
	
	c = rectangle(vec2(-0.2, 0.01), vec2(0.2, -0.01), pos);
	c += rectangle(vec2(-0.01, 0.2), vec2(0.01, -0.2), pos);
	
	c += ring(0.15, 0.17, pos + vec2(0.2, 0.0));
	c += ring(0.15, 0.17, pos - vec2(0.2, 0.0));
	
	if (abs(pos.x) >= 0.2) c = 0.0;
	

	gl_FragColor = vec4(vec3(c), 1.0 );

}