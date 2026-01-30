#ifdef GL_ES
precision mediump float;
#endif

/*
Made while waiting for the Crushing Potatoes EP
( https://www.facebook.com/crushing.p?fref=ts )

*/
/*
Changes:
	Re-Fixed the random function for mobile compatibility (http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/)
	
*/

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D bb;

#define PI 3.14159265359

#define GROUND_HEIGHT .5
#define GROUND_COLOR vec3(.4, .3, .2)

#define TOWERS_AMOUNT 100.
#define TOWERS_HEIGHT .75
#define TOWERS_BORDER_SIZE .02
#define TOWER_COLOR vec3(1., 1., 1.)

#define HASHES_SIZE 0.003
#define HASHES_COLOR vec3(0., 1., 0.)

#define PETALS 1.
#define PARTS (PETALS*.5/PI)
#define SPEED -.15
#define SCALE 3.


highp float rand(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

highp float rand(float co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(vec2(co) ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

// http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 c2p(vec2 p){
	return vec2( length(p), atan(p.y, p.x));
}

vec2 p2c(vec2 p){
	return vec2(cos(p.y)*p.x, sin(p.y)*p.x);
}

vec3 getSkyColor(vec2 cart){
	float acc = 0.;
	
	acc  = clamp(1.-length(mod(cart +vec2(sin(time*SPEED*.25)*.1, -time*SPEED*.25), 	vec2(HASHES_SIZE*4.))-vec2(HASHES_SIZE*4.)*.5)/HASHES_SIZE, 0., 1.);
	acc += clamp(1.-length(mod(cart +vec2(sin(time*SPEED*.125)*.1, -time*SPEED*.125), 	vec2(HASHES_SIZE*8.))-vec2(HASHES_SIZE*8.)*.5)/HASHES_SIZE, 0., 1.);
	acc += clamp(1.-length(mod(cart +vec2(sin(time*SPEED*.6125)*.1, -time*SPEED*.6125), 	vec2(HASHES_SIZE*16.))-vec2(HASHES_SIZE*16.)*.5)/HASHES_SIZE, 0., 1.);
	
	return HASHES_COLOR*rand(floor(cart.xy*100.))*acc/3.;
}

vec3 getColor(vec2 polar, vec2 cart){
	float index = polar.y*TOWERS_AMOUNT;
	float heightA = rand((floor(index))/TOWERS_AMOUNT);
	float heightB = rand((floor(index)+10.*TOWERS_AMOUNT)/TOWERS_AMOUNT);
	float height = mix(heightA, heightB, cos(time)*.5+.5) ;
	
	float inGround = step(polar.x, GROUND_HEIGHT);
	float inGroundBorder = step(polar.x , GROUND_HEIGHT*.95);
	float inTower = step(polar.x - GROUND_HEIGHT*1.1, height*TOWERS_HEIGHT);
	float inTowerBorder = step(polar.x - GROUND_HEIGHT*1.1, height*TOWERS_HEIGHT-TOWERS_BORDER_SIZE);
	
	return mix(mix(getSkyColor(cart), mix(TOWER_COLOR*rand(floor(polar.x*20.+time)+heightA ),  hsv2rgb(vec3(time*.1, 1., 1.)), inTower*(1.-inTowerBorder)), inTower),mix(GROUND_COLOR*cos(cart.x*10.)*cos(cart.y*10.)*(.75+.25*cos(cart.x*100.)*cos(time*3.+cart.y*100.)), hsv2rgb(vec3(time*.1, 1., 1.))*cos(polar.x*400.) , inGround*(1.-inGroundBorder)) , inGround);
}

void main( void ) {
	float ratio = resolution.x/resolution.y;
	vec2 p = gl_FragCoord.xy / resolution.xy;
	p-=vec2(.5);
	p.x*=ratio;
	
	vec2 polar = c2p(p);
	polar.x*=SCALE;
	polar.y+=time*SPEED*.5;
	
	polar.y = mod(polar.y, 1./PARTS)*PARTS;
	polar.y-=.5;
	

	vec3 color = getColor(polar, p);
	gl_FragColor = vec4( color, 1.0 );
	gl_FragColor += 0.9*texture2D(bb, (gl_FragCoord.xy+1./(0.1+fract(p+vec2(cos(time/33.), sin(time/33.))))) / resolution.xy);
}