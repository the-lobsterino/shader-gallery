#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi=acos(-1.0);
const float pi2=pi*2.0;

mat2 rot(float a){
	float c=cos(a); float s=sin(a);
	return mat2(c, s, -s, c);
}

float spf(vec3 p, float r) {
	return length(p)-r;
}

float boxf(vec3 p, float s){
	p=abs(p)-s;
	return max(max(p.x, p.y), p.z);
	
}

vec2 pmod(vec2 p, float r){
	float a=atan(p.x, p.y)+pi/r;
	float n=pi2/r;
	a=floor(a/n)*n;
	return p*rot(-a);
}

float map(vec3 p){
	p=abs(p);
	p.xz=mod(pmod(p.xz-vec2(1.0), 10.0), 0.6);
	return mix(boxf(p, 0.5), spf(p, 1.0), 0.4*cos(time));
}

float lighting(vec3 n, vec3 v){
	float arg=dot(n, v);
	return arg;
}

void main( void ) {
	vec2 uv=(gl_FragCoord.xy*2.0-resolution.xy)/min(resolution.x,resolution.y);
	uv*=20.0*sin(0.25*time)*rot(0.25*time);
	float x=0.0; float y=0.0; float z=-1.0;
	vec3 rayorigin=vec3(x,y,z);
	float screenz=1.5;
	vec3 ray=normalize(vec3(uv, screenz));
	float d=0.0;
	vec3 col=vec3(0.0);
	const int repeat=99;
	for(int i=0; i<repeat; i++){
		vec3 pos=rayorigin+ray*d;
		pos.yz*=rot(pi/2.0);
		//pos.xz*=rot(time);
		float dis=map(pos);
		if(dis<0.00001){
			col=vec3(1.0-float(i)*0.02);
			break;
		}
		d+=dis;
	}
	gl_FragColor=vec4(col,1.0);
}