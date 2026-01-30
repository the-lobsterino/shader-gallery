#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main(void) {
	vec2 st = gl_FragCoord.xy / resolution * 300.0;
    float tiempo = time;
	gl_FragColor = vec4(0.3 - (-0.1 * sin (0.17 * tiempo)), 0.9 *  (cos(0.61 * tiempo) * tan(st.x * st.y * sin((3.5 + 0.0009 * tiempo)) * 0.5)), abs (0.5 - st.x * st.y * sin(0.033 * tiempo)) , 0.002 * atan(7.0 * tiempo));
}