#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

vec2 aspect = vec2(1.0,resolution.y/resolution.x);
vec2 position = ( gl_FragCoord.xy / resolution.xy )*aspect + mouse / 4.0;
	
    float frequency = 20.0;
    vec2 st2 = mat2(0.707, -0.707, 0.707, 0.707) * position;
    vec2 nearest = 2.0*fract(frequency * st2) - 1.0;
    float dist = length(nearest);
    float radius = 1.1;
    vec3 white = vec3(1.0, 1.0, 1.0);
    vec3 black = vec3(0.0, 0.0, 0.0);
    vec3 fragcolor = mix(black, white, clamp(smoothstep(0.0,radius, dist),0.,1.));
    gl_FragColor = vec4(fragcolor, 1.0);
	

}