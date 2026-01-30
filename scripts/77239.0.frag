#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec3 fragVertexEc;
vec3 up = vec3(0, 0, 1);


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec3 X = dFdx(fragVertexEc);
     	vec3 Y = dFdy(fragVertexEc);
     	vec3 normal=normalize(cross(X,Y));
     	float c = (1.0 - dot(normal, up));
     	c = (1.0 - cos(c*c))/3.0;
     	gl_FragColor = vec4(c, c, c, 1.0);
}