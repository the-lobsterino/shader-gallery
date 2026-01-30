 #ifdef GL_ES
 precision mediump float;
 #endif
 
 #extension GL_OES_standard_derivatives : enable
 
 uniform float time;
 uniform vec2 mouse;
 uniform vec2 resolution;
 
 float pi = 3.1415926535;
 
 mat2 rot(float p){
 	float c = sin(p);
 	float s = cos(p);
 	return mat2(c, -s, s, c);
 }
 
 
 vec3 light = vec3(0.0, -0.3, 90.);
 
 vec3 boxSize = vec3(0.4, 1.6, 0.2);
 float sphereSize = 1.2;
 
 float dBox(vec3 p){
	 p.xy *= rot(time/2.);
	 p.xz *= rot(time/4.);
 	vec3 q = abs(p); 
 	return length(max(q - boxSize, 0.0));
 }
 
 float dSphere(vec3 p){
 	return length(p)-sphereSize;
 }
 
 
 float shape(vec3 p){
 	return dBox(p);
 	}
 
 
 float distFnc(vec3 p){
 	float scale =0.8;
 	float sum = scale;
 	float d = 1.;
 	
 	for (int i = 0; i < 8; i++){
         float td = shape(p) / sum;
         p = abs(p) - vec3(1., 3., 0);
         d = min(td, d);
         p.xy *= rot(pi * 1.2);
         p *= scale;
         sum *= scale;
     }
     return d;
 }
 
 
 vec3 getNormals(vec3 p){
 	float step = 0.01;
 	return normalize(vec3(
 		distFnc(p - vec3(step, 0, 0)) - distFnc(p - vec3(-step, 0, 0)),
 		distFnc(p - vec3(0, step, 0)) - distFnc(p - vec3(0,-step,  0)),
 		distFnc(p - vec3(0, 0, step)) - distFnc(p - vec3(0, 0, -step))));
 		}
 
 
 void main( void ) {
 	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
 	p.xy *= rot(time/3.);
	 
 	float screenZ = 2.;
 	vec3 camPos = vec3(0, 0,  -50.);
 	vec3 rayDir = normalize(vec3(p, screenZ));
 	vec3 rayPos = vec3(0, 0, 0);
 	vec3 col = vec3(0, 0, 0);
 	
 	float dist = 0.;
 	float depth = 0.;
 
 	for(int i = 0 ;  i < 999 ; i++){
 		rayPos = camPos + rayDir * depth;
 		dist = distFnc(rayPos);

 		
 		if(dist < 0.001){
 			vec3 normal = getNormals(rayPos);
 			float diff = clamp(dot(light, normal), 0.1, 1.0);
 		col = vec3(diff*0.2, diff*1.5, diff*3.);
 			break;
 		}	
 		depth += dist;
	 
 }

 	gl_FragColor = vec4(col, 1.0);
 }