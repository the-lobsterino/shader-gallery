#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float L(vec2 uv, vec2 ofs, float b) {
    return b/max(0.0000000000001, length(uv-ofs));
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 H21(vec2 uv){
    float x = rand(uv)*6.28318530718;
    float y = rand(uv*x);
   
    return vec2(sin(x), cos(x)*y);
}


void main( void ) {
	
	vec2 uv = gl_FragCoord.xy/resolution.xy;

	    uv -= .5;
	    uv.x *= resolution.x/resolution.y;
	    
	    float col = L(uv, H21(uv)*abs(sin(time*.3)), 0.05);
	    
	 
	gl_FragColor = vec4(col);

}