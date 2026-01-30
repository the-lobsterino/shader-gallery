#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
    vec2 p=(gl_FragCoord.xy-0.5*resolution)/min(resolution.x,resolution.y);//-1~+1の座標系
    vec2 o = vec2(0.0,0.0);
    vec3 c = 0.01/(length(p-o))*vec3(0.0,0.0,0.0);
    gl_FragColor = vec4(c,1.0);
	
}