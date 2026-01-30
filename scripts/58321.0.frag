#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;


int fx = 11;
float pi = 3.141592653;

void main( void ) {

	float f = 0.0;
        vec2 p = surfacePosition;//(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	vec2 uv = gl_FragCoord.xy / resolution;
	
	if (uv.x < 0.5) {
	 vec2 v_1 = vec2(0.65, 0.65);
	 float l_1 = length(p + v_1);
	 float s_1 = sin(l_1 *  pi * 16.0 - time * pi);
	
	 vec2 v_2 = vec2(-0.65, -0.65);
	 float l_2 = length(p + v_2);
	 float s_2 = sin(l_2 *  pi * 16.0 - time * pi);
	
	 f = (0.12 / abs(s_1)) + (0.12 / abs(s_2));
		
	}
	// ------------------------
	else{
	vec2 v_1 = vec2(0.65, 0.65);
	 float l_1 = (length(p + v_1) * 16.0 - time);
	
	 vec2 v_2 = vec2(-0.65, -0.65);
	 float l_2 = (length(p + v_2) * 16.0 - time);
		if(abs(l_1 - float(int(l_1))) < 0.1 || abs(l_2 - float(int(l_2))) < 0.1){
	 f = 1.0;
		}
		
		
		
	}

        gl_FragColor = vec4(vec3(f), 1.0);

}