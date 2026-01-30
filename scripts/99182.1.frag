#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 rgbaNoise(vec2 p){
	//p -= floor(p / 879.0) * 2787.0;
	//p += (vec2(223.35734, 550.56781));
    	p *= p;
    	float xy = p.x * p.y;
   	return vec4( fract(xy * 0.00000212),
                     fract(xy * 0.00000543),
                     fract(xy * 0.00000492),
                     fract(0.9999));
}

void main( void ) {
	vec2 p =  gl_FragCoord.xy ;
	gl_FragColor = rgbaNoise(p);
}