#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//haxky and incomplete - have a better idea what to do now...

mat2 rmat(float t)
{
	float c = cos(t)+sin(time);
	float s = sin(t)*cos(time);
	return mat2(c, s, -s, c);
}

void main( void ) {

	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	vec2 aspect 	= resolution/min(resolution.x, resolution.y);

	float scale 	= 8.;
	vec2 position	= (uv-.5)*aspect;
	position	= position * scale;
	

	bool x		= mod(floor(position.x), 2.)== 0.;
	bool y		= mod(floor(position.y), 2.)== 0.;
		
	vec2 offset	= x ? vec2(1., .0) : vec2(.0, 1.);
	
	vec2 p		= fract(position)-.5;
	p		= x^^y ? p : p.yx;
	

	mat2 rm		= rmat(1.);
	p 		*= rm;	
 	p 		= abs(fract(p) - offset)-.5;
	p 		= abs(p);
	p		= x ? p.yx : p;
	p		= vec2(max(p.x, p.y), min(p.x, p.y));
	
	
	
//	float width 	= .02;
	//float edges	= float(p.x<width)+float(p.y<width);
	
	gl_FragColor 	= vec4(p*2., 0., 1.);
}