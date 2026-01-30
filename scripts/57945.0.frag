#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

bool ORTHO = false;
bool MOUSEROT = true;

float FAC1 = 0.5*(1.0+sin(1.0*time));
float FAC2 = 0.5*(1.0+sin(1.5*time));
float EPSILON = 0.001;

const int NSTEPS = 1000;
const float DMIN = 0.001;
const float LMAX = 1000.0;

vec3 COL1 = vec3(.0,-1.0,.0);
vec3 COL2 = vec3(.0,1.0,0.0);
vec3 COL3 = vec3(0.0,0.0,0.60);

vec3 DIR;

vec3 CENTER = vec3(0.0,.0,.0);
float RADIUS = 0.2;

struct traceRes{
	int n;
	float l;
	int obj;
	vec3 pos;
	float dMin;
};
struct hitRes{
	int obj;
	float d;
};

mat3 RotMat(float phi1, float phi2){
	mat3 m1 = mat3(cos(phi1),0.0,sin(phi1),0.0,1.0,0.0,-sin(phi1),0.0,cos(phi1));
	mat3 m2 = mat3(1.0,0.0,0.0,0.0,cos(phi2),-sin(phi2),0.0,sin(phi2),cos(phi2));
	return m1*m2;
}
hitRes DE(vec3 pos){
	float pmaxX = 7.0*RADIUS;
	float pminX = 3.0*RADIUS;
	float pmaxZ = 3.5*RADIUS;
	float pminZ = 12.0*RADIUS;
	float pX = pminX+(pmaxX-pminX)*FAC1;
	float pZ = pminZ+(pmaxZ-pminZ)*FAC2;
	vec3 c = vec3(pX,pX,pZ);
	vec3 l = mod(pos+0.5*c,c)-0.5*c;;
	float d1 = length(l-CENTER)-RADIUS;
	float d0 = dot(pos,-DIR)-1.1*RADIUS;
	return hitRes(1,max(d1,d0));
}
vec3 norm(vec3 pos){
	float d0 = DE(pos).d;
	float dx = DE(pos+vec3(EPSILON,0.0,0.0)).d;
	float dy = DE(pos+vec3(0.0,EPSILON,0.0)).d;
	float dz = DE(pos+vec3(0.0,0.0,EPSILON)).d;
	return normalize(vec3(dx-d0,dy-d0,dz-d0));
}
traceRes trace(vec3 pos,vec3 dir){
	float l = 0.0;
	int N;
	float  d = 0.0;
	int obj = 0;
	float dMin = LMAX;
	for (int n=0; n<NSTEPS; n++){
		N = n;
		hitRes hit = DE(pos);
		hit.d=max(hit.d,-1000.0);
		pos += hit.d*dir;
		l += hit.d;
		if (hit.d<dMin) dMin = hit.d;
		if (hit.d<DMIN) {
			obj = hit.obj;
			break;
		}
		else if (l>LMAX)
			break;
	}
	return traceRes(N,l,obj,pos,dMin);
}

void main( void ) {

	float phix = mouse.x*3.14;
	float phiz = mouse.y*3.14;
	if (MOUSEROT==false){
		phix = 0.0;
		phiz = 0.0;
	}
	mat3 rotmat = RotMat(phix,phiz);
	
	vec3 pos = rotmat*vec3(( gl_FragCoord.xy*2.0 -resolution.xy)/ resolution.x,0.0);
	vec3 cam;
	if (ORTHO){
		DIR = rotmat*vec3(0.0,0.0,-1.0);
		cam = pos-DIR;
	
	}
	else{
		cam = rotmat*vec3(0.0,0.0,1.0);
		DIR = normalize(pos-cam);
	}
	
	traceRes res = trace(cam,DIR);
	
	vec3 col = vec3(0.0);
	if (res.obj>0 ){
		vec3 n = norm(res.pos);
		vec3 col1 = COL1*max(0.0,dot(-DIR,n));
		vec3 col2 = COL2*(5.0/res.l);
		vec3 col3 = COL3*dot(n,vec3(1.0,1.0,1.0));
		col = col1+(1.0-0.4*FAC1)*col2+(.4+0.6*FAC1)*0.5*col3;
	}
	else
		col = vec3(0.0);

	gl_FragColor = vec4(col,1.0 );

}