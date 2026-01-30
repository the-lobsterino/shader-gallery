 /**\  /**\
/*||*\	||
  ||	Lt==> Change  resolution to 1 :)
  ||
  Lt==> Click hide code :*

*/



//////////////////////////////////
//				//
//          VRG corp	      	//
//				//
//        Le kubikoto,		//
//	   Le kubikoto,		//
//	    Le kubikoto,	//
//	       ....		//
//   A les plus gros biscotos   //
//			       //
//////////////////////////////// *


// Tried some simple volume rendering attempt :)
// Added some correctness

// comment to get original density function
#define ALT_DENSITY

// uncomment to get hologram effect
//#define HOLOGRAM

// comment to display density in greyscale
#define ENABLE_COLORS


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define INF  20.
#define EPSILON  0.0043543454301
#define PI  3.14159265359


//#define time 176.

#define BOX_THICKNESS (.1*INF/20.)
#define BOX_SIZE 2.*INF/20.
#define BOX_P vec3(0., 0., cos(time*.1)*PI*INF/20.)
#define BOX_ROT BOX_P.z
#define BOX_DE max(sdSphere(vec3(rotate(p.xy, BOX_ROT), p.z)-BOX_P, 2.5*INF/20.), sdBox(vec3(rotate(p.xy, BOX_ROT), p.z)-BOX_P, vec3(BOX_SIZE, BOX_SIZE, BOX_THICKNESS)))



/* Begin of rendering functions declaration */
float map(vec3 p);
vec3 raymarch(vec3 origin, vec3 dir);
vec3 raymarch32(vec3 origin, vec3 dir);
vec3 getNormal(vec3 p);
vec3 getColor(vec3 dir, vec3 p, vec3 normal);
/* End of rendering functions declaration */

/* Begin of geometric/math functions declaration */
vec2 rotate(vec2 p, float angle);
float rand(vec2 n);
float noise(vec2 n);
/* End of geometric/math functions declaration */


/* Begin of volumes distance functions declaration */
float sdSphere(vec3 p, float r);
float sdBox(vec3 p, vec3 b);
/* End of volumes distance functions declaration */

/* Begin of transform functions declaration */
vec3 hsv2rgb(vec3 c);
/* End of transform functions declaration */


/* Begin of the definition of global variables */


float fov = 100.; // Fake fov :*

float viewRot = mod(time, 120.*PI)*.1 ;
vec3 origin = vec3(INF/3.5*cos(viewRot), INF/16.*sin(time*.1), INF/3.5*sin(viewRot));
vec3 lightPosition = vec3(cos(-time*.45)*.5*INF, INF/6., sin(-time*.45)*.5*INF);

int object = 0;
float acc_density = 0.;

/* End of the definition of global variables */

void main( void ) {
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy) - vec2(.5);
		
	uv.x *= resolution.x/resolution.y;
	
	uv.xy*=fov/45.;
	
	
	vec3 dir = normalize(vec3(uv, 1.));
	dir.xz = rotate(dir.xz, viewRot+ PI/2.  );
	
	vec3 hit = raymarch(origin, dir);
	vec3 normal = getNormal(hit.xyz);
	
	
	vec3 p = hit;
	if(BOX_DE < EPSILON){
		object = 1;
	}
	
	vec3 color = getColor(dir, hit.xyz, normal);
	
	dir = refract(dir, normal, 0.9); 
	
	#ifdef HOLOGRAM
		float incr = BOX_THICKNESS/4.;
	#else
		float incr = BOX_THICKNESS/16.;
	#endif
	if(object!=0){
		acc_density = 0.;
		for(int n = 0; n < 64; n++){
			hit = hit.xyz + dir*incr;
			
			color = mix(color, getColor(dir, hit, getNormal(hit)), clamp(1.-acc_density, 0., 1.));
			if(BOX_DE > EPSILON){
				break;
			}
		}
	
		dir = refract(dir, normal, 1.1); 
		hit = raymarch32(hit+dir*10., dir);
		normal = getNormal(hit.xyz);
		
		object = 0;
		
		color = mix(color, getColor(dir, hit, normal), clamp(1.-acc_density, 0., 1.)*.995);
		
		
	
	}
	
	
	color = pow(max(color, vec3(0.)), vec3(1.0 / 1.2));
	gl_FragColor = vec4(color, 1.0 );

}




vec3 raymarch(vec3 origin, vec3 dir){
	float d;
	float dist;
	for(int i = 0; i < 128; i++){
		d = map(origin);
		if(d < EPSILON){
			dist = float(i);
			break;
		}
		origin+=dir*d*.6;
	}
	return origin;
}


vec3 raymarch32(vec3 origin, vec3 dir){
	float d;
	float dist;
	for(int i = 0; i < 32; i++){
		d = map(origin);
		if(d < EPSILON){
			dist = float(i);
			break;
		}
		origin+=dir*d;
	}
	return origin;
}


vec3 getNormal(vec3 p){
  	vec3 n;
  	n.x = map(vec3(p.x+EPSILON, p.y, p.z));
  	n.y = map(vec3(p.x, p.y+EPSILON, p.z));
  	n.z = map(vec3(p.x, p.y, p.z+EPSILON));
  	return normalize(n-map(p));
}
#ifdef ALT_DENSITY
	
	float boxDensity(vec3 p){
		// Put any volume describing function here :)))))
		return clamp(cos(p.x*10.)*cos(p.y*10.)*cos(p.z*10.), 0., 1.)*.25;
	}
#else
	float boxDensity(vec3 p){
		return clamp(noise(p.xy*4.)*noise(vec2(p.y*7., p.z*15.))*noise(vec2(p.x*7., p.z*15.))-.175, 0., 1.)*.25;
	}
#endif

vec3 getColor(vec3 dir, vec3 p, vec3 normal){
	vec3 color = abs(normal);
	if(object == 1){
		float weight = boxDensity(p);
		#ifdef ENABLE_COLORS
			color = hsv2rgb(vec3(weight*10.+time*.05, 1., 1.));
		#else
			color = vec3(weight);
		#endif
		acc_density+=weight;
	} else {
		color = vec3(1.);
		float shade = clamp(dot(normal, normalize(lightPosition-p)), 0., 1.);
		shade = shade*.5+.5;
		shade*=shade*shade;
		shade *= 1.-distance(lightPosition, p)*.5/INF;
		color*=shade;
	}
	return color;
}



float map(vec3 p){
	float d = -sdBox(p, vec3(INF, INF/2., INF));
	d = min(d, BOX_DE);
	
	return d;
}

float sdSphere(vec3 p, float r){
	return length(p) - r;	
}



float sdBox(vec3 p, vec3 b){
	vec3 d = abs(p) - b;
  	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

vec2 rotate(vec2 p, float angle){
	return vec2(p.x*cos(angle)-p.y*sin(angle), p.y*cos(angle)+p.x*sin(angle));
}


float sfract(float n){
    	return smoothstep(0.0,1.0,fract(n));
}

float rand(vec2 n){
 	return fract(abs(sin(dot(n,vec2(5.3357,-5.8464))))*256.75+0.325);   
}

float noise(vec2 n){
	float h1 = mix(rand(vec2(floor(n.x),floor(n.y))),rand(vec2(ceil(n.x),floor(n.y))),sfract(n.x));
	float h2 = mix(rand(vec2(floor(n.x),ceil(n.y))),rand(vec2(ceil(n.x),ceil(n.y))),sfract(n.x));
    	float s1 = mix(h1,h2,sfract(n.y));
    	return s1;
}

// http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
	
