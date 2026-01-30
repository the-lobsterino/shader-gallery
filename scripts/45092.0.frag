#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define EPS 0.04
#define MAXDIST 80.0

float box(vec3 p, vec3 b){return max(max(abs(p.x)-b.x,abs(p.y)-b.y),abs(p.z)-b.z);}

float cube8(vec3 p, float r, float t){
	return box(vec3(abs(p.x)-r+t,abs(p.y)-r+t, abs(p.z)+t-r), vec3(t));
}
vec2 rot(vec2 p, float a){float sa=sin(a); float ca=cos(a);return p*mat2(ca, sa, -sa, ca);}
float copy(float p, float d){return mod(p, d)-d/2.0;}
float map(vec3 p){
	p.xy = rot(p.xy, time/7.);
	p.xz = rot(p.xz, time/11.);
	p.x += time*2.;
	float r= 0.5+sin(time)*0.3;
	p.x = copy(p.x, 4.0);
	p.z = copy(p.z, 4.0);
	p.y = copy(p.y, 4.0);
	p.xz = rot(p.xz, time*abs(floor(p.y/2.+0.5))+time*0.5);
	return min(min(cube8(vec3(p.x, p.y-2.0, p.z), r, 0.1), cube8(vec3(p.x, p.y+2.0, p.z), r, 0.1)), cube8(vec3(p.x, p.y, p.z), r, 0.1));
}
void main( void ) {

	vec2 uv = vec2( gl_FragCoord.x/resolution.x*2.0-1.0, gl_FragCoord.y/resolution.x*2.0-resolution.y/resolution.x);
	vec3 ro = vec3(0.,0., 0.0); vec3 rd = normalize(vec3(uv.x, uv.y, 1.0));
	vec3 mp = ro; vec3 md = rd;
	for (int i = 0; i < 40; i++)
	{
		float dist = map(mp);
		mp += rd*dist;
		if(dist<EPS||dist>MAXDIST){break;}
	}
	vec3 c = vec3(length(mp)/MAXDIST);
	gl_FragColor = vec4( c, 1.0 );

}