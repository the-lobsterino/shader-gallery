#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform vec2 surfaceSize;
uniform sampler2D backbuffer;

// borrowing parts of and others https://www.shadertoy.com/view/MlyXzw

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

void mainImage( out vec4 fragColor, vec2 uv, float t )
{
	fragColor = vec4(0);
	for(int i = 0; i < 14; i += 1){
		if(i == 13) uv *= rotate2d(time);
		fragColor += plus(uv, 0.5);
		uv += -sign(uv)/3.;
		uv *= 3.;
	}
}


float dot2( vec2 v )
{
	return dot(v,v);
}

void main( )
{
   mainImage(gl_FragColor, surfacePosition*1.5, time);
	if(gl_FragColor.r > 0.5){
		gl_FragColor = (
			gl_FragColor
			+ 3.*texture2D(backbuffer, fract(time*surfaceSize.x+normalize(surfacePosition)/length(surfacePosition)))
			//+ texture2D(backbuffer, gl_FragCoord.xy/resolution)
		)*0.25;
	}
}

