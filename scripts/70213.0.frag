#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec3 c=vec3(1,2,1);
	float l,z=time;
	
	for(int i=0;i<3;i++) {
		
		vec2 uv,p=gl_FragCoord.xy/resolution;
		uv=p;
		p-=.3;
		p.x*=resolution.x/resolution.y;
		z+=22.7;
		l=length(p*p);
		uv+=p/l*(sin(z)+1.1)*abs(sin(l*6.-z*3.5));
		c[i]=.11/length(abs(mod(uv,2.)-1.2));
	}
	gl_FragColor=vec4(c/l,time);

}