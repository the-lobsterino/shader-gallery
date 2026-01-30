// basic raymarching algorithm for sphere

#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define MAX_STEPS 100
#define sphereCenter vec3(0.0, 0.0, 1.0)


float Dis(vec3 p){
	float d = 0.0;
	//vec3 sphereCenter = vec3(0.0, 0.0, 1.0);
	float radius = .3;
	
	d = distance(p, sphereCenter) - radius;
	
	
	return d;

}


bool RayMarch(vec3 ro, vec3 rd, out float n){
	bool hit = false;
	n = 0.0;
	float d = 0.0;
	vec3 px ;
	for(int i = 0; i < MAX_STEPS; i++){
		px = ro + d * rd;
		float s = Dis(px);
		d += s;
		if(s < 0.01){
			n = dot(normalize(ro-px), 
				normalize(px-sphereCenter)) ;
			return true;
		}
		if(s > 4.0){
			return false;
		}
		
		
	}
	
	return hit;

}




void main( void ) {
	
	vec2 uv2 = 2. * gl_FragCoord.xy / resolution.xy - 1.;
	vec2 uv = uv2 * resolution.xy / max(resolution.x, resolution.y);

	
	
	
        vec4 color = vec4(0.0);
	
	//if(uv.x>0.0) color = vec4(1.0, 0.0,0.0, 1.0);
	
	vec3 cameraPosition = vec3(0.0, 0.0, -1.0);
	vec3 direction = normalize(vec3(uv, .0) - cameraPosition);
	float n;
	bool x = RayMarch(cameraPosition, direction, n);
	
	if(x){
		color = vec4(n, 0.0, 0.0, 1.0);
	}else{
		color = vec4(0.1);
	}
	//color = vec4(x);
	
	
	
	
	gl_FragColor = color;

}