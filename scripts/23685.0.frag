#ifdef GL_ES
precision mediump float;
#endif

////////////////////////////////
//          VRG corp	      //
//            Wow,	      //
//      Kloumpty Kloumpta     //
////////////////////////////////
//
// Trying to make some simple landscape
// Added some naive stereoscopy :DDDD
// More madness !
// Must clean :(


/* Soundtrack :
	https://www.youtube.com/watch?v=6Ojujkr7E38 !
*/

#define BEGIN_OF_THE_OPTIONS
	
//#define STEREO /* Remove double slash to add parralel stereoscopy ( http://www.vision3d.com/3views.html ) */
//#define MADNESS /* Remove double slash  to add madness */
//#define PSYKY /* Remove double slash to activate the Psykyzity !1!1!11!11! */

#define END_OF_THE_OPTIONS


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define INF  20.
#define EPSILON  0.0043543454301
#define PI  3.14159265359

#ifdef PSYKY
	#define FISHEYE  2.25
#else
	#define FISHEYE  .25
#endif


#define SKY_DE -sdSphere(p - vec3(0., -INF/2., 0.), INF)
#define GROUND_DE sdBox(p - vec3(0., -.5+.2*(cos(p.x*30./INF)+sin(p.z*30./INF))*INF/20., 0.), vec3(INF, .3, INF))
#define WATER_DE sdBox(p - vec3(0., -.75+.01*(cos(p.x*200./INF)+sin(p.z*200./INF))*INF/20., 0.), vec3(INF, .3, INF))
	
#ifdef MADNESS
	const vec3 MARACAS_MOD = vec3(5.*20./INF);
	// incorrect maracas repetition :(
	#define MARACAS_P mod(p, MARACAS_MOD)-.5*MARACAS_MOD 
	#define MARACAS_SPEED 2.
#else
	#define MARACAS_P p
	#define MARACAS_SPEED 1.
#endif
	
#define MARACAS_A_START (vec3(rotate(vec2(.0, 1.), -.1*cos(demotime*200.)), 0.)- vec3(-1.1, 0., 0.))*INF/20. 
#define MARACAS_A_END (vec3(rotate(vec2(.1, 2.), .5*cos(demotime*300.)), 0.)- vec3(-1.1, 0., 0.))*INF/20.
#define MARACAS_A_SIZE .25*(.5+.5*(distance(MARACAS_P, MARACAS_A_START)))*20./INF
#define MARACAS_A_DE sdCapsule(MARACAS_P, MARACAS_A_START, MARACAS_A_END, MARACAS_A_SIZE) 

#define MARACAS_B_START (vec3(rotate(vec2(.0, 1.), .1*cos(demotime*200. + PI/2.)), 0.)- vec3(1.1, 0., 0.))*INF/20. 
#define MARACAS_B_END (vec3(rotate(vec2(.1, 2.), -.5*cos(demotime*300.+ PI/2.)), 0.)- vec3(1.1, 0., 0.))*INF/20.
#define MARACAS_B_SIZE .25*(.5+.5*(distance(MARACAS_P, MARACAS_B_START)))*20./INF
#define MARACAS_B_DE sdCapsule(MARACAS_P,  MARACAS_B_START, MARACAS_B_END, MARACAS_B_SIZE)   


/* Begin of the definition of global variables */
float demotime = MARACAS_SPEED*mod(time, 128.)/32.;
#ifdef PSYKY
	float daytime = cos(mod(demotime*1., 1.)*2.*PI)*.5+.5;
#else 
	#ifdef MADNESS
		float daytime = cos(mod(demotime*1.5, 1.)*2.*PI)*.5+.5;
	#else
		float daytime = mod(demotime, 1.);
	#endif
#endif
//float daytime = .5;

const float skyDistance = 10.;
vec3 sunPosition = vec3(sin(daytime*2.*PI - PI/1.), cos(daytime*2.*PI - PI/1.), 0.)*INF*skyDistance;
/* End of the definition of global variables */

/* Begin of rendering functions declaration */
float map(vec3 p);
vec3 raymarch(vec3 origin, vec3 dir);
vec3 raymarch32(vec3 origin, vec3 dir);
vec3 getNormal(vec3 p);
vec3 getColor(vec3 dir, vec3 p, vec3 normal);
float getShade(vec3 p, vec3 normal);
/* End of rendering functions declaration */

