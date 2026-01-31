
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

 
	#define ray_brightness 50.
	#define gamma 4.25
	#define ray_density 9.5
	#define curvature 85.
	#define red   0.0
	#define green 0.5
	#define blue  1.0 

 

#define SIZE 0.2

 
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
mat2 m2 = mat2( 0.20,  1.0, -1.0,  0.10 );
float fbm( in vec2 p )
{	
	float z=9.;       // EDIT THIS TO MODIFY THE INTENSITY OF RAYS
	float rz = -0.035; // EDIT THIS TO MODIFY THE LENGTH OF RAYS
	p *= 0.18;        // EDIT THIS TO MODIFY THE FREQUENCY OF RAYS
	for (int i= 2; i < 8; i++)
	{
		rz+= abs((noise(p)-.1)*1.)/z;
		z = z*1.5;
		p = p*1.5*m2;
	}
	return rz;
}

void main()
{
	float t = -time*.33; 
	vec2 uv = gl_FragCoord.xy / resolution.xy-0.5;
	uv.x *= resolution.x/resolution.y;
	uv*= curvature* SIZE;
	
	float r = sqrt(dot(uv,uv)); // DISTANCE FROM CENTER, A.K.A CIRCLE
	float x = dot(normalize(uv), vec2(.5,0.))+t;
	float y = dot(normalize(uv), vec2(.0,.5))+t;
 
        float val=0.0;
        val = fbm(vec2(r+ y * ray_density, r+ x * ray_density)); // GENERATES THE FLARING
	val = smoothstep(gamma*.02-.1,ray_brightness+(gamma*0.02-.1)+.001,val);
	val = sqrt(val); // WE DON'T REALLY NEED SQRT HERE, CHANGE TO 15. * val FOR PERFORMANCE
	
	vec3 col =  val/ vec3(red,green,blue);
	col = 1.-col; 
        float rad= 125. ; 
	col = mix(col,vec3(1.), rad - 166.667 * r); // REMOVE THIS TO SEE THE FLARING
	vec4 cfinal =  mix(vec4(col,1.0),vec4(0.0,0.0,.0,1.0),0.01);
	
	gl_FragColor = vec4(cfinal);
}