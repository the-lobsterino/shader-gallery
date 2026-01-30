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
	vec2 k = vec2(0.5+sin(time)/3.0,0.5+cos(time)/7.0);
	float z= distance(p,uv)+distance(k,uv);
		
	gl_FragColor = vec4(step( z,.25),.0,.0, 1.0);
	

}