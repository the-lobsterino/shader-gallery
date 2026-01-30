#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 st = gl_FragCoord.xy/resolution.xy;
    vec3 color = vec3(0.0);
    
    float left = step(0.2,st.x);  
    float bottom = step(0.1,st.y);
    float right = step (0.2, 1.0 - st.x);
    float top = step (0.1, 1.0-st.y);
    
    color = vec3(left * bottom * right * top);
    
    gl_FragColor = vec4(color,1.0);

}