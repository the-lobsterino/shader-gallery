#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float distFunc(vec3 p){
	vec3 q=mod(p+vec3(0,0,mod(-time*19.,4.)),4.)-2.;
	float ox=length(max(abs(q)-vec3(.5,.02,.02),0.));
	float oy=length(max(abs(q)-vec3(.02,.5,.02),0.));
	float oz=length(max(abs(q)-vec3(.02,.02,.5),0.));
	return min(ox,min(oy,oz));
}

vec3 getNormal(vec3 p){
	float d=0.0001;
	return normalize(vec3(
		distFunc(p+vec3(  d, 0.0, 0.0))-distFunc(p+vec3( -d, 0.0, 0.0)),
		distFunc(p+vec3(0.0,   d, 0.0))-distFunc(p+vec3(0.0,  -d, 0.0)),
		distFunc(p+vec3(0.0, 0.0,   d))-distFunc(p+vec3(0.0, 0.0,  -d))
	));
}

void main(){
	vec2 p=(gl_FragCoord.xy*2.-resolution)/resolution.x;
	vec3 camP=vec3(0.,0.,1.);
	vec3 camC=vec3(sin(time*.7)*.3,0.,0.);
	vec3 camU=normalize(vec3(sin(time)*.1,1.,0.));
	vec3 camS=cross(normalize(camC-camP),camU);
	vec3 ray=normalize(camS*p.x+camU*p.y+(camC-camP));
	
	float dist=0.;
	float rayL=0.;
	vec3  rayP=camP;
	for(int i=0;i<72;i++){
		dist=distFunc(rayP);
		rayL+=dist;
		rayP=camP+ray*rayL;
	}
	
	if(abs(dist)<0.001){
		float fragR=dot(-ray,getNormal(rayP));
		float fragG=0.;
		float fragB=dot(normalize(vec3(mouse.x-.5,mouse.y-.5,1.)),getNormal(rayP));
		gl_FragColor=vec4(vec3(fragR,fragG,fragB)*10./rayL,1.);
	}else{
		gl_FragColor=vec4(vec3(0.0), 1.0);
	}
}