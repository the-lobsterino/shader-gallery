// @FL1NE
// single pixel line drawing example
// https://frontl1ne.net

#ifdef GL_ES
precision mediump float;
#endif

//#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float frag_coord_prefix = 0.5;


vec4 drawLineVertical(float w){
    vec4 ret_color = vec4(0.0);
    float line_position = w + frag_coord_prefix;
    if(gl_FragCoord.x == line_position){
        ret_color = vec4(1.0);
    }
    return ret_color;
}


void main(void) {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    vec4 dest_color = vec4(0.0);

    for(float i = 0.0; i < 7680.0; i += 2.0){
        dest_color += drawLineVertical(i);
	if(i > resolution.x) break;
    }

    gl_FragColor = dest_color;
}