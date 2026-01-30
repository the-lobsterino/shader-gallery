#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 format(vec2 uv)
{
	uv	= uv * 2. - 1.;	
	uv.x	*= resolution.x/resolution.y;
	return uv;
}

void main( void ) {

	vec2 uv	= gl_FragCoord.xy / resolution.xy;
	vec2 p	= format(uv);
	
	float l = length(p);
	
	float i = floor(l*24.)/24.;
	
	float a = atan(p.x, p.y)/(8.*atan(1.));
	
	

	a = fract(a+mouse.x);
	
	
	float f = floor(a*24.*mouse.y)/(24.*mouse.y);
	
	
	gl_FragColor = vec4(i/a);

}