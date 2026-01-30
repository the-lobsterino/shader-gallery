#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// make sphere
float sphere(vec3 p){
	return length(p)-1.0;
}

// make cube
float cube(vec3 p){
	p = abs(p);
	return length(vec3(max(p.x-1.,0.),max(p.y-1.,0.),max(p.z-1.,0.)))
		+max(0.0,min(p.x-1.0,min(p.y-1.0,p.z-1.0)));
}

float sdf(vec3 p){
     vec3 q = p;
	q.z *= 0.5;
	return cube(q);	
}

mat2 rotate(float r){
	return mat2(cos(r),-sin(r),sin(r),cos(r));
}



void main( void ) {
	
	vec2 position = 2.0*(gl_FragCoord.xy / resolution.xy) - vec2(1.0,1.0);
	position.y *= resolution.y / resolution.x;
	
	vec3 cPos = vec3(0.0,1.0,5.0);
	

	

}