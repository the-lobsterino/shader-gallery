#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = gl_FragCoord.xy/resolution.xy;
	float aspect=resolution.x/resolution.y;
	uv.x=uv.x*aspect;
	vec2 p = vec2(0.5+sin(time)/10.0,0.5+cos(time)/4.0);
	float a= distance(p,uv);
	p = vec2(0.7+sin(time)/3.0,0.5+cos(time)/7.0);
	float b= distance(p,uv);
	p = vec2(0.6+cos(time)/2.33,0.4+sin(time)/6.67);
	float c= distance(p,uv);
		
	gl_FragColor = vec4(c*a*8., a*b*8., b*c*8., 1.0);
	
}