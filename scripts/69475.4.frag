#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;


float PI = 3.141592653;

mat2 rot(float r){
	return mat2(cos(r),sin(r),-sin(r),cos(r));
}

vec2 pmod(vec2 p,float n){
	float np = PI*2.0/n;
	float r = atan(p.x,p.y)-0.5*np;
	r = mod(r,np)-0.5*np;
	return length(p)*vec2(cos(r),sin(r));
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	vec2 uv = p;
	
	p = (p-0.5)*2.;
	
	p.x *= resolution.x/resolution.y;
	
	vec3 col = vec3(0.);

	vec2 sp = p;
	
	p *= 1.2;
	
	p *= rot(0.2*time);
	
	p = pmod(p,3.0+mod(floor(time*0.7),4.0));	
	
	for (int i = 0; i<3;i++){
		p = abs(p)-0.5;
		p *= rot(time*0.2+min(p.x,1.));
	
	}
	
	p.x -= 0.3 + 0.2* time;
	
	float kx = 0.5;
	
	p.x = mod(p.x,kx)-0.5*kx;
	
	float ins = 0.028*pow(abs(sin(time*6.)),12.)+0.0002;
	
	float c0 = ins/abs(p.x);
	
	col += c0*vec3(0.3,0.5,0.8);
	
	p.x += kx/3.;
	
	c0 = ins/abs(p.x);
	
	col += c0*vec3(0.7,0.7,0.7);
	
	p.x -= 2.0*kx/3.;
	
	c0 = ins/abs(p.x);
	
	col += c0*vec3(0.3,0.8,0.5);
	
	vec3 bcol = texture2D(backbuffer,uv).xyz;
	
	col *= 1.3*vec3(0.3,0.5,0.9);
	
	col = pow(col,vec3(0.9));
	
	col = mix(bcol,col,0.1);
	
	gl_FragColor = vec4( col, 1.0 );

}