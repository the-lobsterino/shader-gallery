#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	float mousedist = distance(mouse, position);

	float dark = gl_FragCoord.x/resolution.x;
	dark *= abs(sin(time/10.))*-2.0;
	dark += rand(vec2(1,101));
	dark += pow(.001, mousedist*2.0);
	
	vec2 cone = vec2(resolution.x/3.0, resolution.y/2.0)/resolution.xy;
	float angle = degrees(acos(dot(position-cone, cone)/(length(cone)*length(position-cone))));
	if(angle > 20.0 && angle < 90.0 && position.x > cone.x+.001)
	{
		float conedist = distance(cone, position);
		dark += pow(.001, conedist*4.0);
	}

	gl_FragColor = vec4( dark*.3, dark*.4, dark, 1.0 );

}