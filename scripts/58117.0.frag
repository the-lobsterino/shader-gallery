#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define SIZE 0.01
#define ZOOM 10.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(in vec2 _st, in float _radius)
{
	vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.01), _radius+(_radius*0.01), dot(dist,dist)*4.0);
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy ;
	position *= ZOOM;

	vec3 color = vec3(0.0);
	
	color = pow(vec3(circle(position-ZOOM*0.5, SIZE*sin(time)+SIZE), 0.0, 0.0),vec3(circle(position-ZOOM*0.1, SIZE*sin(time)+SIZE), 0.0, 0.0));

	gl_FragColor = vec4( vec3(color), 1.0 );

}