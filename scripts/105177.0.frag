#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	float base = step(p.y,.03);
	float up = step(1.-p.y,.03);
	float columns = ceil(sin(p.x*35.)) + base - up;
	float aest = tan(pow(p.x*p.y,-2.) * 800.) * up;
	vec3 parthenon = vec3(columns+aest*.3,base-aest*.4+columns*.4,aest);
	
	gl_FragColor = vec4( parthenon, 1.0 );

}