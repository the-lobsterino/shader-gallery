#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    vec3 c;
    vec2 r = resolution;
    vec4 fragCoord = gl_FragCoord;
    float l,z=time;
    for(int i=0;i<3;i++) {
	vec2 uv,p=fragCoord.xy/r;
	uv=p;
	p-=.5;
	p.x*=r.x/r.y;
	z+=.07;
	l=length(p);
	uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z-z));
	c[i]=.01/length(mod(uv,6.)-.5);
    }
    gl_FragColor=vec4(c/l,time);

}