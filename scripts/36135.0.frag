#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float check(vec2 p, float size) 
{
	return mod(floor(p.x * size) + floor(p.y * size),3.0);
}

void main(void) 
{
	vec2 p = ((gl_FragCoord.xy / resolution) - 0.5) * 2.0;
	p.x *= resolution.x/resolution.y;	
	p /= dot(p, p);
	float t = cos(time + distance(p, vec2(0.))) * 0.5;
	p *= mat2(cos(t), -sin(t),
		  sin(t),  cos(t));
	gl_FragColor = vec4(check(p, 2.0) * (1.0 / length(p)) * 0.5);
}