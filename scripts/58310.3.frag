#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

int fx = 10;

void main( void ) {

	vec2 m = mouse * 2.0 - 1.0;
	float t_0 = m.x*m.y;//time;
	float f = 0.0;
        vec2 p = abs(surfacePosition);//(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	float ts = cos(dot(p,p));//(surfaceSize.x * surfaceSize.y);
	
	 vec2 v_1 = vec2(0.65, 0.65);
	 float l_1 = dot(p,v_1);//length(p + v_1);
	 float s_1 = sin(l_1 *  48.0 - (t_0 * ts) * 4.8);
	
	 vec2 v_2 = vec2(-0.65, -0.65);
	 float l_2 = dot(p,v_2);
	 float s_2 = sin(l_2 *  48.0 - (t_0 * ts) * 4.8);
	
	 f = (0.12 / abs(s_1)) + (0.12 / abs(s_2));
		
        gl_FragColor = vec4(vec3(f), 1.0);

}