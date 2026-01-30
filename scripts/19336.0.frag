#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define RRatio 0.1796875
#define GRatio 0.55859375
#define BRatio 0.62890625



#define cirR 0.1953125
#define cirG 0.5859375
#define cirB 0.6640625

#define partCol 0.73046875

#define CIRCLE 2
#define CircleLine 0.01

#define partSize 0.005



void main( void ) {

vec2 position = (gl_FragCoord.xy / resolution.xy);
vec2 center = (resolution *0.5);
float backgroundIntensity = 1.-length(position - center/resolution.xy)*1.5;
gl_FragColor = vec4(0.0);
float circDelay = 0.0;
vec4 lineColor = vec4(cirR,cirG,cirB,1.0);
vec4 partColor = vec4(partCol,partCol,partCol,1.0);
for (int i = 0 ; i < CIRCLE; i++)
{
float distCir = sin(length(center.xy - gl_FragCoord.xy) / resolution.x + circDelay -time*0.5);
if (distCir > 0.01 && distCir < 0.011111) {
gl_FragColor += lineColor;
} 
circDelay+= 0.1;
}
vec2 realMouse = vec2(mouse.x* resolution.x, mouse.y* resolution.y);
float size = length(gl_FragCoord.xy - realMouse.xy)/resolution.x;
if (  size < partSize ) {
gl_FragColor += vec4(1.0 - pow(size/partSize,1.5));
}
float partDist = sin(length(center.xy - gl_FragCoord.xy) / resolution.x + time*0.5);
//angle?
vec2 positionFromCenter =  ( gl_FragCoord.xy -  resolution.xy*.5 ) / resolution.x;
float angle = atan(positionFromCenter.y,positionFromCenter.x)/(2.*3.14159265359);
angle -= floor(angle);
float rad = length(positionFromCenter);
vec4 color = vec4(0.0);
for (int i = 0; i < 1; i++) {
float angleFract = fract(angle*256.);
float angleRnd = floor(angle*256.)+1.;
float angleRnd1 = fract(angleRnd*fract(angleRnd*.7235)*45.1);
float angleRnd2 = fract(angleRnd*fract(angleRnd*.82657)*13.724);
float t = -time*0.1+angleRnd1*10.;
float radDist = sqrt(angleRnd2+float(i));

float adist = radDist/rad*.03;
float dist = (t*.3+adist);
dist = abs(fract(dist)-.5);
//	 float c = sin(float(i) / 4.0) + 1.0;
if (.5-dist*40./adist > 0.0) {
color += ((.5-dist*40./adist)*(.5-abs(angleFract-.5))*5./adist/radDist) * partColor;//vec4(c*angleRnd1,c*angleRnd2,c*(angleRnd1+angleRnd2),1.0);
}
//color += (max(0.,.5-dist*40./adist)*(.5-abs(angleFract-.5))*5./adist/radDist) * partColor;//vec4(c*angleRnd1,c*angleRnd2,c*(angleRnd1+angleRnd2),1.0);
angle = fract(angle+.61);
}
//Apply background color
gl_FragColor = gl_FragColor + vec4( vec3(RRatio, GRatio, BRatio) * backgroundIntensity, 1.0 )+color;
}