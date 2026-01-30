// original by nimitz https://www.shadertoy.com/view/lsSGzy#, slightly modified, and gigatron for glslsandbox
// added computed noise from https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
// instead textured noise ; etc // 
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

 
	#define ray_brightness 10.
	#define gamma 5.
	#define ray_density 4.5
	#define curvature 15.
	#define red   1.
	#define green 1.8
	#define blue  2.99 

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!! UNCOMMENT ONE OF THESE TO CHANGE EFFECTS !!!!!!!!!!!
// MODE IS THE PRIMARY MODE
#define MODE normalize
// #define MODE 

#define MODE3 *
// #define MODE3 +

#define MODE2 r +
// #define MODE2 

// #define DIRECTION +
#define DIRECTION -

#define SIZE 0.1

 
 #define INVERT /
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}




// FLARING GENERATOR, A.K.A PURE AWESOME
mat2 m2 = mat2( 0.80,  0.60, -0.60,  0.80 );
float fbm( in vec2 p )
{	
	float z=8.;       // EDIT THIS TO MODIFY THE INTENSITY OF RAYS
	float rz = -0.05; // EDIT THIS TO MODIFY THE LENGTH OF RAYS
	p *= 0.25;        // EDIT THIS TO MODIFY THE FREQUENCY OF RAYS
	for (int i= 1; i < 6; i++)
	{
		rz+= abs((noise(p)-0.5)*2.)/z;
		z = z*2.;
		p = p*2.*m2;
	}
	return rz;
}

void main()
{
	float t = DIRECTION time*.33; 
	vec2 uv = gl_FragCoord.xy / resolution.xy-0.5;
	uv.x *= resolution.x/resolution.y;
	uv*= curvature* SIZE;
	
	float r = sqrt(dot(uv,uv)); // DISTANCE FROM CENTER, A.K.A CIRCLE
	float x = dot(MODE(uv), vec2(.5,0.))+t;
	float y = dot(MODE(uv), vec2(.0,.5))+t;
 
        float val=0.0;
        val = fbm(vec2(MODE2 y * ray_density, MODE2 x MODE3 ray_density)); // GENERATES THE FLARING
	val = smoothstep(gamma*.02-.1,ray_brightness+(gamma*0.02-.1)+.001,val);
	val = sqrt(val); // WE DON'T REALLY NEED SQRT HERE, CHANGE TO 15. * val FOR PERFORMANCE
	
	vec4 col = val / vec4(red,green,blue,0.0);
	col = 1.-col; // WE DO NOT NEED TO CLAMP THIS LIKE THE NIMITZ SHADER DOES!
        float rad= 35. ; // MODIFY THIS TO CHANGE THE RADIUS OF THE SUNS CENTER
	col = mix(col,vec4(1.), rad - 266.667 * r); // REMOVE THIS TO SEE THE FLARING
	
	gl_FragColor = vec4(col );
}