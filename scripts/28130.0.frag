#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define speed 10.0
#define kRotate 0.002
#define k2PI (2.*3.14159265359)
#define kStarDensity 0.05
#define kMotionBlur 2.0
#define kNumAngles 100.

void main( void )
{
	vec2 position = .5*( gl_FragCoord.xy -  resolution.xy*.5 ) / resolution.x;
	position.x += 0.1*mouse.x - 0.05; // use this for mouse panning
	float angle0 = atan(position.y, position.x) / k2PI;
	float angle = fract(angle0 + kRotate*time);
	float rad = length(position);
	float angleFract = fract(angle*kNumAngles);
	float angleStep = floor(angle*kNumAngles)+1.;
	float angleToRandZ = 10.*fract(angleStep*fract(angleStep*.7535)*45.1);
	float angleSquareDist = fract(angleStep*fract(angleStep*1.333)*10.000);
	float t = (speed+0.5*22.) * time - 333.*angleToRandZ;
	float angleDist = (angleSquareDist+5.0+sin(time * 10.0));
	float adist = angleDist/rad*kStarDensity;
	float dist = (abs(fract((t*.1+adist))-0.0));
	if (dist > 0.123) {
	float white1 = max(0.,1.0 - dist * 100.0 / ((kMotionBlur+mouse.y*3.0)*speed+adist));
	float white2 = max(0.,(.5-.5*cos(k2PI * angleFract))*1./max(0.6,2.*adist*angleDist));
	float white = white1*white2;
	vec3 color = vec3(0.0);
	color.r = .05*white1 + white*(0.3 + 5.0*(angleDist - 5.0));
	color.b = white*(0.1 + .5*angleToRandZ);
	color.g = 3.5*white;
	gl_FragColor = vec4( color, 1.0);
} else {
	gl_FragColor = vec4(0.0);
}
}