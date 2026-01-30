/* 	Deconstructing "Starfield in 381 chars"
	It appears as though this is a fragmentshader that manipulates all pixels on the screen. Neither vertices, geometry or vertex shader are specified/required
*/


/*	GLSL uses a state attribute 'precision' to determine how much precision the GPU uses to calculate floats. You can choose between highp, mediump and lowp. 
	Most systems support mediump while highp can bring some performance complications.

	A good rule of thumb:
	- use highp for vertex positions,
	- use mediump for texture coordinates,
	- use lowp for colors.*/

#ifdef GL_ES
precision mediump float;
#endif

/*	The following two declarations are global GLSL variables.
	Uniform variables are used to communicate with your vertex or fragment shader from "outside". 
	They are read-only and have the same value among all processed vertices. Uniform variables are declared/modified outside the shader program
*/
uniform float time;
uniform vec2 resolution;

// 	The effect of the following helper function is...???
float h(float i){
	return fract(pow(3., sqrt(i/2.)));
}

void main(void){
	
	// gl_FragCoord is the position of the vertex supplied to this fragment shader program 
	vec2 p=gl_FragCoord.xy*2.-resolution;
	
	float a=floor(degrees(4.+atan(p.y,p.x))*2.)/4.;
	
	float d=pow(2.,-10.*fract(0.1*time*(h(a+.5)*-.1-.1)-h(a)*1000.));
	
	if(abs(length(p)-d*length(resolution)) < d*35.){
		gl_FragColor=vec4(d*(h(a+.5)*3.));
	}else{
		gl_FragColor=vec4(0.);
	}
}