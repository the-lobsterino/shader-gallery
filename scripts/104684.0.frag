#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 back_color = vec3(1.0, 0.75, 0.0);

void main( void ) {
	
	vec2 uv = gl_FragCoord.xy/resolution.xy;
    	gl_FragColor = vec4(back_color.rgb*0.25, 1.0);
    	gl_FragColor.rgb += 0.1*(exp(-5.0*abs(sin(abs(uv.y - abs(cos(time)*cos(time)))))))*back_color;

}