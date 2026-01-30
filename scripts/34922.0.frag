#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float map(vec3 p) {
	vec3 q = fract(p)*2.0-1.0;
	return length(q) - (1.0/length(p))*0.25;
}

float march(vec3 o, vec3 d) {
	
	float a = 0.0;
	for(int i = 0; i < 24; i++) {
		vec3 ray = o + d * a;
		float v = map(ray);
		a += v*0.35;
	}
	
	return a;
}



void main( void ) {
	//Calculate coordinates -1 to 1 in screenspace for x and y
	//vec2 st = 2.0*(gl_FragCoord.xy / resolution)-1.0;
	vec2 st = surfacePosition;
	
	//Correct the aspect ratio..
	//st.x*= (resolution.x / resolution.y);
	
	//Produce ray's direction vector
	vec3 dir = normalize(vec3(st, 1.0));
	
	mat2 rotY;
	rotY[0][0] = cos(time*0.1);
	rotY[1][0] =-sin(time*0.1);
	rotY[0][1] = sin(time*0.1);
	rotY[1][1] = cos(time*0.1);
	//Rotate camera
	dir.xz = rotY * dir.xz;
	dir.xy = rotY * dir.xy;
	
	//Ray's origin
	vec3 origin = vec3(1.0, 0.0, 2.0);
	
	origin.xz = rotY * origin.xz;
	
	//Let's do the marching!
	float d = march(origin, dir);
	
	//Calculate the fog factor.
	float f = 1.0 / (1.0 + pow(d,0.7)*0.1);
	
	//Produce pixel.
	gl_FragColor = vec4(vec3(pow(f,2.4), f*f*f*f, f*f*f*f*f), 1.0);
	
}