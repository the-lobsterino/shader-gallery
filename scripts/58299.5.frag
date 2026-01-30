#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {

	float f = 0.0;
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	// 01 --------------------
	// f = p.x;
	// ------------------------
	
	// 02 --------------------
	// ------------------------
	
	// 03 --------------------
	// float l_1 = length(p + vec2(1.0, 1.0));
	// float l_2 = length(p + vec2(-1.0, -1.0));
	// f = 1.0 - l_1 *  l_2 * 0.5;
	// ------------------------
	
        // 04 --------------------
	// float l = length(p.x);
	// f = l;
	// ------------------------
	
	// 05 -------------------
	// float l = length(p);
	// f = l;
	// ------------------------

	// 06 -------------------
	// float l = length(p);
	// float s = sin(l * 24.0 - time * 3.2);
	// f = 0.05 / abs(s);
	// ------------------------
	
	// 07 -------------------
	// float l = length(p);
	// float s = sin(l *  48.0 - time * 4.8);
	// f = 1.0 - 0.1 / abs(s);
	// ------------------------
	
	// 08 -------------------
	// vec2 v = vec2(0.65, 0.65);
	// float l = length(p + v);
	// float s = sin(l *  48.0 - time * 4.8);
	// f = 1.0 - 0.1 / abs(s);
	// ------------------------
	
	// 09 -------------------
	// vec2 v_1 = vec2(0.65, 0.65);
	// float l_1 = length(p + v_1);
	// float s_1 = sin(l_1 *  48.0 - time * 4.8);
	
	// vec2 v_2 = vec2(-0.65, -0.65);
	// float l_2 = length(p + v_2);
	// float s_2 = sin(l_2 *  48.0 - time * 4.8);
	
	// f = (1.0 - 0.2 / abs(s_1)) + (1.0 - 0.2 / abs(s_2));
	// ------------------------
	
	// 10 -------------------
	// vec2 v_1 = vec2(0.65, 0.65);
	// float l_1 = length(p + v_1);
	// float s_1 = sin(l_1 *  48.0 - time * 4.8);
	
	// vec2 v_2 = vec2(-0.65, -0.65);
	// float l_2 = length(p + v_2);
	// float s_2 = sin(l_2 *  48.0 - time * 4.8);
	
	// f = (0.12 / abs(s_1)) + (0.12 / abs(s_2));
	// ------------------------

        gl_FragColor = vec4(vec3(f), 1.0);

}