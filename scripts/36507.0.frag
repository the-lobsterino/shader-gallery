#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    gl_FragColor = vec4(0,0,0,1);
float ratio = resolution.x  / resolution.y;
	vec2 center = vec2(0.5 * ratio ,0.5);
    vec2 uv = gl_FragCoord.xy / resolution ;
	vec2 uv1 = vec2(uv.x * ratio, uv.y);
    if(distance(uv1,center)<=(0.2*sin(time)+0.3)){
            gl_FragColor = vec4(1,1,1,1);
    	}
    

}