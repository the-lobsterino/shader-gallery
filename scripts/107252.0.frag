// 180720N

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 po = ( gl_FragCoord.xy / resolution.xy );
	po /= dot(po,po) + 3330.33333325;
	float f = time;
	float c1 = sin(time+f*po.x+31.*sin(time+f*po.y+33.));
	float c2 = sin(time+f*po.x+23.*sin(time+f*po.y+23.));
	float c3 = sin(time+f*po.x+33.*sin(time+f*po.y+31.));
	vec3 rb = vec3(c1,c2,c3);
	
	gl_FragColor = vec4( rb, 1.0 );

}

