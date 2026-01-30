#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;


//work in progress - best at .5 resolution//


#define LEVELS	 	6.   
#define TARGET		.0
#define THRESHOLD  	pow(2., -8.)
#define TOLERANCE	3.
#define SOURCE		3
#define BOUND


struct face
{
	vec2 uv;
	vec3 uvw;
	bool parity;
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

	float	index;
	
	vec2[4]	vertex;
	
	vec4 	parent;
	vec4[4] child;
	vec4[4]	sample;

	face 	face;
}s;

vec4	trace(simplex s);
float 	map(vec2 uv);
void 	search(inout simplex s);
vec4 	read(vec2 uv);
vec4 	write(simplex s, vec2 uv);
vec3 	barycentric(vec2 uv, float scale);
vec2 	cartesian(vec3 uvw, float scale);
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
	//#define DEBUG_FACE_UVW	.25
	#define DEBUG_GRID		.125
	//#define DEBUG_LATTICE		.05
	//#define DEBUG_VERTEX		.005
	#define DEBUG_EDGE		.0025
	//#define DEBUG_NEIGHBOR		.025
	//#define DEBUG_NORMAL		.0025
	//#define DEBUG_TANGENT		.0025
	
	//#define DEBUG_SIGN_CHANGE	1.
	//#define DEBUG_ENTROPY		1.
	
	//#define DEBUG_SOURCE_FUNCTION	2.
	//#define DEBUG_SOURCE_SAMPLE	1.

	//#define DEBUG_VISUALIZE_SOURCE_INPUT_ONLY
	
	struct debug_global
	{
		float 	grid;
		float 	normal;
		float 	tangent;
		float 	index;
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
	vec4 	debug(simplex s);
	float	line(vec2 p, vec2 a, vec2 b, float w);
	vec3 	hsv(in float h, in float s, in float v);
#endif


#define ASPECT               	resolution.x/resolution.y
#define PHI                  	.00025
#define EPSILON                 .0001
#define FOV                     3.
#define FARPLANE                32.
#define ITERATIONS              64

#define PI                  	(4.*atan(1.))       
#define TAU                 	(8.*atan(1.))   

struct ray
{
	vec3 origin;
	vec3 position;
	vec3 direction;
	float range;
	float steps;
}; 

ray         view(in vec2 uv);   
ray         emit(ray r);
float       map(in vec3 position);
vec3        derive(in vec3 p);

float       sphere(vec3 position, float radius);
float       cube(vec3 position, vec3 scale);
float       torus( vec3 p, vec2 t );
float       cylinder(vec3 p, float l, float r);
float       cone(vec3 p, float l, vec2 r);
float       icosahedral(vec3 p, float e, float r);
float       partition_noise(vec2 uv);
float       cross(float x);

float       hash(float x);
vec2        hash(vec2 v);

mat2        rmat(in float r);

vec2        format_to_screen(vec2 uv);


void main(void) 
{
	s.uv	= gl_FragCoord.xy/resolution.xy;
	
	//generate source input and write it to the w channel for reading from the buffer on the next frame
	
	vec4 result = vec4(0.);
	vec4 prior	= texture2D(renderbuffer, s.uv);
	//iterative top down search
	float error = -prior.w;	
	for(int i = 0; i <= int(LEVELS); i++)
	{
		s.level 		= float(i);

		search(s);
		
		//result.xyz		+= abs(s.gradient)/LEVELS/2.;		
		
		
		//add error from this pass and break if the threshold is exceeded
		float weight		= pow(2., s.level);
		error 			+= length(TARGET-s.magnitude) * weight;
		if(error > TOLERANCE) { break; }
		
		
	}
	
	#ifdef DEBUG
	//visualize results of debugging
	result 			+= debug(s);
	#endif
	
	

//	if(floor(s.uv*resolution)+.5/resolution == floor(s.face.uv*resolution)+.5/resolution)
//	{
//		s.parent.w	= source;
//		gl_FragColor	= write(s, floor(s.uv*resolution)/resolution+.5/resolution);
//		return;
//	}
	
	
	vec4 source		= trace(s);
	result			+= source;

	//clear the renderbuffer if the mouse is in the bottom left corner
	result 			*= clear(result);
	
	gl_FragColor		= result;
}//sphinx



vec4 trace( simplex s ) 
{
	vec2 uv         	= s.uv;
	ray r           	= view(uv);
	
	
	r               	= emit(r);

	float distanceFog   	= clamp(r.range/FARPLANE, 0., 1.);
	float stepFog       	= clamp(r.steps/float(ITERATIONS), 0., 1.);
	stepFog        	 	= r.steps < 1. ? 1. : stepFog;
	
	vec4 result     	= vec4(0.);
	result          	+= pow(stepFog, 1.25);
	
	
	result.w		= map(r.position)*.5;
	

	return 	 result;
}// sphinx


// SEARCH
//processes a simplex search node on the triangle lattice
void search(inout simplex s) 
{
	//transform to barycentric coordinates
	float power			= pow(2., s.level);
	s.uvw          		    	= barycentric(s.uv, power);

	vec3 uvw_index			= floor(s.uvw);
	s.face.parity 			= mod(uvw_index.x, 2.) == 0. ^^ mod(uvw_index.y, 2.) == 0. ^^ mod(uvw_index.z, 2.) == 0.;
	
	
	//generates the face uvw coordinates and the uv coordinate of it's origin
	s.face.uvw			= fract(s.uvw);
	s.face.uv			= cartesian(uvw_index, power);
	
	
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
	vec3 target_uvw			= normalize(gradient * power);
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
	s.gradient			= s.face.parity ? 1. - gradient : gradient;
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


//converts 3D uvw coordinates to 2D uv coordinates
vec3 barycentric(vec2 uv, float scale)
{
	uv 		*= scale;		
	uv.x 		*= 1.5;	
	uv.y		/= 2.;
	
	vec3 uvw	= vec3(0.);
	uvw.y		=  uv.x - uv.y;
	uvw.z		=    uv.y * 2.;
	uvw.x		=-(uv.x + uv.y);
	
	vec3 index	= floor(uvw);
	bool parity 	= mod(index.x, 2.) == 0. ^^ mod(index.y, 2.) == 0. ^^ mod(index.z, 2.) == 0.;
	uvw 		= parity ? 1.-uvw.yzx : uvw;
	
	return	uvw;
}


//converts 3D uvw coordinates to 2D uv coordinates
vec2 cartesian(vec3 uvw, float scale)
{
	vec3 index	= floor(uvw);
	bool parity 	= mod(index.x, 2.) == 0. ^^ mod(index.y, 2.) == 0. ^^ mod(index.z, 2.) == 0.;
	uvw 		= parity ? 1.-uvw.zxy : uvw;
	
	uvw.yx 		-= uvw.z;//clamp(uvw.z, -2., 2.);

	vec2 uv 	= vec2(0.);		
	uv.x 		=  uvw.y - uvw.x;
	uv.y		= -uvw.y - uvw.x;	
	uv		/= 3.;
	uv 		/= scale;
	
	return uv;
}



//reads a sample at the uv coordinate
vec4 read(vec2 uv)
{
	uv		= floor(uv * resolution)/resolution + .5/resolution;
	vec4 sample 	= texture2D(renderbuffer, uv);
	//sample.w	= map(uv);
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
	vec2 mouse_position	= aspect(mouse);
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


	#ifdef DEBUG_VISUALIZE_SOURCE_INPUT_ONLY
	debug.xyz = vec3(map);
	#endif
	
	return debug;
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
	float width		= .00125*power/2.;
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
	
	
	#ifdef DETECT_SIGN_CHANGE 
//	node_detected = node_detected || sign_change;
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


//overly complex viewing system for modeling
#define SCREEN_LEFT gl_FragCoord.x < resolution.x * .5
#define SCREEN_BOTTOM   gl_FragCoord.y < resolution.y * .5
#define MOUSE_LEFT  mouse.x < .5
#define MOUSE_BOTTOM    mouse.y < .5
#define VIEW_SWITCH mouse.x > .02   
#define PANEL_LEFT  (VIEW_SWITCH ? MOUSE_LEFT : SCREEN_LEFT)
#define PANEL_BOTTOM    (VIEW_SWITCH ? MOUSE_BOTTOM : SCREEN_BOTTOM)
#define UV      VIEW_SWITCH ? (gl_FragCoord.xy/resolution.xy) : fract(2.*(gl_FragCoord.xy/resolution.xy))
#define TOP         vec3( 0.,   7.,   .49)
#define TOP_V       vec3( 0.,    0., .5001)
#define BOTTOM      vec3( 0.,   -7.,   .49)
#define BOTTOM_V    vec3( 0., 	0., .5001)
#define SIDE        vec3(4.5, 	0.,   0.5)
#define SIDE_V      vec3( 0., 	0.,   0.5)
#define BACK        vec3( 0., 	0.,    6.)
#define BACK_V      vec3( 0., 	0., 0.001)
#define QUARTER     vec3(-2.5, 2.5, -2.75)
#define ORIGIN_V    vec3(0., 0., 0.001)
#define TURRET	    vec3(1.5, 0.4, 2.5)
#define TURRET_V    vec3(0., 0., 0.5)

#define VIEWPOSITION    (PANEL_LEFT ? PANEL_BOTTOM ? TOP   : BACK   : PANEL_BOTTOM ? SIDE   : QUARTER)
#define VIEWTARGET      (PANEL_LEFT ? PANEL_BOTTOM ? TOP_V : BACK_V : PANEL_BOTTOM ? SIDE_V : ORIGIN_V)

//#define VIEWPOSITION      SIDE + vec3(0., 0., 2.)
//#define VIEWTARGET        SIDE_V  + vec3(0., 0., -2.)
//#define VIEWPOSITION      TURRET
//#define VIEWTARGET        TURRET_V
//#define VIEWPOSITION      BOTTOM
//#define VIEWTARGET        BOTTOM_V


float map(in vec3 position)
{    
	//panel aware view rotations
	if(true){
		if(PANEL_BOTTOM && PANEL_LEFT)
		{
			position.zy *= rmat(mouse.x*12.56);
		}
		else
		{ 
			position.xz *= rmat(mouse.x*12.56);
		}
	}
	position.z                  	+= 1.5;
	
	float ship                  	= FARPLANE;
	

	//main hulls
	vec3 hull_position          	= position;
	hull_position.x             	= max(abs(position.x),.04);
	
	//laterial insets 
	hull_position.x             	*= hull_position.z > .1     
	&& hull_position.z < 1.1 
	? 1.05 : 1.;

	hull_position.x             	*= hull_position.z > 1.85   
	&& hull_position.z < 2. 
	? 1.025 : 1.;
	
	hull_position.y             	= abs(hull_position.y)*.75+position.z*.001;
	
	
	vec3 hull_scale             	= vec3(1.);
	hull_scale.x                	= position.z*.3+.45, 
	hull_scale.y                	= position.z*.05+.085;
	hull_scale.y               	+= -abs(max(abs(position.x*.87),position.z*.025)*.187);
	hull_scale.z               	= min(hull_position.y+4., 4.);
	hull_scale.z               	+= abs(position.y);
	
	
	//inner hull
	vec3 hull_inner_scale           = hull_scale;
	hull_inner_scale.x          	+= abs(position.x)*.03-.01-position.z * .0005;
	hull_inner_scale.y          	= position.z < 4.1 ? .05 : hull_inner_scale.y;
	hull_inner_scale.z          	+= abs(position.x)*.012 + .15;
	
	vec3 hull_inner_position        = hull_position;    
	hull_inner_position.y           = abs(position.y)<abs(hull_position.y) ? position.y : hull_position.y; //delete?

	float hull_inner        	= cube(hull_inner_position, hull_inner_scale);
	
	
	vec3 hull_outer_scale           = hull_scale * vec3(1.05,1.05, 1.031);
	hull_outer_scale.y         	+= position.y > .5 ? -position.z * .025 : 0.;
	
	hull_position.y             	= abs(hull_position.y-.05+position.z*.0025);
	
	float hull_outer            	= cube(hull_position, hull_outer_scale);

	hull_outer                  	= max(hull_outer, -hull_inner);
	ship                        	= min(hull_outer, ship);    

	bool inner_hull             	= hull_inner < hull_outer;
	bool outer_hull             	= hull_inner > hull_outer;
	bool bridge_tower	        = false;
	bool aft 			= false;
	bool domes 			= false;
	
	//hull details
	float hull_plating          	= partition_noise
					(
					(floor(position.xz*31.)/63.
					+floor(position.xz*63.)/128.
					+position.xz*2.5-32.41
					+abs(position.z)*.2)-8.
					);
	
	
	//structural detail
	float hull_panels       	= max(hull_plating * step(hull_plating, .95), .85) * 3.; 
	
	float z_floor_noise        	= hash
					(
					floor(position.z*13.+position.z)/8.
					+floor(position.z*5.)/3.
					);
	
	z_floor_noise         		= floor(z_floor_noise*8.)/8.;
	
	bool rear_border		= hull_position.z * .5 + hull_position.x*.12 < 2.3;
	float hatches			= hash(floor(hull_position.z * 24. - floor(hull_position.x*32.)+12. + hull_panels * 8.  - z_floor_noise + 32.))
					+ hash(hash(floor(position.z*32.)-floor(position.x*5.) - 8.-floor(position.z*64.))+floor(position.x*2.));
	hatches 			= -abs(.5-step(hatches, .9) - hash(step(hatches, .9) - floor(position.x*32. + hatches)));
	hatches 			*= float(rear_border);
	hatches 			*= .25;

	//aft hull && engines
	if(inner_hull && hull_position.z > 4.0 && hull_position.y < .22)
	{   
		//aft structures
		aft                 		= true;
		
		hull_inner			= max(hull_inner-.05, -hull_outer);
		vec2 absxy			= abs(position.xy*1.1);
		bool columns			= mod(absxy.x-.25, .85) > .3625;
		bool spars			= mod(absxy.x+absxy.y, .25) > .025 ^^ mod(absxy.x-absxy.y, .25) > .025;

		//main engines
		vec3 engine_position    	= position.yzx;
		engine_position.z       	= abs(engine_position.z) < .4 ? engine_position.z : abs(engine_position.z)-.8;
	
		engine_position         	+= -vec3(0.,4.1,0.);
		float engine_angle      	= atan(engine_position.x, engine_position.z)/TAU;
			
		float engine_contour    	= clamp(engine_position.y*.5,.05,.15);
		engine_contour          	= engine_position.y > .35 ? .2 : engine_contour;
			
		vec2 radii          		= vec2(engine_contour, .25);
		float depth         		= .21;
		float engine           	 	= cone(engine_position, depth, radii);
	
		engine              		+= fract(engine_position.y*8.)>.2 ? .01 : 0.;
		engine              		+= fract(engine_angle*16.)>.1 ? .01 : 0.;
		engine_position.y      	 	+= -.125;
		float engine_mask      	 	= cone(engine_position, depth, radii);
		engine_mask            	 	+= fract(engine_position.y*8.)>.2 ? .01 : 0.;
		engine              		= max(engine, -engine_mask);    
		
		//booster engines
		vec3 booster_position   	= position.yzx;
		booster_position.x      	= abs(booster_position.x)-.165;
		booster_position.z      	= abs(booster_position.z)-.4;
		booster_position        	+= vec3(0.,-4.15,0.);
		float booster_radius    	= length(booster_position.xz);
		float booster_angle     	= atan(booster_position.x, booster_position.z)/TAU;
		float booster_contour   	= booster_position.y > .1 ? .115 : .15;
		float booster_length    	= booster_radius < .065 ? .12  : .195 - booster_radius * booster_position.y;
		float booster           	= cylinder(booster_position, booster_length , booster_contour);

		booster             		+= fract(booster_position.y*8.)>.8 ? .01 : 0.;
		booster            		+= fract(booster_angle*16.)>.1 ? .01 : 0.;
		
		float engines         		= min(engine, booster)-.005;
		ship               		= min(engines, ship);
		
		hull_inner_scale.z		+= columns || spars ? -.015 : .025;     
		hull_inner_scale.y 		+= .035;
		hull_inner			= cube(hull_inner_position, hull_inner_scale);
		hull_inner			+= columns && !spars ? -.03 : -0.;
		hull_inner			+= !columns && !spars ? fract((absxy.x-absxy.y)*16.+.9)*0.01 : 0.;
		hull_inner			+= spars ? -0.03 : 0.03;
		hull_inner 			+= .035 + hull_panels*.01;
		hull_outer			= max(hull_outer,-hull_inner);
	}
	
	//structural detail
	float outboard_partitions	= partition_noise
					(
					floor(position.x*16.)/8. +
					z_floor_noise +
					position.yz * 5.*
					vec2(3.5, 1.2) + floor(position.y*8.+32.)
					);
	outboard_partitions         	+= max(outboard_partitions, .85)*4.;    
	outboard_partitions 		+= hatches * .75;

	
	//conning tower
	float tower = FARPLANE;
	if(position.y > 0.)
	{                  
		//bridge
		vec3 bridge_position            = hull_position;
		bridge_position.y       	+= -hull_position.z * .05 - .46;
		bridge_position.z          	+= -3.8;
		
		float floor_detail		= floor(outboard_partitions*8.)/4.-outboard_partitions;
		
		vec3 bridge_scale          	= vec3(1.);
		bridge_scale.x             	= -bridge_position.z*.05+.8;
		bridge_scale.x             	+= abs(bridge_position.y) < .035 ? floor_detail *-.0125 : -.025;
		bridge_scale.y			= -abs(bridge_position.x)*.1+.125 + hatches * .015 ;
		bridge_scale.z			= -bridge_position.z*.01-abs(bridge_position.x)*.15+.25;
		
		float bridge			= cube(bridge_position, bridge_scale);
		
		vec2 bridge_detail		= hash(floor(position.y*.125+hull_position.xy*8.)+floor(position.xy*32.+32.))+.35;
		bridge_detail 			-= abs(fract(bridge_detail.yx)-.5)*.5+floor_detail*.0025;
		bridge_detail 			*= .9;
		vec3 bridge_decks_position      = bridge_position;
		bridge_decks_position.z         = mod(bridge_position.z, .0625)-.00375;
		bridge_decks_position.z         = max(abs(bridge_decks_position.z)*2., abs(bridge_position.z)-bridge_detail.x*.1)+.05;
		float bridge_decks          	= cube(bridge_decks_position, bridge_scale);
		
		//sensor bar
		vec3 sensor_bar_position        = bridge_position;
		sensor_bar_position.y           += -.22;
		sensor_bar_position.z           += -.07;
		
		vec3 sensor_bar_scale           = vec3(1.);
		sensor_bar_scale.x          	= .4;
		sensor_bar_scale.y          	= sensor_bar_position.z*.01+.015;
		sensor_bar_scale.z          	= -abs(position.x)*.025+.075;
	
		float sensor_bar            	= cube(sensor_bar_position, sensor_bar_scale);
		sensor_bar                  	+= fract(sensor_bar_position.x*8.-.1)>.8 ? -.0025 : 0.;
		sensor_bar                  	+= fract(sensor_bar_position.z*8.-.3)>.4 ? .0035 : 0.;
		
		
		vec3 sensor_bar_base_position   = sensor_bar_position;
		sensor_bar_base_position.y      += .08;
		sensor_bar_base_position.z      += -.02;
		
		vec3 sensor_bar_base_scale      = vec3(1.);
		sensor_bar_base_scale.x         = -sensor_bar_position.y*.5-sensor_bar_position.z*.6-abs(sensor_bar_position.x)*.25+.05;
		sensor_bar_base_scale.y         = .074;
		sensor_bar_base_scale.z         = .08+sensor_bar_position.y*-.5;
		sensor_bar_base_scale.z         += abs(sensor_bar_base_position.x)<.1
						&& abs(sensor_bar_base_position.y-.025)<.015            
						&& sensor_bar_base_position.z<-.1
		? -.005 : 0.;       
		
		float sensor_bar_base           = cube(sensor_bar_base_position, sensor_bar_base_scale);        
		
		sensor_bar                  	= min(sensor_bar, sensor_bar_base);
		
		//ray domes
		vec3 ray_dome_position          = bridge_position;  
		ray_dome_position.z         	+= .06;
		ray_dome_position.y         	+= -.16;
		ray_dome_position.y         	*= 1.3;
		ray_dome_position.x         	= abs(ray_dome_position.x)-.625;
			
		float ray_domes             	= icosahedral(ray_dome_position*1.1, 32., .1);
			
		vec3 support_position       	= ray_dome_position;
		support_position.y          	+= .07;
		float support               	= cube(support_position, vec3(.06));        
		float support_mask          	= cube(support_position, vec3(.065,.1,.065));       
			
		vec3 absp                   	= abs(support_position);
		bool struts                 	= absp.x<.06 ^^ absp.z>.06; 
		bool spars                  	=  fract(abs(absp.x-absp.y))>.02
						&& fract(abs(absp.z-absp.y))>.02;
		
		support                     	+= spars && !struts ? .01 : -.015;
	
		support                     	= max(support, -support_mask);
			
		//tower 	
		vec3 tower_position         	= hull_position;
		tower_position.z            	+= -4.045;
		tower_position.z            	+= tower_position.z > 4. ? tower_position.y * .3 : 0.;
		tower_position.y        	+= -.51;
		
		vec3 tower_scale            	= vec3(1.);
		tower_scale.x               	= -tower_position.y*.1+.15;
		tower_scale.y               	= .2;
		tower_scale.z               	= tower_position.z*.05;
		tower_scale.z               	+= tower_position.z > .2 ? -tower_position.y*.6+.4 : tower_position.y*.25+.3;
		tower_scale.x               	+= fract(tower_position.y*16.-z_floor_noise-.3) > .6 - z_floor_noise * .05 
						&& tower_position.z + tower_position.y * .5 - z_floor_noise * .15 < .15
						&& tower_position.y < .14
						? outboard_partitions * -.0095 : 0.;
		
		float tower                 	= cube(tower_position, tower_scale);
			
			
		vec3 tower_base_position    	= tower_position;
		tower_base_position.y       	+= .15;
		tower_base_position.z       	+= .05;
			
		vec3 tower_base_scale       	= tower_scale;
		tower_base_scale.x          	= -tower_position.y*.13+.19;
		tower_base_scale.z          	+= -.1;
		tower_base_scale.y          	= tower_position.z*.05+.1;
			
		float tower_base            	= cube(tower_base_position, tower_base_scale);
		
		float tower_vents       	= position.z > 3.8 ? fract(position.y*32.)*.05 : 0.;
		
		tower                       	+= abs(position.x) < .25-position.y*.1-.07 
		&& position.y < .93
		? tower_vents : 0.;
			
		//compositing
		tower                   	= min(tower, tower_base);       
		bridge_decks               	= min(bridge-.01, bridge_decks+.01);    
		bridge_decks               	= min(bridge_decks, support);
		ray_domes                  	= min(ray_domes, sensor_bar);
		tower                      	= min(tower, bridge_decks);
		bridge                     	= min(bridge, ray_domes); 
		tower                      	= min(bridge,tower);
		bridge_tower               	= tower < ship;
		
		ship                		= min(tower, ship);
	}
	

	//solar collector (round thing on the bottom)
	float collector 		= FARPLANE;
	vec3 deck_position      	= hull_position;
	if(position.y > 0.)
	{
		vec2 absxz              = abs(position.xz*3. + hatches * .85 * deck_position.y);
		bool indents    	= fract(absxz.y*.8 + .25 - 8.*hatches)>.1;
		
		//outboard offset
		deck_position.x 	+= deck_position.z - deck_position.x * .06 > 1. + deck_position.x * .15  
					&& deck_position.z < 3.91 - deck_position.x * .985
					&& deck_position.x - deck_position.z * .05 < .2 
					? -.3 : 0.;
	
		//lower decks	
		deck_position.y 	+= deck_position.z - deck_position.x > 1.85 + hatches * .025
					&& deck_position.z > 1.65
					&& deck_position.z + deck_position.x *.3 < 4.55 + hatches * .2
					&& deck_position.x < .34 + deck_position.z * .15
					? -.0275  - hatches * .005: 0.;
			
		//gun decks	
		deck_position.y 	+= deck_position.z - deck_position.x > 1.65 
					&& deck_position.z > 2.5   - hatches * .125
					&& deck_position.z + deck_position.x *.5 < 4.38
					&& deck_position.x < deck_position.z * .25 +.4  - hatches * .025 
					? -.015  - hatches * .004: 0.;
		//turrets
		vec3 turret_position    = hull_position - vec3(position.z * .2-.15,.045+hull_position.z*.01, 3.23);
		
		turret_position.z   	= abs(abs(abs(turret_position.z)-.125)-.125)-.125;
		turret_position.x   	= abs(turret_position.x)-.5;
			
	
		vec2 turret_radius  	= vec2(.02, .02);
		turret_radius.x     	= turret_position.y > .01 ? .04 : .01;
		turret_radius.y     	= abs(turret_position.z) > .015 
					|| turret_position.x > .0025 
					? .001 : turret_radius.y+.005;
		
		float turret_depth  	= .02;
		
		float turret        	= cone(turret_position, turret_depth, turret_radius);
		vec3 barrel_position    = turret_position;
		barrel_position.y   	+= -.035;

		
		float barrel       	= cube(barrel_position, vec3(.034,0.0015,.005));
		turret          	= min(turret, barrel);

		deck_position.y     	+= turret < .05 ? .01 : 0.;   
		ship            	= position.y > 0. ? min(ship, turret) : ship;
		

		
		//upper decks
		deck_position.y 	+= deck_position.z - deck_position.x * .125 > 2.9  + hatches * .05
					&& deck_position.z + deck_position.x *.4    < 3.9
					&& deck_position.x              	    < .3 
					? -.0075 : -.001;
		
		//midship deck
		deck_position.y 	+= deck_position.z - deck_position.x * .3   > .75
					&& deck_position.z + deck_position.x        < 2.19 - hatches * .05
					&& deck_position.x < .6 
					&& deck_position.x > -.25
					? -.01 : 0.;
		
		//midship hatches
		deck_position.y 	+= deck_position.z - deck_position.x * .3   > .85
					&& deck_position.z + deck_position.x        < 1.9
					&& deck_position.x < .55 
					&& deck_position.x > .25
					? -.01 : 0.;
	
	
		//bulwarks
		deck_position.y 	+= deck_position.z - deck_position.x        > .092
					&& deck_position.x - deck_position.z *.283  < .5
					&& deck_position.z  < 4.
					&& deck_position.x-deck_position.z*.25  > -.25
					&& indents
					? -.005 * hull_position.x : 0.;
		
		//centerline
		deck_position.y 	+= hull_position.x < .045
					&& deck_position.z > 1.015
					&& deck_position.z < 2.4
					? (1.-float(fract(position.z*8.)>.9))*-.01: 0.;
		
		
		//sensor deck
		deck_position.y 	+= deck_position.z - deck_position.x * .5   > -.48  
					&& deck_position.z + deck_position.x        < .34   
					&& deck_position.x              < .28
					? -.005 - hull_panels * .00025 + hatches * .005: 0.;
		
		
		//forecastle
		deck_position.y 	+= deck_position.z - deck_position.x * 5.5   > -1.45  
					&& deck_position.z + deck_position.x * 2.    < -.54   
					? -.0075 : 0.;
		
		deck_position.y 	+= -hull_panels * .0014 - hatches * .006;
		
		//upper deck superstructure
		vec3 deck_upper_position= hull_position;
		deck_upper_position.y   = hull_position.y- .15 - deck_position.y*.035 - hatches * -.015;
		deck_upper_position.z   += -3.16;
		
		vec3 deck_upper_scale   = vec3(1.);
		deck_upper_scale.x      = hull_scale.x-deck_position.x-1.;
		deck_upper_scale.x      += deck_position.z < 2.7 ? deck_upper_position.z + .5 : 0.;
		deck_upper_scale.x      += deck_position.z > 3.9 ? -deck_upper_position.z*2.7+2. : 0.;
		deck_upper_scale.x      += outboard_partitions*-.0125;
		deck_upper_scale.y      = hull_scale.y * .25 + hull_position.z * .035;
		
		float deck_upper    	= cube(deck_upper_position, deck_upper_scale);
		
		
		//mid deck superstructure
		vec3 deck_mid_position  = hull_position;
		deck_mid_position.y     = hull_position.y - .1 - hatches * .01;
		deck_mid_position.z     += -3.16  - hatches * .025;
		
	
		
		vec3 deck_mid_scale     = vec3(1.);
		deck_mid_scale.x        = hull_scale.x-deck_position.x;
		deck_mid_scale.x        += deck_position.z < 2.7 ? deck_mid_position.z : 0.;
		deck_mid_scale.x        += deck_position.z > 3.9 ? -deck_mid_position.z*2.7+2. : 0.;
		deck_mid_scale.x        += outboard_partitions * -.015 - hatches * deck_position.y;        
		deck_mid_scale.y        = hull_scale.y * .7 + hull_position.z * .015;        
		
	
		float deck_mid          = cube(deck_mid_position, deck_mid_scale);
	
		ship                    = min(ship, deck_upper);
		ship                    = min(ship, deck_mid);
	}
	else
	{
		//"solar collector" (round thing on the bottom)
		vec3 collector_position = position;
	
		collector_position.z    += -2.8;
		collector_position.y    += abs(collector_position.x)-.0125 < 0. 
					|| abs(collector_position.z)-.0125 < 0.
					? -.025 : 0.;
		collector_position.xz   *= rmat(3.14/4.);
		collector_position.y    += abs(collector_position.x)-.0125 < 0. 
					|| abs(collector_position.z)-.0125 < 0.
					? -.025: 0.;

		collector_position.y 	*= 2.;
		collector_position.y   	+= -hull_plating * .005 + .45;
	
		float collector_scale   = position.y < -hull_scale.y ? .45 : 0.;
	
		collector             	= sphere(collector_position, collector_scale);

		deck_position.y 	+= hatches * .0125 - hull_panels * .005;

		//solar collector berth
		deck_position.y 	*= deck_position.z - deck_position.x    > 1.9
					&& deck_position.z + deck_position.x    < 5.65
					&& deck_position.x                      < deck_position.z * .23 
					? .9 : 1.;
		
		deck_position.y 	+= length(collector_position)-.55 < 0. ? .05 : 0.;
			
		vec2 absxz      	= abs(position.xz*8.);
		bool indents    	= fract(absxz.y*.35+.5)>.1;
		bool columns    	= mod(absxz.y-.25-position.y, 1.) > .5 && abs(position.x) > .10;
		bool spars      	= mod(absxz.x+absxz.y, 1.25) > .025 ^^ mod(absxz.x-absxz.y, 1.25) > .025;
		
		
		//tie fighter bays (or whatever)
		deck_position.y 	+= deck_position.z - deck_position.x        > .92
					&& deck_position.x - deck_position.z *.25   < .4
					&& deck_position.x -deck_position.z*.25     > .35 
					&& deck_position.z                          < 4.
					&& indents && !spars
					? .01 * hull_position.x  : 0.;
		
		
		//forward bay
		deck_position.y 	+= deck_position.z - deck_position.x * .5   > -.7   
					&& deck_position.x          < .2     
					&& deck_position.z          < -.3    
					? -.0125 - hull_plating * .0025 : 0.;      
		
		//main docking bay border
		deck_position.y 	+= deck_position.z  > .25
					&& deck_position.z  < 1.25
					&& deck_position.x  < .45
					? -.01 : 0.;
		
		//main docking bay
		bool bay_area 		= deck_position.z   > .2
					&& deck_position.z  < 1.2
					&& deck_position.x  < .4;
		
		
		deck_position.y 	+= bay_area ? -hull_position.x*0.25+.1 : 0.;

		deck_position.y 	+= bay_area
					&& columns
					? -.01 : .0;
		
		deck_position.y 	+= bay_area
					&& spars
					&& !columns
					? -0.004 : 0.;
			
					//main docking bay border
		deck_position.y 	+= deck_position.z  > .75
					&& deck_position.z  < 1.95
					&& deck_position.x  < .45
					&& !spars
					? -abs(position.x)*.001 : 0.;   
	}

	ship                    	= min(ship, hull_inner);
	
	bool upper_decks        	= hull_position.y != deck_position.y 
					|| hull_position.x != deck_position.x 
					|| hull_position.z != deck_position.z; 
	
		
	vec3 deck_scale         	= hull_scale;
	float decks             	= cube(deck_position, deck_scale);
		
	ship                    	= position.y < -.075 && position.z < 4. ? max(hull_inner,decks) : ship;
	ship                    	= min(decks, ship);
	ship                    	= min(collector, ship);
	
	
	vec2 xz_floor_noise             = hash(floor(hull_position.xz*8.+deck_scale.y*4.+abs(8.-hull_position.zx*1.5)*vec2(32., 23.)));
	xz_floor_noise                 	= max(floor(xz_floor_noise*32.)-25., .0)*.025*(.25-position.x)*xz_floor_noise;
	
	
	//composite details
	bool wake_line          	= abs(position.y)<.09;
	
	//outboard hangar bays
	float hangar_bays           	= FARPLANE;
	if(wake_line)
	{
		vec3 bay_positions      = position;
		bay_positions.z         += -3.15;
		bay_positions.z         = mod(bay_positions.z+mod(bay_positions.z, 3. + bay_positions.z * .5), 3.4)-.5525;
		bay_positions.y         += z_floor_noise * .025 + xz_floor_noise.y * .005 - .01;
	
		vec3 bay_scale          = vec3(1.);
		bay_scale.x             = 4.;
		bay_scale.y             = .0175 - (xz_floor_noise.x - xz_floor_noise.y) * hull_scale.x * .035 + z_floor_noise*position.x*.0025;
		bay_scale.y             += position.z < 0.1 ? xz_floor_noise.x * .4 -.01 : 0.;
		bay_scale.y             += abs(position.x) < .05 ? -.04 : 0.;
		bay_scale.z            	= position.z*.095+.1+abs(position.x)*.1;
		hangar_bays           	= cube(bay_positions, bay_scale);
	}
	
	
	
	//detailing
	float hull_inner_detail     	= wake_line
					&& hangar_bays > 0.
					&& outboard_partitions<3.95
					? .01 : outboard_partitions *.001;
	float hull_detail_floor		= floor(8.*cross(position.z+cross(position.z*5.)+cross(position.y*3.))/3.);
	hull_inner_detail       	+= wake_line && hangar_bays > 0.
					&& outboard_partitions<3.95
					&& position.z > -1.4
					? -min(hull_detail_floor,.75)*.02  : 0.;	
	
	float notches			= (abs(position.y) * -5. + float(fract((hull_position.x*.25+hull_position.z*2.)*16.)>.05) * .25) * float(rear_border);
	bool border			= hull_position.y < .015 || hull_position.z * .5 + hull_position.x*.12 > 2.3;
	hull_panels 			*= border ? notches : hatches * (.5+hull_position.y);
	hull_panels             	*= bridge_tower ? .5 : 1.;
	hull_panels             	*= upper_decks ? .25 : 1.;
	
	
	//compositing
	ship               		+= wake_line ? (z_floor_noise < .1 ? -.0075: 0.): 0.;                  
	ship               		= max(ship, -hangar_bays);
	ship               		= (bridge_tower || outer_hull)  ? ship - hull_panels * .0075 : ship * 1.1;  
	ship               		= !aft && !bridge_tower && inner_hull ? ship + hull_inner_detail: ship; 

	return ship;
}

ray emit(ray r)
{
	float total_range       = r.range;
	float threshold     = PHI;
	
	for(int i = 1; i < ITERATIONS; i++)
	{
		if(total_range < FARPLANE)
		{
			if(r.range < threshold && r.range > 0.)
			{
				r.range	= total_range;
				r.steps = float(i);
				break;
			}

			threshold          *= 1.04;
			r.position         += r.direction * r.range * .8;
			r.range  	   = map(r.position);
			
			if(r.range < 0.)
			{
				r.range -= threshold;
				threshold *= float(i);
			}
			total_range        += r.range;
		}
		else
		{
			r.range = 1.+length(r.origin + r.direction * FARPLANE);
			r.steps = float(i);
			break;
		}
	}
	return r;
}

vec2 format_to_screen(vec2 uv)
{
	uv = uv * 2. - 1.;
	uv.x *= ASPECT;
	return uv;
}


ray view(in vec2 uv)
{ 
	uv = format_to_screen(uv);

	vec3 w          = normalize(VIEWTARGET-VIEWPOSITION);
	vec3 u          = normalize(cross(w,vec3(0.,1.,0.)));
	vec3 v          = normalize(cross(u,w));

	ray r           	= ray(vec3(0.), vec3(0.), vec3(0.), 0., 0.);
	r.origin        	= VIEWPOSITION;
	r.position      	= VIEWPOSITION;
	r.direction     	= normalize(uv.x*u + uv.y*v + FOV*w);;
	r.range    		= PHI;
	r.steps             	= 0.;

	return r;
}   


float sphere(vec3 position, float radius)
{
	return length(position)-radius; 
}

float cube(vec3 p, vec3 s)
{
	vec3 d = (abs(p) - s);
	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float torus( vec3 p, vec2 t )
{
	vec2 q = vec2(length(p.xz)-t.x, p.y);
	return length(q)-t.y;
}

float cylinder(vec3 p, float l, float r)
{
	return max(abs(p.y-l)-l, length(p.xz)-r);
}

float cone(vec3 p, float l, vec2 r)
{
	float m = 1.-(p.y*.5)/l;
	return max(length(p.xz)-mix(r.y, r.x, m), abs(p.y-l)-l);
}

float icosahedral(vec3 p, float e, float r)
{
	vec2 n = vec2(.577, -.577);
	float a = .357;
	float b = .934;
	float s = pow(abs(dot(p,n.yyy)),e);
	s += pow(abs(dot(p,n.yxx)),e);
	s += pow(abs(dot(p,n.xyx)),e);
	s += pow(abs(dot(p,n.xxy)),e);
	s += pow(abs(dot(p,vec3( 0.,a,b))),e);
	s += pow(abs(dot(p,vec3(0.,-a,b))),e);
	s += pow(abs(dot(p,vec3( b,0.,a))),e);
	s += pow(abs(dot(p,vec3(-b,0.,a))),e);
	s += pow(abs(dot(p,vec3( a,b,0.))),e);
	s += pow(abs(dot(p,vec3(-a,b,0.))),e);
	s = pow(s, 1./e);
	return s-r;
}

//via http://glsl.herokuapp.com/e#4841.11
float partition_noise(vec2 p) 
{
	vec2 id;
	
	id = floor(floor(p)-.5);
	
	p *= floor(hash(id) * 2.)+1.;
	id = floor(p);
	
	p.yx *= floor(hash(id) * 3.)-4.;
	id -= floor(p);

	p *= floor(hash(id) * 2.)+1.;
	id = floor(p);

	p -= id;

	vec2 u = abs(p - .5) * 2.;

	return max(u.x, u.y);
}


vec2 hash(vec2 v) 
{
	vec2 n;
	n.x=fract(cos(v.y-v.x*841.0508)*(v.y+v.x)*3456.7821);
	n.y=fract(sin(v.x+v.y*804.2048)*(v.x-v.y)*5349.2627);
	return n;
}

float cross(float x)
{
	return abs(fract(x-.5)-.5)*2.;  
}


mat2 rmat(in float r)
{
	float c = cos(r);
	float s = sin(r);
	return mat2(c, s, -s, c);
}