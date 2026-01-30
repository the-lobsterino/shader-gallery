#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//poorly created by umu;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = (gl_FragCoord.xy / resolution.xy );
	uv = uv * 2. - 1.;
	uv.x *= resolution.x / resolution.y;
	
	vec2 xy = vec2(0.);
	xy.x += sqrt(2.+sqrt(8.)*uv.x+uv.x*uv.x-uv.y*uv.y);
	xy.x -= sqrt(2.-sqrt(8.)*uv.x+uv.x*uv.x-uv.y*uv.y);
	xy.y += sqrt(2.+sqrt(8.)*uv.y+uv.y*uv.y-uv.x*uv.x);
	xy.y -= sqrt(2.-sqrt(8.)*uv.y+uv.y*uv.y-uv.x*uv.x);
	//xy=uv;
	float time = time;
	if(mouse.x > gl_FragCoord.x/resolution.x) time -= mod(time, 1./24.);
	
	float cr = sin(xy.x-sign(mouse.x-.5)*time*119.95*3.14159*2.);
	float cb = 1.;
	float cg = cr;
	gl_FragColor = vec4(cr,cg,cb,1.);

}