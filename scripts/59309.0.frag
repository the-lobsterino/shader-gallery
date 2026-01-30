// JADIS
// steamcommunity.com/id/jadis0x

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define speed 1.2
#define k2PI (2.*3.14159265359)
#define kStarDensity 0.4
#define kMotionBlur 0.2
#define kNumAngles 256.

void main( void )
{
	vec2 position = .95*( gl_FragCoord.xy -  resolution.xy*.5 ) / resolution.x;
	//position += mouse - 0.5; // use this for mouse panning

	// 256 angle steps
	float angle0 = atan(position.y,position.x) / k2PI;
	float angle = fract(angle0 + .1*time);
	float rad = length(position);
	
	vec3 color = vec3(0.0);

	float angleFract = fract(angle*kNumAngles);
	float angleStep = floor(angle*kNumAngles)+1.;
	float angleToRandZ = 10.*fract(angleStep*fract(angleStep*.1935)*45.1);
	float angleSquareDist = fract(angleStep*fract(angleStep*.92657)*13.724);
	float t = speed * time - angleToRandZ;
	float angleDist = (angleSquareDist+0.1);
	float adist = angleDist/rad*kStarDensity;
	float dist = abs(fract((t*.1+adist))-.5);
	float white1 = max(0.,1.0 - dist * 100.0 / (kMotionBlur*speed+adist));
	float white2 = max(0.,(.1-.5*cos(k2PI * angleFract))*1./max(0.6,2.*adist*angleDist));
	float white = white1*white2;
	color.r = .03*white1 + white*(0.3 + 5.0*angleDist);
	color.b = white*(0.1 + .1*angleToRandZ);
	color.g = 1.5*white;

	vec3 knobColor = vec3(1.0,0.07,0.24)*sin(adist+t);
	color = color + max(0.05, 1.0-75.0*abs(0.04-rad)-.0*abs(angle0)) * knobColor;
	
	gl_FragColor = vec4( color, 1.0);
}