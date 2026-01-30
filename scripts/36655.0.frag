#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
void main( void ) {



	gl_FragColor = vec4( vec3(sin( time/100.0), 0.0,0.0 ), 1.0 );

}