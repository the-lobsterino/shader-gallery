#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const float RETICULATION = 0.8;  // strenght of dust texture
const float NB_ARMS = 4.;       // number of armsぉぉｌ

//const float ARM = 3.;         // contrast in/out arms
const float COMPR = 3.0;         // compression in arms
const float SPEED = 5.0;
const float GALAXY_R = 1./2.;
const float BULB_R = 1./1.;
const vec3 GALAXY_COL = vec3(.9,.9,1.); //(1.,.8,.5);
const vec3 BULB_COL   = vec3(1.,.2,.2);
const vec3 SKY_COL    = .5*vec3(.1,.1,.8);
		
#define Pi 3.1415927
	float t = time;

// --- base noise
float tex(vec2 uv) 
{
	float n = texture2D(backbuffer,uv).r;
	
#define MODE 3  // kind of noise texture
#if MODE==0         // unsigned
	#define A 2.
	return n;
#elif MODE==1       // signed
	#define A 3.
	return 2.*n-1.;
#elif MODE==2       // bulbs
	#define A 3.
	return abs(2.*n-1.);
#elif MODE==3       // wires
	#define A 1.5
	return 1.-abs(2.*n-1.);
#endif
}


// --- perlin turbulent noise + rotation
float noise(vec2 uv)
{
	float v=0.;
	float a=-SPEED*t, co=cos(a),si=sin(a); 
	mat2 M = mat2(co,-si,si,co);
	const int L = 7;
	float s=1.;
	for (int i=0; i<L; i++)
	{
		uv = M*uv;
		float b = tex(uv*s);
		v += 1./s* pow(b,RETICULATION); 
		s *= 2.;
	}
	
    return v/2.;
}


void main(void)
{
	vec2 uv = gl_FragCoord.xy/resolution.y-vec2(.8,.5);
	vec3 col;
	
	// spiral stretching with distance
	float rho = length(uv); // polar coords
	float ang = atan(uv.y,uv.x);
	float shear = 2.*log(rho); // logarythmic spiral
	float c = cos(shear), s=sin(shear);
	mat2 R = mat2(c,-s,s,c);

	// galaxy profile
	float r; // disk
	r = rho/GALAXY_R; float dens = exp(-r*r);
	r = rho/BULB_R;	  float bulb = exp(-r*r);
	float phase = NB_ARMS*(ang-shear);
	// arms = spirals compression
	ang = ang-COMPR*cos(phase)+SPEED*t;
	uv = rho*vec2(cos(ang),sin(ang));
	// stretched texture must be darken by d(new_ang)/d(ang)
	float spires = 3.+NB_ARMS*COMPR*sin(phase);
	// pires = mix(1.,sin(phase),ARM);
	dens *= .01*spires;	
	
	// gaz texture
	float gaz = noise(.13*1.2*R*uv);
	float gaz_trsp = pow((1.-gaz*dens),1.);

	// stars
	//float a=SPEED*t, co=cos(a),si=sin(a); 
	//mat2 M = mat2(co,-si,si,co);
	// adapt stars size to display resolution
	vec3 texture = texture2D(backbuffer,uv).rgb;
	float ratio = .72;
	float stars1 = texture2D(backbuffer,ratio*uv+.5).r, // M*uv
	      stars2 = texture2D(backbuffer,ratio*uv+.5).r,
		  stars = pow(2.0-(1.-stars1)*(6.-stars2),2.);
	
	//stars = pow(stars,5.);
	
	// mix all	
	col = mix(SKY_COL,
			  gaz_trsp*(1.14*GALAXY_COL) + 1.4*stars, 
			  dens);
	col = mix(col, 1.3*BULB_COL, bulb);
		
	gl_FragColor = vec4(col,1.);
}