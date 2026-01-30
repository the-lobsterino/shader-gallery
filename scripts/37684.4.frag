#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define time ((time+(sin(time*0.02)*0.5+0.5))*0.075)

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
	for(int i = 0; i < 10; i += 1){
		fragColor += plus(uv, 0.5);
		uv -= sign(uv)/3.;
		uv *= 3.*rotate2d(3.*time*float(i+1));
	}
}


float dot2( vec2 v )
{
	return dot(v,v);
}

void main( )
{
   mainImage(gl_FragColor, surfacePosition*1.5, time);
	
}

