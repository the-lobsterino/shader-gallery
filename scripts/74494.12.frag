#extension GL_OES_standard_derivatives : enable


/////////////////////////////////////////////////////////////////////
// Please ignore this. I am just learning how glsl works :P
// I didn't know this would be shared publicly automatically on glslsandbox.com.
//
/////////////////////////////////////////////////////////////////////


precision mediump float;


void main( void ) {
	float finalShade = 0.0;
	//////////////////////////////////////////////////////////
	//vectors
	/*
	vec3 alpha = vec3(0.5, 0, 1.0);
	vec4 a;
	vec3 b;
	vec2 c;
	float d;
	
	b = alpha.xyz;
	d = alpha[2];
	a = alpha.xxxx;
	c = alpha.zx;
	
	b = alpha.rgb;
	b = alpha.stp;
	
	a.xy = alpha.yy;
	
	//gl_FragColor = b.xyzx;
	//gl_FragColor = vec4(alpha, 1.0);
	*/
	
	//////////////////////////////////////////////////////////
	//Matrices
	/*
	mat2 m2 = mat2(
		vec2(1.0, 2.0), 
		vec2(3.0, 4.0)
	);
	
	mat3 m3 = mat3(
		vec3(1.0, 2.0, 3.0),
		vec3(4.0, 5.0, 6.0),
		vec3(7.0, 8.0, 9.0)
	);
	
	
	if(m2[1][1] == 4.0) {
		finalShade = 0.2;
	}
	
	
	if(m3[2][1] == 8.0) {
		finalShade = 0.2;
	}

	*/
	
	
	//////////////////////////////////////////////////////////
	//operators
	
	//examples of invalid operators
	//float a = 3 * 0.7;
	//int b = 10.0 * 0.7;
	
	//vec3 c = vec3(1, 2, 3);
	//ivec3 d = ivec3(1, 2, 3);
	//vec3 e = c+d;
	
	
	/*
	int b = int(10.0 * 0.79);
	if(b == 7) {
		finalShade = 0.5;
	}
	*/
	
	/*
	vec3 a = vec3(1.0, 2.0, 3.0);
	vec3 b = vec3(1.0, 2.0, 3.0);
	
	vec3 q = a + 1.0;
	vec3 w = a + b;
	
	if(q.z > 1.5) {
		finalShade = 0.5;	
	}
	
	
	
	if(w.z > 5.9) {
		finalShade = 0.5;
	}
	*/
	
	
	/*
	vec2 i1 = vec2(1, 2);
	i1++;
	
	
	if(i1.x == 3.0) {
		finalShade = 0.5;
	}
	*/
	
	
	mat3 m3 = mat3(
		vec3(1.0, 2.0, 3.0),
		vec3(4.0, 5.0, 6.0),
		vec3(7.0, 8.0, 9.0)
	);
	
	vec3 v3 = vec3(2, 3, 4);
	
	vec3 va = m3*v3; //huh, guess it does transpose internally
	vec3 vb = v3*m3;
	mat3 ma = m3*m3;
	
	/*
	if(va[2] == 60.0) {
		finalShade = 0.3;
	}
	*/
	
	
	/*
	if(vb[2] == 74.0) {
		finalShade = 0.3;
	}
	*/
	
	/*
	if(ma[1][2] == 96.0) {
		finalShade = 0.3;
	}
	*/
	
	vec3 v4b = vec3(2,3,5);
	
	if(v3 == v4b) {
		finalShade = 0.3;	
	}
	
	
	
	
	
	gl_FragColor = vec4(finalShade);
}