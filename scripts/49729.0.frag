#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/*Input type is radians (π)*/
mat2 Rotate2D(float angle) {
	return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main( void ) {
	vec2 pos = vec2(gl_FragCoord.xy/resolution.xy)*Rotate2D(time*0.15)+(time*0.3);
	gl_FragColor = vec4(max(vec2(fract(pos.y*20.0)*fract(pos.x*20.0)), vec2(0.35) ), 0.0, 1.0);
}

/* Made in Turkey :D */