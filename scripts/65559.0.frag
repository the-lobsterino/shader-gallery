#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;


//work in progress - best at .5 resolution//


#define LEVELS	 	7.   
#define TARGET		.075
#define THRESHOLD  	pow(2., -8.)
#define TOLERANCE	1.
#define SOURCE		3
#define BOUND
#define MOUSE_INPUT	true

struct tri
{
	vec2	uv;
	vec3	uvw;
	float	index;
	vec2	address;
	bool	parity;
};

	
struct simplex
{
	float 	level;
	float 	magnitude;
	float 	entropy;

	vec2 	uv;
	vec3	uvw;
	
	vec3 	normal;
	vec3 	difference;
	vec3 	gradient;
	
	bool	inside;
	bool 	sign_change;
	bool 	entropy_limit;
	
	vec2	vertex[4];
	vec4	sample[4];
	
	vec4 	parent;
	vec4	 child[4];
	
	float   error;
	tri 	face;
}s;


float 	map(vec2 uv);
void 	search(inout simplex s);
vec4 	read(vec2 uv);
vec4 	write(simplex s, vec2 uv);
vec3 	barycentric(vec2 uv, float scale);
vec2 	cartesian(vec3 uvw, float scale);	
bool 	winding(vec3 uvw);
vec3 	wind(vec3 uvw);
vec3 	unwind(vec3 uvw);

float 	index(vec2 face, float power);
vec2 	address(vec2 face, float power);
vec2	memory_address(float index, vec2 origin, vec2 allocation);
float	hash(float v);

vec4 	clear(vec4 result);	
vec2	aspect(vec2 uv);
float	interpolate(float a, float b, float x);
float	irnd(vec2 p);
float	fbm(vec2 p);


#define DEBUG
#ifdef DEBUG
	//#define DEBUG_UV		1.
	//#define DEBUG_UVW		1.
	//#define DEBUG_FACE_UV		1.
	//#define DEBUG_FACE_UVW	1.
	#define DEBUG_GRID		.75
	//#define DEBUG_LATTICE		.05
	////#define DEBUG_VERTEX		.0125
	//#define DEBUG_EDGE		.005
	//#define DEBUG_NEIGHBOR		.025
	//#define DEBUG_NORMAL		.0025
	//#define DEBUG_TANGENT		.0025
	//#define DEBUG_SIGN_CHANGE	1.
	//#define DEBUG_ENTROPY		1.

	//#define DEBUG_PRINT
	#ifdef DEBUG_PRINT
		#define DEBUG_PRINT_INDICES
		#define DEBUG_PRINT_ADDRESS
	#endif

	#define DEBUG_SOURCE_FUNCTION	2.
	//#define DEBUG_SOURCE_SAMPLE	1.

	//#define DEBUG_VISUALIZE_SOURCE_INPUT_ONLY
	
	struct debug_global
	{
		float 	grid;
		float 	normal;
		float 	tangent;
		float 	index;
		float 	address;
		float	sign_change;
		float 	entropy;
		float 	vertex;
		float 	sample;
		float	scale;
		vec2	cartesian;
		vec3	barycentric;
		vec3 	edge;
		vec3	neighbor;
		vec3 	lattice;
	} d;

	void 	debug_simplex(simplex s);
	void 	debug_print(simplex s);
	vec4 	debug(simplex s);
	float 	extract_bit(float n, float b);
	float 	sprite(float n, vec2 p);
	float 	digit(float n, vec2 p);	
	float 	print_index(float index, vec2 position);
	float	line(vec2 p, vec2 a, vec2 b, float w);
	vec3 	hsv(in float h, in float s, in float v);
#endif


void main(void) 
{
	s.uv	= gl_FragCoord.xy/resolution.xy;
	
	//generate source input and write it to the w channel for reading from the buffer on the next frame
	float source		= map(s.uv);

	vec4 result = vec4(0.);
	result.w		= source;
	
	//iterative top down search
	s.error = 0.;	
	for(int i = 0; i <= int(LEVELS); i++)
	{
		s.level 		= float(i);

		search(s);
		
		//add error from this pass and break if the threshold is exceeded
		float weight		= pow(2., s.level);
		s.error 		+= length(TARGET-s.magnitude) * weight;
		if(s.error > TOLERANCE) { break; }
	}
	
	#ifdef DEBUG
	//visualize results of debugging
	result 			+= debug(s);
	#endif

	
	//clear the renderbuffer if the mouse is in the bottom left corner
	result 			*= clear(result);
	
	
	gl_FragColor		= result;
}//sphinx


