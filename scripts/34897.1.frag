#ifdef GL_ES
precision mediump float;
#endif

#define Scale 100.0
#define Move vec2(-50.0, 0.0)
#define Color1 vec4(0.9, 0.9, 1.0 ,1.0)
#define Color2 vec4(0.5, 0.5, 0.5 ,1.0)


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle( vec2 p, float r )
{
	return length(p)-r;
}

float box(vec2 p, vec2 b)
{
	vec2 d = abs(p) - b;
	return min(max(d.x, d.y),0.0) + length(max(d, 0.0));
}

void main( void )
{
	vec2 p = gl_FragCoord.xy - resolution / 2.0;
//	float d = circle(p, 100.0);
	float d = box(p, vec2(100.0, 50.0));
	float c = d>0.0 ? 0.0 : 1.0;
	gl_FragColor = vec4(c, c, c, 1.0);// + Color2*vec4(1.0-c);
}
