#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

        p=p-.9*sin(p.x*18.)*2.*sin(p.y*16.)*1.;

	gl_FragColor = vec4( vec3(step(0.6, length(p) ),0.53,0), 1.0 );

}