// SEARCH
//processes a simplex search node on the triangle lattice
void search(inout simplex s) 
{
	//transform to barycentric coordinates
	float power			= pow(2., s.level);
	s.uvw          		    	= barycentric(s.uv, power);


	//check to see if the triangle is facing up or down
	vec3 uvw_index			= floor(s.uvw);
	s.face.parity 			= mod(uvw_index.x, 2.) == 0. ^^ mod(uvw_index.y, 2.) == 0. ^^ mod(uvw_index.z, 2.) == 0.;
	
	
	//generates the face uvw coordinates and the uv coordinate of it's origin
	s.face.uvw			= fract(s.uvw);
	s.face.uv			= cartesian(uvw_index, power);
	
	
	//generate face id and unique memory address
	s.face.index			= index(s.face.uv, power);
	s.face.address			= address(s.face.uv, power);
		
	
	//position vertices on the corners of this face
 	vec2 offset			= vec2(1.,0.);
 	float winding			= s.face.parity ? -1. : 1.;	
	s.vertex[0]			= cartesian(offset.xyy, power) * winding;
	s.vertex[1]			= cartesian(offset.yxy, power) * winding;
	s.vertex[2]			= cartesian(offset.yyx, power) * winding;
	
	
	//sample at each vertex
	s.sample[0]			= read(s.face.uv + s.vertex[0]);	
	s.sample[1]			= read(s.face.uv + s.vertex[1]);	
	s.sample[2]			= read(s.face.uv + s.vertex[2]);	
	

	//get a gradient from the magnitudes at the face vertices
	vec3 gradient			= vec3(0.);
	gradient[0]			= s.sample[0][SOURCE];
	gradient[1]			= s.sample[1][SOURCE];
	gradient[2]			= s.sample[2][SOURCE];
	
	//calculate a normal
	vec3 normal 			= normalize(gradient);
	normal				= length(gradient) - TARGET > TARGET ? -normal : normal;
	
	
	//create a fourth vertex for sampling based on the results of whatever search metrics 
	//(the result of processing the gradient and picking the most likely point for where the threshold value should be)
	vec3 target_uvw			= normalize(gradient*power);
	target_uvw			= length(gradient) - TARGET > TARGET ? -target_uvw : target_uvw;
	
	
	//clamp the result to the bounds of this triangle face (bugged)
	#ifdef BOUND
	vec3 b 				= abs(target_uvw);
	b				= clamp(b, .00001, 2.);
	float maxima			= max(b.x, max(b.y, b.z));
	vec2 bound			= maxima == b.x ? abs(b.x) * normalize(b.yz) : maxima == b.y ? abs(b.y) * normalize(b.xz) : abs(b.z) * normalize(b.xy);
	b				= maxima == b.x ? vec3(b.x, bound) : maxima == b.y ? vec3(bound.x, b.y, bound.y) : vec3(bound, b.z);
	target_uvw 			= b;//length(target_uvw+b) > 1.  ? b : target_uvw;
	target_uvw			= length(gradient) - TARGET > TARGET ? -target_uvw : target_uvw;
	#endif
	

	//transform position to vertex uv for sampling
	s.vertex[3] 			= cartesian(target_uvw, power) * winding;
	
	
	//final directed sample
	s.sample[3]			= read(s.face.uv + s.vertex[3]);
	
	
	//magnitude of face 
	float magnitude			= s.sample[3][SOURCE];

		
	//assign to struct
	//this is the point where upper stage values get carried down (which is yet to be factored back in, so I'm just assigning)
	s.normal 			= magnitude > s.magnitude ? s.normal : normal;
	s.gradient			= gradient;
	s.magnitude			= magnitude;
	
	//conditional tests
	s.inside	 		= length(TARGET-s.magnitude) < THRESHOLD || s.inside;
	
	
	//if(floor(s.uv*resolution)+.5/resolution == floor(s.face.uv*resolution)+.5/resolution && s.inside)
	//{
	//	s.parent = vec4(s.vertex[3], s.magnitude, 0.);
	//}
	
	#ifdef DEBUG
	//debugging visualization pass
	debug_simplex(s);
	#endif
}



