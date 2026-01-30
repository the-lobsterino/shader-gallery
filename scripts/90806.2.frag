#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



vec3 walk(vec3 ray, vec3 ro, vec3 rd, float grd) {
	return ray + grd*(rd-ro);
}

float distFunc(vec3 p, vec3 ray) {
	float r = .3;
	float ret = length(p) - r;
	return ret;
} 

float currentOZ(vec2 st) {
	return sqrt(st.x*st.x+st.y*st.y);
}

void main( void ) {


	vec2 st = ( gl_FragCoord.xy / resolution.xy*2.0-1.0 );
	st.x *= resolution.x/resolution.y;
	
	
	
	vec3 col = vec3(0.);
	
	float t = time;
	float sint = sin(t);
	float cost = cos(t);
	float sins = sin(st.x);
	float coss = cos(st.x);
	vec3 o = vec3(sins, coss, sin(st.y*012.1));
	o = vec3(st,currentOZ(st));
	
	vec3 ls = vec3(-0.713,0.79519,1.34750);
	ls.xy *= mat2(-sint,cost,cost,sint);
	
	bool shouldRender = true;
	
	float l = length(ls.xy-st);
	if( l < 0.1) {
		shouldRender = false;
		
	}
	
	const int limit = 100;
	const float grd = 0.051;
	
	const float disDetect = 0.1578;
	const float limitDisOther = .001;
	
	vec3 ray = vec3(.0,0.,1.);
	//ray.x += -1.721;
	vec3 rd = vec3(st,-1.);
	vec3 walked = walk(ray, ray,rd,grd);
	float disOrig = distFunc(o, ray);
	
	if(shouldRender){
		bool goToLight = false;
		vec3 on = o;
		for(int i=0;i<limit;i++){
			walked = walk(walked, ray, rd, grd);
			
			if(goToLight) {
				float zDis = distance(walked.z,o.z);
				float dis = distance(walked, ls);
				if(dis < disDetect) {
					col = vec3(1.);
				}
			} else {
				float dis = distance(walked, on);
				if(dis < disDetect) {
					col = vec3(.3);
					goToLight = true;
					rd = ls;
					ray = vec3(walked);
				}
			}
		}
	}
	else // testing purposes
	{
		col = vec3(1.) * disOrig;
	}
	
	
	gl_FragColor = vec4( col, 1.0 );

}