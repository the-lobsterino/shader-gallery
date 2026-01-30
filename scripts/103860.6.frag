#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265

float eyeMask(vec2 uv,vec2 p){
	float r = .5;
	return smoothstep(r,r-.01,length(p-uv*vec2(1.3,1.)));
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy )*2.-1.;
	uv.x *= resolution.x/resolution.y;

	vec3 c = vec3(0);
	
	c += mix(vec3(.8,0,1),vec3(.2,0,.4),uv.y);
	c *= eyeMask(uv,vec2(0,0));
	
	float r = max(mod(atan(uv.x,uv.y),PI/3.),mod(-atan(uv.x,uv.y),PI/3.))*.4+.01;
	
	//c += (sin(uv.x*50.)*sin(uv.y*50.))*(1.-smoothstep(r,r-.2,length(uv*vec2(1.3,1.)))*.5);
	
	c += smoothstep(r,r-.2,length(uv*vec2(1.3,1.)))*.5;
	c *= eyeMask(uv,vec2(0,0));
	
	gl_FragColor = vec4(c, 1.0 );

}