vec3 barycentric(vec2 uv, float scale)
{	
	uv		*= scale;
	uv 		*= resolution.xy/resolution.yy;
//	uv.y		/= sqrt(3.);
	uv.y		/= 1.73205080757;
	vec3 uvw	= vec3(uv.y - uv.x, uv.y + uv.x, -(uv.y + uv.y));
//	uvw		*= cos(pi/6.);
	uvw		*= .86602540358;
	return wind(uvw);
}


vec2 cartesian(vec3 uvw, float scale)
{
	uvw 		= unwind(uvw);
	uvw.xy		-= uvw.z;
//	uvw.xy		/= sqrt(3.);
	uvw.xy		/= 1.73205080757;	
	
	vec2 uv 	= vec2(uvw.y - uvw.x, uvw.y + uvw.x);		
//	uv.y		*= cos(pi/6.)/1.5;
	uv.y		*= .57735026919;
	uv 		/= resolution.xy/resolution.yy;
	uv		/= scale;
	return uv;
}

bool winding(vec3 uvw)
{
	return mod(dot(floor(uvw), vec3(1.)), 2.) == 0.;
}


vec3 wind(vec3 uvw)
{
	return winding(uvw) ? 1.-uvw.zxy : uvw;
}


vec3 unwind(vec3 uvw)
{
	return winding(uvw) ? 1.-uvw.yzx : uvw;
}

//indices need to be offset, such that no index from the first power collides with the second
//so, level 2 beings where level 1 left off, and so forth
//these are the offsets, but I dont know the generator yet...
//looks something like 3 * pow(2, n) * pow(2., somethingelse)
//2
//12
//50
//199
//785
//3106
//12359
//49296
//196899

float index(vec2 face, float power)
{
	vec2 address = address(face, power); 
	return address.x + address.y * power * 3. + 1. * address.y;
}

	
vec2 address(vec2 face, float power)
{
	vec2 address	= vec2(0.);
	address.x	= floor(face.x * power * (4.*atan(1.)));
	address.y	= floor(face.y * power);
	return address;
}


vec2	memory_address(float index, vec2 origin, vec2 allocation)
{
	vec2 address	= vec2(0.);
	address.x	= mod(index, floor(allocation.x));
	address.y	= floor((index-address.x)/allocation.y);
	address 	+= origin;	
	address		= clamp(address, origin, origin+allocation);	
	return address;
}


//reads a sample at the uv coordinate
vec4 read(vec2 uv)
{
	uv		= floor(uv * resolution)/resolution + .5/resolution;
	vec4 sample 	= texture2D(renderbuffer, uv);
	
	return sample;
}


//todo: writes whatever to the uv coordinate
vec4 write(simplex s, vec2 uv)
{
	return s.parent;
}


//clears the renderbuffer if the mouse is in the bottom left corner
vec4 clear(vec4 result)
{
	return mouse.x + mouse.y < .02 ? result * 0. : result;
}


//returns a randomized number, 0-1, white frequency for domain ~0-1
float hash(float v)
{
    return fract(fract(v*9876.5432)*(v+v)*12345.678);
}
//END SEARCH


//INPUT FUNCTION 
//an implicit function map generated for testing
float map(vec2 uv)
{
	vec2 position		= aspect(uv);
	vec2 mouse_position	= MOUSE_INPUT ? aspect(mouse) : uv.x < .5 ? vec2(.5) : vec2(1.4, .5);
	float mouse_distance	= length(position-mouse_position);
	float noise		= fbm(time*16. + position*512.);
	
	float noisy_ring	= pow((mouse_distance-noise*.5)+.5, 3.);
	
	float ring		= mouse_distance - .025;
	
	return mouse.x < .5 ? ring : noisy_ring;
}

//formats uv coordinates to the screen aspect ratio
vec2 aspect(vec2 uv)
{
	return uv * resolution.xy/resolution.yy;
}

//used for generating noisy input for testing
const int oct = 8;
const float per = 0.5;
const float PI = 3.1415926;
const float cCorners = 1.0/16.0;
const float cSides = 1.0/8.0;
const float cCenter = 1.0/4.0;


//interpolates a and b across x using a cosine curve
float interpolate(float a, float b, float x){
	float f = (1.0 - cos(x*PI))*0.5;
	return a * (1.0 - f) + b * f;
}


