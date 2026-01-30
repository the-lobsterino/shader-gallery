#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rt(vec2 x,float y)
{
	return vec2(cos(y)*x.x-sin(y)*x.y,sin(y)*x.x+cos(y)*x.y);
}
void main( void ) {
	vec2 p = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.y;
	float l = 1.0 - length(p);
	float d = atan(p.y, p.x);
	float s = 0.5 + 0.5*sin((l+d)*16.0 + time);
	float col = s;
	gl_FragColor = vec4(vec3(rt(vec2(s,1.0),cos(time+l)).xxx), 1.0);
}