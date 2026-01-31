#ifdef GL_ES
precision mediump float;
#endif


#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float FTIME1 = 0.5+0.0*sin(time);
float FTIME2 = 1.0+0.0*cos(1.9*time);

const int NSTEPS = 400;
const float DMIN = 0.01;
const float LMAX = 200.0;
const float EPSILON = 0.001;

vec4 GEO = vec4(2.5,2.8,1.5,0.1);

struct nextobj{
	float d;
	int obj;
};
struct ray{
	int obj;
	float l;
	vec3 pos;
	vec3 dir;
	float dMin;
};

mat3 rot(float l){
	float phi1 = FTIME1*l/100.0;
	float phi2 = FTIME2 * l/100.0;
	return mat3(cos(phi1),sin(phi1),0.0,-sin(phi1),cos(phi1),0.0,0.0,0.0,1.0)*
		mat3(1.0,0.0,0.0,0.0,cos(phi2),sin(phi2),0.0,-sin(phi2),cos(phi2));
}
nextobj DE(vec3 pos){
	pos.y = mod(pos.y+1.0*time,GEO.y);
	pos.x = abs(pos.x);
	float dS = length(pos.xy-GEO.xy)-GEO.a;
	float dU = max(GEO.z-pos.z,abs(pos.x)-GEO.x-GEO.a);
	float dO = max(GEO.z+pos.z,abs(pos.x)-GEO.x-GEO.a);
	if (dS<min(dU,dO))
		return nextobj(dS,1);
	else if(dU<dO)
		return nextobj(dU,2);
	else
		return nextobj(dO,3);

}
vec3 norm(vec3 pos){
	float d0 = DE(pos).d;
	float dx = DE(pos+vec3(EPSILON,0.0,0.0)).d;
	float dy = DE(pos+vec3(0.0,EPSILON,0.0)).d;
	float dz = DE(pos+vec3(0.0,0.0,EPSILON)).d;
	return normalize(vec3(dx-d0,dy-d0,dz-d0));
}

ray trace(vec3 pos, vec3 dir){
	float dMin = LMAX;
	float l = 0.0;
	int hit = 0;
	for (int n = 0; n<NSTEPS; n++){
		nextobj o = DE(pos);
		float d = o.d*0.7;
		l+=d;
		pos+=d*rot(l)*dir;
		if (o.d<DMIN){
			hit = o.obj;
			break;
		}
		if (l>LMAX) break;
		if (o.d<dMin) dMin= o.d;
	}
	return ray(hit,l,pos,dir,dMin);
}
		


void main( void ) {

	vec3 pos = vec3(( 2.0*gl_FragCoord.xy -resolution.xy)/ resolution.x,0.0).xzy ;
	vec3 cam = vec3(0.0,-1.0,0.0);
	vec3 dir = normalize(pos-cam);
	
	ray r = trace(cam, dir);
	
	vec3 col = vec3(0.0);
	if (r.obj==1){
		vec3 n = norm(r.pos);
		float cn = dot(-n,dir);
		col.g=1.0-cn;
		
	}
	else if (r.obj>1){
		float d = r.l/(r.l+3.0);
		col.r+=0.5*(1.0-d);
	}

	gl_FragColor = vec4( col, 1.0 );

}