//returns a random number
float rnd(vec2 p){
	return fract(sin(dot(p, vec2(12.9898, 78.233)))*43758.5453);
}


//generates a randomized set of values for lattice points and the domain
float irnd(vec2 p){
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec4 v = vec4(rnd(vec2(i.x, i.y)),
		     rnd(vec2(i.x+1.0, i.y)),
		     rnd(vec2(i.x, i.y+1.0)),
		     rnd(vec2(i.x+1.0, i.y+1.0)));
	return interpolate(interpolate(v.x, v.y, f.x), interpolate(v.z, v.w, f.x), f.y);
}


//fractal harmonic brownian motion - pink spectrum
float fbm(vec2 p){
	float t = 0.0;
	for(int i = 0; i < oct; i++){
		float freq = pow(2.0, float(i));
		float amp = pow(per, float(oct-i));
		t += irnd(vec2(p.x/freq, p.y/freq))*amp;
	}
	return t;
}
//END INPUT FUNCTION


//DEBUG VISUALIZATION
#ifdef DEBUG

float extract_bit(float n, float b)
{
	n = floor(n);
	b = floor(b);
	b = floor(n/pow(2.,b));
	return float(mod(b,2.) == 1.);
}

float sprite(float n, vec2 p)
{
	p = floor(p);
	float bounds = float(all(lessThan(p, vec2(3., 5.))) && all(greaterThanEqual(p,vec2(0,0))));
	return extract_bit(n, (2. - p.x) + 3. * p.y) * bounds;
}

float digit(float n, vec2 p)
{
	n = mod(floor(n), 10.0);
	if(n == 0.) return sprite(31599., p);
	else if(n == 1.) return sprite( 9362., p);
	else if(n == 2.) return sprite(29671., p);
	else if(n == 3.) return sprite(29391., p);
	else if(n == 4.) return sprite(23497., p);
	else if(n == 5.) return sprite(31183., p);
	else if(n == 6.) return sprite(31215., p);
	else if(n == 7.) return sprite(29257., p);
	else if(n == 8.) return sprite(31727., p);
	else if(n == 9.) return sprite(31695., p);
	else return 0.0;
}

float print_index(float index, vec2 position)
{	
	float offset	= 4.;
	
	float result	= 0.;
	for(int i = 0; i < 8; i++)
	{
		float place	= pow(10., float(i));
		if(index > place || float(i) == 0.)
		{
			result	 	+= digit(index/place, position + vec2(8., 0.));
			position.x 	+= offset;
		}
		else
		{
			break;
		}
		
	}
	return result;
}

float line(vec2 p, vec2 a, vec2 b, float w)
{
	if(a==b)return(0.);
	float d = distance(a, b);
	vec2  n = normalize(b - a);
   	 vec2  l = vec2(0.);
	l.x = max(abs(dot(p - a, n.yx * vec2(-1.0, 1.0))), 0.0);
	l.y = max(abs(dot(p - a, n) - d * 0.5) - d * 0.5, 0.0);
	return step(.125, clamp(smoothstep(w, 0., l.x+l.y), 0., 1.));
}


