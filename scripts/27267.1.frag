#ifdef GL_ES
precision mediump float;
#endif




// This is a wonderful portrait of computer programming
// which even beats the voice chat / behavior on certain online games
// such as the battle royale lobby in H1Z1 
// :)













uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//Animated Steam logo using 2D distance fields

//Settings
float speed = 0.5;
float armLength = 0.35;
float rodLength = 0.7;
float pivotSize = 0.10;
float axleSize = 0.15;

//Colors
vec3 bgTop = vec3(0);
vec3 bgBottom = vec3(0);

vec3 logoTop = vec3(0.4);
vec3 logoBottom = vec3(0.9);

mat2 Rotate(float angle);
float AngleBetween(vec2 v1,vec2 v2);
float Reciprocate(float ca,float cr,float rl);
float Lerp(float low,float high,float amount);
float Circled(float s,float rad,vec2 pos,float scale);
float Square(float rad,vec2 pos);
float Rectangle(vec2 size,vec2 pos);

void main( void ) {

	vec2 aspect = vec2(resolution.x/resolution.y,1.0);
	vec2 position = ( gl_FragCoord.xy / resolution.y );
	
	vec2 center = aspect / 2.0;
	
	float angle = time * 188.55 * 0.02;
	
	float scene = 0.0;
	
	vec2 transform = vec2(0);
	//Axle
	vec2 axlePos = center - vec2(-0.3,0);
	transform = position - axlePos;
	
	vec2 armDomain = transform*Rotate(angle);
	
	float taper = Lerp(axleSize*1.7,pivotSize,-(armDomain.x/armLength));
	
	armDomain = (armDomain - vec2(-armLength/2.0,0));
	
	scene = min(scene,Rectangle(vec2(armLength,taper),armDomain));
	
	scene = Circled(scene,axleSize,transform,5.0);

	
	//Crank
	vec2 crankPos = axlePos - vec2(armLength,0) * Rotate(-angle);
	transform = position - crankPos;
	
	scene = Circled(scene,pivotSize,transform,3.0);
	
	//Piston
	vec2 pistonPos = axlePos - vec2(Reciprocate(angle,armLength,rodLength),0);
	
	transform = position -pistonPos; 
	
	scene = Circled(scene,pivotSize,transform,3.0);

	
	//Push Rod
	vec2 rodPos = pistonPos;
	
	transform = (position  - rodPos) * Rotate(-AngleBetween(crankPos,pistonPos));
	transform = transform - vec2(rodLength/2.0,0);
	
	scene = min(scene,Rectangle(vec2(rodLength,(pivotSize-0.045)*2.0-0.01),transform));
	
	//Shading
	float blend = smoothstep(0.0,0.002,-scene);
	
	vec3 background = mix(bgBottom,bgTop,position.y);
	background *= abs(sin((position.x + position.y)*400.0));
	
	vec3 shade = mix(logoBottom,logoTop,position.y);
	
	vec3 color = mix(background,shade,blend);
	
	gl_FragColor = vec4( vec3(color), 1.0 );

    vec2 p = (2.0*gl_FragCoord.xy-resolution)/resolution.y;
p = -(vec2(0.,1)+p.yx);
    // animate
    float tt = mod(time,200.0)/200.0;
    float ss = pow(tt,.2)*0.5 + 0.5;
    ss -= ss*0.2*sin(tt*6.2831*5.0)*exp(-tt*3.0);
    p -= vec2(0.,.98);
    p *= vec2(0.5,0.83) + ss*vec2(0.25, 0.192);

    
    float a = atan(p.x,p.y)/3.141593;
    float r = length(p*1.2);

    // shape
    float h = abs(a);
    float d = (11.0*h - 16.0*h*h*h + 6.0*h*h*h)/(6.0-5.0*h);

    // color
    float f = step(r,d) * pow(1.0-r/d,0.35);
	if (f > 0.) {
	// let's do some antialiasing, right...
	float b = min(0.99,abs(gl_FragCoord.y/resolution.y - .5) + .7);
	a = min (1., 1. + (b-(1.-f))/(1.-b));
	f = max(f,.02);
    gl_FragColor = vec4(f*1.25,f*0.9,f,1.0)*a + gl_FragColor*(1.-a);
	}
}

//Shapes
float Circle(float rad,vec2 pos)
{
	return length(pos)-rad;
}

float Circled(float s,float rad,vec2 pos,float scale)
{
	float lp = length(pos);
	s = min(s,lp-rad);
	s = max(s,rad-0.01*scale-lp);
	s = min(s,lp-rad+0.015*scale);
	return s;
}

float Square(float rad,vec2 pos)
{
	return max(abs(pos.x),abs(pos.y))-rad;
}

float Rectangle(vec2 size,vec2 pos)
{
	return length(pos-clamp(pos,-size/2.0,size/2.0)) - 0.005;
}

//Math Functions
//Creates a 2D rotation matrix for the given angle
mat2 Rotate(float angle)
{
	return mat2(cos(angle),-sin(angle),
		    sin(angle), cos(angle));
}

//Angle between two 2D vectors
float AngleBetween(vec2 v1,vec2 v2)
{
	return atan(v1.y-v2.y,v1.x-v2.x);
}

//Reciprocating motion
//ca = Crank Angle
//cr = Crank Radius
//rl = Push Rod Length
float Reciprocate(float ca,float cr,float rl)
{
	return cr * cos(ca) + sqrt(rl*rl - pow(cr * sin(ca),2.0));
}

//Linearly interpolates between two numbers by the amount
float Lerp(float low,float high,float amount)
{
	return clamp(low + (high - low) * amount,0.0,1.0);
}