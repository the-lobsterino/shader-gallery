#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//Code-golfing incoming
float circle(vec2 center, float r, vec2 uv)
{
	return step(distance(center, uv), r);	
}
void main( void ) {
	vec2 uv=gl_FragCoord.xy/resolution*2.0-1.0;
	uv.x*=resolution.x/resolution.y;
	/*
	float c=0.;
	c += circle(vec2(1.0, 1.0), 1.0, uv);
	c += circle(vec2(-1.0, 1.0), 1.0, uv);
	c += circle(vec2(-1.0, -1.0), 1.0, uv);
	c += circle(vec2(1.0, -1.0), 1.0, uv);
	c += step(1.0, abs(uv.y));
	c += step(1.0, abs(uv.x));
	*/
	float c = float(length(pow(uv,vec2(.2815)))>1.);
	gl_FragColor = vec4(c);
}