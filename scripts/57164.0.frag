#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere(vec3 p,float size){
	return length(p)-size;
}

float sdBox(vec3 p, float s){
p = abs(p) -s;
	return max(max(p.x, p.y), p.z);
}

mat2 rot(float theta){
float s = sin(theta),c = cos(theta);
	return mat2 (c,s,-s,c);
}

float map(vec3 p){
	
	vec3 pp = p;
	vec3 ppp = p;
	
	p=mod(p,3.)-1.5;
	p.xz *= rot(time);
	pp.z = mod(pp.z, 6.0) - 3.0;
	float d1= sdBox(p,1.0);	
	float d2 = sdBox(pp,3.);
	
	float d3 = sphere(ppp - vec3(sin(time*0.6),cos(time*0.2),sin(time*0.3)+time*3.0),1.0);
	
	return min(max(d1,-d2),d3);
}
void main( void ) {
	vec2 uv=(gl_FragCoord.xy*2.0-resolution.xy)/min(resolution.x,resolution.y);
	vec3 ro=vec3(.0,.0,-4.+time*3.);
	float screenZ=1.0;
	vec3 rd=normalize(vec3(uv,screenZ));
	rd.xy *= rot(sin(time)*0.2);
	rd.xz *= rot(cos(time)*0.2);
	
	vec3 col =vec3(1.0);
	float depth =0.0;
	vec3 rPos=ro;
	
	for(int i=0;i<300;i++){
		float d=map(rPos);
		if(d<0.00001){
			col=vec3(float(i)/99.*vec3(.8,.6,.2));
			break;
		}
		depth+=d;
		rPos=ro+rd*depth;
		
	}
	
	gl_FragColor = vec4(  vec3(col)  , 1.0 );

}