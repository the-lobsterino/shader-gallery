#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

 

// borrowing parts of and others https://www.shadertoy.com/view/MlyXzw
// gtr add
#define PI 3.14159265359

mat2 rotate2d(float angle) {
    return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
}

float box( vec2 st, vec2 size) {
    st = smoothstep( size,size - 4.0 / resolution.y, abs(st));
    return st.x * st.y;
}

float plus( vec2 st, float size) {
    return  box(st, size * vec2(1.0,1.0 / 4.0)) + box(st, size * vec2(1.0 / 4.0,1.0));
}

void main()
{
	vec2 uv = surfacePosition;  // or !
	
	//vec2 uv= (gl_FragCoord.xy/resolution.xy)-0.5;
	
	//uv.x *= resolution.x/resolution.y;
	
	uv =fract(8.*uv)-.5;
	
	gl_FragColor = vec4(0);
	for(int i = 0; i < 10; i += 1){
		gl_FragColor += plus(uv, 0.3*sin(time)+0.5);
		uv -= sign(uv)/2.;
		uv *= 3.*rotate2d(3.*time*float(i+1));
		
		
	}

}

	


 
 
