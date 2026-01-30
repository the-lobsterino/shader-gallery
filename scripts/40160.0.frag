#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;

//#define E  2.718281828 //is there a non series approximation function for this?

//no there is so fast good approximation for e.
//best one liner that i could come up with is
//#define E pow((1.+exp2(-23.)),exp2(23.)) //best opengl 16bit float can do?
//so that one can increae precision if you love to use the value exp2(23.) or good frqactions/exponentials of it ???
//
//the generally most reasonable approximation that could be useful to increase the precision for some cases (planning to someday use 64-bit floats)
//for complex number rotations, where the ".i-Dimension" is defined as i*i=-1; i*i*i=-i; i*i*i*i=i, would be a transformation of eulers identity:
//pow(e,2.*i*acos(-1.))   =0. ;//"a full rotation is as if you never rotated or moved."
//or
//pow(e,   i*acos(-1.))+1.=0. ;//"a half rotation makes you look in the other direction"
//pow(e,   i*acos(-1.))   =-1.;//"a half rotation makes you look in the other direction"
//or
//pow(e,   i*acos(-1.))-i =0.;//"a quater rotation makes you look 90°_counterclockwise==[up]==in the "+i"-Direction"
//pow(e,   i*acos(-1.))   =+i;//"a quater rotation makes you look 90°_counterclockwise==[up]==in the "+i"-Direction"
//but even there you lose a lot of precision in acos(x) and pow(x)||log(x) even with 32 bit floats.
//
//the above identities become relevant for squareroots of negative numbers, 
//...that can have a solution for complex dual numbers vec2 complex=vec2(x,i*y);
//the above identities become relevant for complex 3d rotations "quaternion rotation", 
//that is pretty much just like matrix multiplication, 
//but with a vec4()_quaternion instead of a mat3()_rotation_matrix, 
//so it becomes only as computationally complex as the axisAngle-rotation of a point to rotate a quaternion rotation by a quaternion rotation.

#define E 2.7182818284590452353602874713527
//#define eul pow((1.+exp2(-23.)),exp2(23.)) //best opengl 16bit float can do?
//e= pow((1+1/x),x), for x-> infinity. = "limes of deriving with (infinitely) large exponents"
//e= sumOf_Xis0_to_N(1/x!)   , for n-> infinity
//log(a,x)== inverse of pow(a,x); | log(a,pow(a,x))=1.
//e= base of natural log;  log(x)=inverse of pow(e,x);//opengl also has log2(x)=inverse of pow(2,x)


float logistic(float x, float k)
{	
	return 1./(1. + pow(E, -k * (x - .5)));
}


float smoosh(float x)
{
	return clamp(logistic(x, E * 5.), 0., 1.);
}


float witch(float x, float y)
{
	return ((y*y*y)*508.)/((x*x)+4.*(y*y));
}


float smoosh2(float x)
{
	return 1./(x*x+1.);
}


void main( void ) {

	vec2 uv 	= gl_FragCoord.xy / resolution.xy;


	float s		= smoosh(uv.x);
	float s2	= smoosh2((1.-uv.x)*8.);
	
	gl_FragColor 	= vec4(33.0 * pow(s2, 1.0 + uv.y * 3.0) * (1.0 - uv.x));

}//sphinx