//generates a color from inputs of hue, saturation and value (a red yellow green blue rainbow from 0.-1.)
vec3 hsv(in float h, in float s, in float v)
{
    return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


//composites debug information for visualization
vec4 debug(simplex s)
{
	vec4 debug 	= vec4(0.);
	
	float map 	= texture2D(renderbuffer, s.uv)[SOURCE];
	
		
	#ifdef DEBUG_UV
	debug.xy = d.cartesian * DEBUG_UV;
	#endif
	
	#ifdef DEBUG_UVW
	debug.xyz = d.barycentric * DEBUG_UVW;
	#endif
	
	#ifdef DEBUG_FACE_UVW
	debug.xyz = s.face.uvw * DEBUG_FACE_UVW;
	#endif

	#ifdef DEBUG_FACE_UV
	debug.xy = s.face.uv;
	#endif
	
	#ifdef	DEBUG_GRID 		
	debug.xyz += d.grid;
	#endif
	
	#ifdef DEBUG_LATTICE
	debug.xyz += d.lattice.xyz;
	#endif	
	
	#ifdef	DEBUG_VERTEX		
	debug.xyz += d.vertex;
	#endif
	
	#ifdef DEBUG_NORMAL
	debug.y += d.normal;
	#endif
	
	#ifdef DEBUG_TANGENT
	debug.xyz += d.tangent * vec3(.5, .5, 1.);
	#endif
	
	#ifdef DEBUG_SOURCE_FUNCTION
	debug.y += float(abs(map - TARGET) + (THRESHOLD*.5) < THRESHOLD) * DEBUG_SOURCE_FUNCTION;
	#endif
	
	#ifdef DEBUG_SOURCE_SAMPLE
	debug.y += 1.-d.sample * DEBUG_SOURCE_SAMPLE;
	#endif
	
	#ifdef DEBUG_NEIGHBOR
	debug.xyz = max(debug.xyz, d.neighbor);
	#endif

	#ifdef DEBUG_EDGE
	debug.xyz = max(debug.xyz + vec3(.25, .25, 0.) * d.edge.z, d.edge);
	#endif

	#ifdef DEBUG_PRINT
	debug_print(s);
	debug.xyz += d.index + d.address;
	#endif

	#ifdef DEBUG_VISUALIZE_SOURCE_INPUT_ONLY
	debug.xyz = vec3(map);
	#endif
	
	return debug;
}

//generates printed debug information
void debug_print(simplex s)
{
	float power		= pow(2., s.level);
	
	float print_index_scale	= (s.level/power*resolution.x/192.);
	vec2 print_index_uv	= floor((gl_FragCoord.xy-s.face.uv*resolution))/print_index_scale;
	print_index_uv.x	-= 10.;
	print_index_uv.y	+= s.level;
	
	#ifdef DEBUG_PRINT_INDICES
	d.index		= print_index(s.face.index, print_index_uv);
	#endif
	
	#ifdef DEBUG_PRINT_ADDRESS
	d.index *= 0.;
	float print_address_scale	= (resolution.x/256.);
	vec2 print_address_uv		=  floor((gl_FragCoord.xy-vec2(1.005, .005)*resolution))/print_address_scale;
	for(int i = 0; i < int(LEVELS); i++)
	{
		
		float power		= pow(2., float(i));
	
		vec3 mouse_uvw		= barycentric(mouse, power);
		vec2 m_uv		= cartesian(floor(mouse_uvw), power);
		float m_index		= index(m_uv, power);
		
		if(m_index == s.face.index && m_uv == s.face.uv)
		{
			d.index		= print_index(s.face.index, print_index_uv);
		}  
		
		d.address		+= print_index(m_index, print_address_uv);
		print_address_uv.y	-= 12.;
	}
	#endif 
	
}

//generates debug information from a single simplex pass
void debug_simplex(simplex s)
{
	float power		= pow(2., s.level);
	float level_scale	= max(s.level * 2., .5);
	vec2 screen_uv		= aspect(s.uv);
	vec2 screen_face	= aspect(s.face.uv);

	#ifdef DEBUG_UV
	d.cartesian 		= cartesian(s.uvw, power);
	#endif

	
	#ifdef DEBUG_UVW
	d.barycentric 		= s.uvw;
	#endif
	
	
	#ifdef DEBUG_GRID
	float width		= .0025*power/2.;
	d.grid			+= float(fract(s.uvw.x) < width || fract(s.uvw.y) < width || fract(s.uvw.z) < width) * DEBUG_GRID;
	#endif
	
	
	#ifdef DEBUG_LATTICE
	d.scale 		= DEBUG_LATTICE/level_scale;
	d.lattice.x		+= float(length(screen_uv-aspect(s.face.uv + s.vertex[0])) < d.scale) * .75;
	d.lattice.y		+= float(length(screen_uv-aspect(s.face.uv + s.vertex[1])) < d.scale) * .75;
	d.lattice.z		+= float(length(screen_uv-aspect(s.face.uv + s.vertex[2])) < d.scale) * .75;
	#endif

	
	#ifdef DEBUG_VERTEX
	d.scale 		=  DEBUG_VERTEX/pow(max(s.level,1.), 1.25);
	d.vertex	 	+= float(length(screen_uv-aspect(s.face.uv + s.vertex[3])) < d.scale) * .75;
	#endif	
	
	
	#ifdef DEBUG_EDGE
	d.scale 		= DEBUG_EDGE/power;
	vec3 edge 		= vec3(0.);
	vec2 origin		= aspect(s.face.uv + s.vertex[3]);
	edge.x			+= line(screen_uv, origin, aspect(s.face.uv + s.vertex[0]), d.scale);
	edge.y			+= line(screen_uv, origin, aspect(s.face.uv + s.vertex[1]), d.scale);
	edge.z			+= line(screen_uv, origin, aspect(s.face.uv + s.vertex[2]), d.scale);
	d.edge 			+= edge * .75;
	#endif
	
	
	#ifdef DEBUG_NEIGHBOR
	d.scale 		= DEBUG_NEIGHBOR/power;	
	vec3 neighbor		= vec3(0.);
	neighbor.x		+= float(length(screen_uv-aspect(s.face.uv + s.vertex[0]/2.)) < d.scale) * .75;
	neighbor.y		+= float(length(screen_uv-aspect(s.face.uv + s.vertex[1]/2.)) < d.scale) * .75;
	neighbor.z		+= float(length(screen_uv-aspect(s.face.uv + s.vertex[2]/2.)) < d.scale) * .75;
	neighbor.xy		+= float(length(screen_uv-screen_face) < d.scale) * .75;
	d.neighbor		+= neighbor * .75;
	vec3 path;
	//path.x		+= line(screen_uv, screen_face, aspect(s.face.uv + s.neighbor_vertex[0]/2.), d.scale);
	//path.y		+= line(screen_uv, screen_face, aspect(s.face.uv + s.neighbor_vertex[1]/2.), d.scale);
	//path.z		+= line(screen_uv, screen_face, aspect(s.face.uv + s.neighbor_vertex[2]/2.), d.scale);
	//d.neighbor 	+= path * .75;	
	#endif
	
	
	#ifdef DEBUG_NORMAL
	d.scale			 = DEBUG_NORMAL/level_scale;
	d.normal 		+= line(screen_face-screen_uv, vec2(0.), aspect(cartesian(s.normal, power))*power, d.scale);
	#endif

	
	#ifdef DEBUG_TANGENT
	d.scale 		= DEBUG_TANGENT/level_scale;
	vec2 tangent		= aspect(cartesian(s.normal, power)).yx * vec2(-1., 1.); 
	tangent			*= power;
	d.tangent 		+= line(screen_face-screen_uv, -tangent, tangent, d.scale);
	#endif
	
	
	#ifdef DEBUG_SIGN_CHANGE
	d.sign_change 		+= float(v.sign_change);
	#endif
		
	
	#ifdef DEBUG_ENTROPY
	d.entropy 		+= entropy/power;
	#endif	
	
	
	#ifdef DEBUG_SOURCE_SAMPLE
	d.sample 		+= (1.-s.sample[3][SOURCE])/max(LEVELS, 2.);	
	#endif	

	
	#ifdef DEBUG_PRINT
	debug_print(s);
	#endif
}
#endif
//END DEBUG VISUALIZATION


//iterative search over an input distance field function (a screen full of data) for the positions of the target value

//test input functions are a ring and ring with fbm noise

//the result (once completed) is an sparse representation of the distance field suitable for compression, among other things
//in 3D, this sort of thing us used to convert voxel data to triangle meshes
//other common applications include computer vision, image upsampling, and ai (hopefully)
//other searches besides distance field gradient descent may be implemented on the same lattice structure

//this implementation uses triangular subdivisions with barycentric coordinates for better spatial coverage with fewer samples
//(bump up the error tolerance to see what happens if the image were completely sampled)

//steps
//1. create a triangle on a lattice across the screen (starting with 4 samples)
//2. sample at the corners
//3. process the corner samples to generate a position for a 4th sample within the face at the most likely position of the target
//4. test the sample to see if it is inside, outside or on the surface contour of the threshold
//5. calculate an error, and subdivide into 4 sub triangles to search within if still within the search error tolerance, else stop

//todo:
//reimplement tree node memory writes (currently this is run once, top down)
//traversal for reconstructing results from tree data alone
//iterative refinement over multiple frames
//reimplement result accumulation across levels
//add additional distance field tests - sign change and entropy
//pid controller for refinement and tree balancing
//transform the lattice across levels and iterations (the next evolution up from this algorithim)

//please leave comments and point out errors or potential improvements
//I've never written one of these before and I don't exactly know what I'm doing ; )
//cbirke@gmail.com
