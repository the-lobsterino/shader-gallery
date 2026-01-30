#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define temp 501.6917293233

void main( void ) {

    vec2 p = (gl_FragCoord.xy*2.0-resolution) / min(resolution.x, resolution.y);
    float l = 0.0;
    for(float i= -5.0;i<5.0;i++){
    	for(float j= -5.0; j<5.0;j++){
    		float x = p.x - i*0.05;
    		float y = p.y - j*0.05;
    		l += cos((x*x+y*y)*temp*1.0);
    	}
    }
    gl_FragColor = vec4( vec3( 1.0) * l, 1.0 );

}