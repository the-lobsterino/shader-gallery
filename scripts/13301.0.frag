#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main()
{
	vec3 sp = vec3(surfacePosition,mouse.x);
	for (float s=.0; s<1.; s+=.05) {
		sp=abs(sp)/dot(sp,sp)- s;
	}	
	gl_FragColor=vec4(sp, 200.0);
}