/* Begin of geometric/math functions declaration */
vec2 rotate(vec2 p, float angle);
float rand(vec2 n);
float noise(vec2 n);
/* End of geometric/math functions declaration */


/* Begin of volumes distance functions declaration */
float sdSphere(vec3 p, float r);
float sdBox(vec3 p, vec3 b);
float sdCapsule( vec3 p, vec3 a, vec3 b, float r );

/* End of volumes distance functions declaration */

/* Begin of transform functions declaration */
vec3 opCRep(vec3 p, vec3 rep, vec3 size);
/* End of transform functions declaration */

float fov = 90.; // Fake fov :*

#ifdef MADNESS
	float viewRot = cos(.25*daytime*2.*PI )*.5 + cos(.125*daytime*2.*PI )*16.;
	vec3 origin = vec3(0., INF/40., -INF/2.*cos(.25*daytime*2.*PI ));
#else
	float viewRot = cos(.5*daytime*2.*PI )*.5 ;
	vec3 origin = vec3(0., INF/40., -INF/2.);
#endif
void main( void ) {
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	if(uv.x < daytime && gl_FragCoord.y < 10.){
		gl_FragColor = vec4(1.);
		return;
	}
	uv -= vec2(.5);

	#ifdef STEREO
		if(uv.x < .0){
			uv.x +=.25;
			viewRot -= .001*PI;
			origin.x-=INF/200.;
		} else {
			uv.x -=.25;
			viewRot += .001*PI;
			origin.x+=INF/200.;
		}
	#endif
		
	uv.x *= resolution.x/resolution.y;
	
	#ifdef STEREO
		if(length(uv.xy) < .005){
			gl_FragColor = vec4(1.);
			return;
		}
	#endif
	uv.xy*=fov/45.;
	
	
	vec3 dir = normalize(vec3(uv, 1.));
	dir.z-=length(uv.xy) * (FISHEYE);
	#ifdef MADNESS
		dir.xy = rotate(dir.xy, .125*cos(demotime*50.));
	#endif
	dir.xz = rotate(dir.xz, viewRot*PI );
	
	vec3 hit = raymarch(origin, dir);
	vec3 normal = getNormal(hit.xyz);
	vec3 color = getColor(dir, hit.xyz, normal);
	
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
		origin+=dir*d;
	}
	return origin;
}


