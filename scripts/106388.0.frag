#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 st = ( gl_FragCoord.xy / resolution.xy );

    vec4 color1=vec4(1.0,0.0,0.0,1.0);
    vec4 color2=vec4(0.0,0.0,1.0,1.0);
    gl_FragColor = mix(color1,color2,st.t);

}