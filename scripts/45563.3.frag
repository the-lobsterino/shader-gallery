#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

//short cycle

float rand(float x, float y)
{
    return fract(sin(dot(vec2(x, y), vec2(12.9898, 78.233))) * 43758.5453);
}

float oct(vec2 p){
    return fract(4768.1232345456 * sin((p.x * 147.0+p.y*943.0)));
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	float col	= fract( oct(vec2(position.y,position.x)) + time);
	
	if(position.x > 0.5){
		col = 0.0;
		float dt = 0.00;
		float dstep = 0.04;
		for(int i=0;i<20;i++){
			col += fract( oct(vec2(position.y,position.x)) + time + dt);
			dt += dstep;
		}
		col /= 20.0;
		col = pow(col, 4.0) * 10.0;
	}
	
	gl_FragColor = vec4( col, col, col, 1.0 );

}