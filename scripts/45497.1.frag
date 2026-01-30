#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Camera											
{
	vec3 position;
	vec3 lookAt;
	vec3 rayDir;
	vec3 forward, up, left;
};

struct Distance{
	float a;
	float b;
};
	
float de(vec3 p){
	vec3 op = p;
 	p = abs(1.0-mod(p,2.));
    	float r = 0., power = 8., dr = 1.;
    	vec3 z = p;
	
	
    for (int i = 0; i < 16; i++) {
	    
	op = -1.0 + 2.0*fract(0.5*op+0.5);

	float r2 = dot(op,op);
	   
	    
        r = length(z);
	
	    
        if (r > 2.) break;
        float theta = acos(z.z / r) ;//+ fract(time/20.) * 0.3;
        float phi = atan(z.y, z.x);

        dr = pow(r, power - 1.) * power * dr + 1.;
        float zr = pow(r, power);
        theta = theta * power;
        phi = phi * power;
        z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
        z += p;
    }
    return (.5 * log(r) * r / dr) - 0.01;
		
}

float map(vec3 p){
	return de(p);	
}



Distance raymarch(in vec3 from, in vec3 dir) {

	vec3 pos;
	float t,d;
	Distance res;
	for (int i = 0; i < 64; i++) {
		pos = from + t * dir;
		d = map(from + dir * t);
        	if (d < 0.001) break;
	        	t += d;
	}
	res.a = d;
	res.b = t;
	return res;
	
}	

void main( void ) {
	float t = time;
	float screenAspectRatio = resolution.x/resolution.y;
	
	vec2 uv  = 2.0*gl_FragCoord.xy/resolution.xy - 1.0;

	Camera cam;
	
  	cam.lookAt = vec3(1.5+sin(time),.5,5.);								
	cam.position = vec3(0);						
	cam.up = vec3(0,1.0,0);									
  	cam.forward = normalize(cam.lookAt-cam.position);					
  	cam.left = cross(cam.forward, cam.up);							
 	cam.up = cross(cam.left, cam.forward);		
 
	vec3 screenOrigin = (cam.position+cam.forward); 
	
	vec3 screenHit = screenOrigin + uv.x*cam.left*screenAspectRatio + uv.y*cam.up; 		
  
	cam.rayDir = normalize(screenHit-cam.position);	
	
	Distance res = raymarch(screenOrigin,cam.rayDir);
		
	float c = res.b;
	vec3 col;
		col = vec3(c,c*c,c*c*c);	
	
	gl_FragColor = vec4( col, 1.0 );

}