vec3 raymarch32(vec3 origin, vec3 dir){
	float d;
	float dist;
	for(int i = 0; i < 128; i++){
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

float getCloudWeight(vec2 p){
	return 1.-(noise(p/2.+ vec2(-daytime*4., 0.)*4.)*.5+.5*noise(p+ vec2(daytime*4.)*4.)*noise(p));
}

vec3 getSkyColor(vec3 p, vec3 normal){
	
	const vec3 skyColorA = vec3(100.0, 5.7, 0.9);
	const vec3 skyColorB = vec3(561.0, 15.0, 0.6);
	
	const vec3 cloudColorA = vec3(.955, .35, .0);
	const vec3 cloudColorB = vec3(.3, .2, .1);
	
	
	float shade = getShade(p, normalize(-p));
	vec2 sky = 10.*p.xz/INF ;
	sky*=4.-6.*p.y/INF;
	
	vec3 cloudColor;
	vec3 skyColor = vec3(.2, .5, 1.);
	
	float inSun = clamp(1.-smoothstep(0.00, 0.005, .9975-shade), 0., 1.);
	float inSunHalo = clamp(1.-smoothstep(0.00, 0.06, .9700-shade), 0., 1.);
	
	skyColor = mix(skyColor, mix( skyColorA, skyColorB, inSun), inSun);
	
	float cloudWeight = getCloudWeight(sky) + inSunHalo*mix(0.0, .9, clamp(daytime-.5, 0. ,1.));
	float cloudColorWeight = (smoothstep(0., cloudWeight, getCloudWeight(sky + normalize(sky)*4.)) - inSunHalo)*clamp(2.-daytime*2., 0., 1.);
	cloudColor = mix(cloudColorA, cloudColorB, cloudColorWeight);
	
	
	return mix(skyColor, cloudColor, step(.5, cloudWeight)*(cloudWeight-.5));
}
vec3 getGroundColor(vec3 p){
	const vec3 groundColorA = vec3(0., 1., 0.);
	const vec3 groundColorB = vec3(.25, .5, .25);
	vec2 ground = 3000.*p.xz/INF;
	float groundWeight = noise(ground);
	return mix(groundColorA, groundColorB, clamp(groundWeight, 0., 1.));
}

vec3 getWaterColor(vec3 p, vec3 dir, vec3 normal){
	const vec3 groundColorA = vec3(0., 0., 1.);
	const vec3 groundColorB = vec3(.25, .25, .5);
	vec2 ground = 3000.*p.xz/INF;
	float groundWeight = noise(ground);
	
	vec3 sky_hit = raymarch32(p, reflect(dir, normal));
	vec3 sky_normal = getNormal(sky_hit.xyz);
	vec3 sky_color = getSkyColor(sky_hit.xyz, sky_normal);
	return mix(mix(groundColorA, groundColorB, clamp(groundWeight, 0., 1.)), sky_color, daytime*2.);
}
#ifdef PSYKY
	vec3 getColor(vec3 dir, vec3 p, vec3 normal){
		vec3 color;
		float shade = getShade(p, normal);
		color = vec3(cos(p.x)*.5+.5, cos(p.y)*.5+.5, cos(p.z*200.)*.5+.5);
		shade = clamp(max(shade, abs(daytime-.5)*4.), 0., 1.);
		color = mix(color, mix(color, vec3(0.05, 0.05, .1), .5), clamp(shade, 0., 1.));
		color*= clamp(length(getSkyColor(p, normal))-.25, 0., 1.);
		color*= 2.*distance(origin, p)/INF;
		return color;
	}
#else
	vec3 getColor(vec3 dir, vec3 p, vec3 normal){
		vec3 color;
		float shade = getShade(p, normal);
		if(SKY_DE < EPSILON){
			color =  getSkyColor(p, normal);
		} else if(WATER_DE < EPSILON){
			color = getWaterColor(p, dir, normal);
			shade = clamp(max(shade, abs(daytime-.5)*4.), 0., 1.);
			color = mix(color, mix(color, vec3(0.05, 0.05, .1), .85), clamp(shade, 0., 1.));
		}else{ 
			if(MARACAS_A_DE < EPSILON){
				color = abs(mix(normal, vec3(1.)-normal,  smoothstep(-0.25, .25, cos(500.*distance(p, MARACAS_A_START)/INF))));
			} else if(MARACAS_B_DE < EPSILON){
				color = abs(mix(normal, vec3(1.)-normal,  smoothstep(-0.25, .25, cos(500.*distance(p, MARACAS_B_START)/INF))));
			} else {
				color = getGroundColor(p);
			}
			shade = clamp(max(shade, abs(daytime-.5)*4.), 0., 1.);
			color = mix(color, mix(color, vec3(0.05, 0.05, .1), .85), clamp(shade, 0., 1.));
			color*= clamp(length(getSkyColor(p, normal))-.25, 0., 1.);
		}
		return color;
	}

#endif

float getShade(vec3 p, vec3 normal){
	vec3 rayAngle = normalize(sunPosition - p);
	return dot(rayAngle, -normal);
}



/* Begin of objects distance functions declaration */

/* End of objects distance functions declaration */





/* Begin of scenes distance functions declaration */

/* End of scenes distance functions declaration */



float map(vec3 p){
	float d = SKY_DE;
	d = min(d,  GROUND_DE);
	d = min(d,  WATER_DE);
	d = min(d,  MARACAS_A_DE);
	d = min(d,  MARACAS_B_DE);
	
	
	return d;
}



vec3 opCRep(vec3 p, vec3 rep, vec3 size){
	return mod(p+size/2., rep);
}


float sdSphere(vec3 p, float r){
	return length(p) - r;	
}



float sdBox(vec3 p, vec3 b){
	vec3 d = abs(p) - b;
  	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdCapsule( vec3 p, vec3 a, vec3 b, float r ){
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
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
	
