#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932384626433832795
#define PI2 6.283185307179586476925286766559

#define RADIUS 0.75
#define RING_THICKNESS_PIXELS 12.0
#define AA_THICKNESS_PIXELS 1.0

#define ARC_LO_RADIANS 0.0
#define ARC_HI_RADIANS PI2
#define ARC_THICKNESS_PIXELS 100.0

uniform vec2 resolution;

void main( void ) {	
	
	float minres = min(resolution.x, resolution.y);
	vec2 position = 2.0 * ( (gl_FragCoord.xy - vec2(resolution.x - minres, resolution.y - minres) * 0.5) / minres ) - 1.0;
	float pixel = 1.0 / minres;
	float dst = sqrt(position.x * position.x + position.y * position.y);
	float innerRad = RADIUS - 0.5 * RING_THICKNESS_PIXELS * pixel;
	float outerRad = RADIUS + 0.5 * RING_THICKNESS_PIXELS * pixel;
	
	float ring = 
		smoothstep(innerRad - AA_THICKNESS_PIXELS * pixel, innerRad + AA_THICKNESS_PIXELS * pixel, dst) * 
		(1.0 - smoothstep(outerRad - AA_THICKNESS_PIXELS * pixel, outerRad + AA_THICKNESS_PIXELS * pixel, dst))
	;
	
	float angle = atan(position.y, position.x);
	float innerArcRad = RADIUS - 0.5 * ARC_THICKNESS_PIXELS * pixel;
	float outerArcRad = RADIUS + 0.5 * ARC_THICKNESS_PIXELS * pixel;
	
	float pixAngle = AA_THICKNESS_PIXELS * pixel / RADIUS;
	float arc = 
		smoothstep(innerArcRad - AA_THICKNESS_PIXELS * pixel, innerArcRad + AA_THICKNESS_PIXELS * pixel, dst) * 
		(1.0 - smoothstep(outerArcRad - AA_THICKNESS_PIXELS * pixel, outerArcRad + AA_THICKNESS_PIXELS * pixel, dst)) *
		smoothstep(ARC_LO_RADIANS - pixAngle, ARC_LO_RADIANS + pixAngle, angle) *
		(1.0 - smoothstep(ARC_HI_RADIANS - pixAngle, ARC_HI_RADIANS + pixAngle, angle))
	;
	
	vec4 background = vec4( 0.0, 0.0, 0.0, 1.0 );
	vec4 ringColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	vec4 arcColor = vec4( 1.0, 1.0, 1.0, 1.0 );
	
	gl_FragColor = mix( ringColor, arcColor, arc );

}