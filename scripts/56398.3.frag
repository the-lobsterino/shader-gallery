#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
#define MAX 100.
#define EPSILON 0.0001

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 setDir(vec2 coord, float f){return normalize(vec3(coord,-f));}

float sphereSDF(vec3 ray,vec3 loc, float r){ return distance(ray,loc)-r; }
float SDF(vec3 ray){return sphereSDF(ray, vec3(0.), 1.);}

float rayMarch (vec3 cam, vec3 dir){
	float minDist =0.;
	vec3 ray;
    
    	for(int i=0; i<100; i++){
        	ray = cam+ dir*minDist;
        	float dist = SDF(ray);
        
       		if (dist < EPSILON){
           		return minDist;
       		 }
		
     		minDist += dist;
       		 if (minDist >MAX) return MAX;
    }
    return MAX;
}

vec3 getNormal(vec3 p){
	vec3 v;
	v.x = SDF(p+vec3(EPSILON,0.,0.))-SDF(p-vec3(EPSILON,0.,0.));
	v.y = SDF(p+vec3(0.,EPSILON,0.))-SDF(p-vec3(0.,EPSILON,0.));
	v.z = SDF(p+vec3(0.,0.,EPSILON))-SDF(p-vec3(0.,0.,EPSILON));
	return normalize(v);
}

vec3 lightCal(vec3 d,vec3 s, float alpha, vec3 p, vec3 cam, vec3 light){
	vec3 n = getNormal(p);
	vec3 c = normalize(cam -p);
	vec3 l = normalize(light-p);
	vec3 r = normalize(reflect(-l,n));
	
	float dAngle = dot(n,l);
	float sAngle = dot(c,r);
	
	if(dAngle<0.){
		return vec3(0.);
	}
	if(sAngle<0.){
		return d *dAngle;
	}
	
	return d*dAngle+s*pow(sAngle,alpha);
}
vec3 lights(vec3 a,vec3 d ,vec3 s, float alpha, vec3 p, vec3 cam){
	vec3 color = a * .5;
	
	vec3 ll = vec3(sin(time)*3., 0., cos(time)*3.);
	color += lightCal(d,s,alpha,p,cam,ll);
	
	return color;
}
void main( void ) {
    vec2 coord = gl_FragCoord.xy/resolution;
    coord -= .5;
    coord *= 2.;
    coord.x *= resolution.x/resolution.y;
    
    vec3 cam = vec3(0., 0., 3.);
    vec3 dir = setDir(coord, 1.);
    
    float minDist = rayMarch(cam, dir);
	
	if(minDist >MAX-EPSILON){
    	gl_FragColor = vec4(vec3(1.),1.);
    return;
}
	 vec3 p = cam+dir*minDist;
    vec3 a = vec3(0.);
    vec3 d = vec3(1.,0.2,1.);
	//이게 RGB
    vec3 s = vec3(1.);
    float alpha = 100.;
    
    vec3 color = lights(a,d,s,alpha,p,cam);
    gl_FragColor = vec4(color,1.); 
}