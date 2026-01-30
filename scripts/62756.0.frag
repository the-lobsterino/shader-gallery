/*
 * Original shader from: https://www.shadertoy.com/view/4tVyDR
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4 iMouse = vec4(0.0);

// Emulate a black texture
#define texture(s, uv) vec4(0.0)
#define textureLod(s, uv, lod) vec4(0.0)
#define texelFetch(s, uv, lod) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
/* 
---------------------------------------------------------------------------------------

 "Lonely Tree" by Pablo Roman Andrioli (Kali)
 
 Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

 Please report any problems (I'm aware this shader could work slow on some systems)

--------------------------------------------------------------------------------------- 
*/


// Params to play with:

// Raytracer 

const float viewsize=.5;    // reduced raytracing area for speeding up (>1 for full view)
const float zoom=1.1; 
const float detail=.02;    // distance to stop tracing
const float maxdist=28.;    // scene depth
const int maxsteps=100;      // max ray steps

// Light 

const vec3 lightdir=vec3(1,-.6,0.); 
const float diffuse=.75;
const float specular=.8;
const float specularexp=5.;
const float ambient=.2;

// Tree shape
// you can try to find better trees or even some really weird ones.

const float inititer=37.;   // Iterations to do at first run
const float maxiter=50.;    // Max iterations to reach with mouse
const float leavestart=29.; // Iteration to stop texturing and start green coloring
const float width=0.55; 
const float height=0.62;
const float branchsegments=3.; // Number of segments for each branch
const float scaling=0.90;	   // Scaling factor at each iteration
const vec3 rotvector=vec3(-0.3,-1.,0.2); // IFS rotation vector
const float rotangle=85.;      // IFS rotation angle
const float anglevary=-0.2;    // Angle variation at each iteration

// Animation 

const float amplitude=.1;   
const float speed=0.8;
const float dynscaling=0.8; // Scaling factor for the dynamic fractal animation


//-------------------------------------------------------------------------------------------

vec3 dir;
vec2 pix;
vec2 coord;


// Rotation function included in MathUtils.frag of Syntopia's Fragmentarium 
mat3 rotationMat(vec3 v, float angle)
{
	float c = cos(angle);
	float s = sin(angle);
	
	return mat3(c + (1.0 - c) * v.x * v.x, (1.0 - c) * v.x * v.y - s * v.z, (1.0 - c) * v.x * v.z + s * v.y,
		(1.0 - c) * v.x * v.y + s * v.z, c + (1.0 - c) * v.y * v.y, (1.0 - c) * v.y * v.z - s * v.x,
		(1.0 - c) * v.x * v.z - s * v.y, (1.0 - c) * v.y * v.z + s * v.x, c + (1.0 - c) * v.z * v.z
		);
}


// Terrain heightmap
float terrain(vec3 p){
	p.x+=1.5;
	float h=(sin(p.x)+cos(p.z))*.25;
	float l=length(p.xz);
	p.xz*=2.3;
	p.x+=l*.5;
	h+=(cos(p.x)+sin(p.z))*.1;
	p.xz*=1.3;
	p.z+=l*.7;
	h+=(cos(p.x)+sin(p.z))*.08;
	h+=texture(iChannel0,p.xz*.4).z*.2; //texture displacement
	return p.y-h;
}

float totalit;

// Scene DE
vec2 DE(vec3 pos){
	vec3 p=pos;
	int n = 0;
	float sc=1.;
	float time=iTime*speed;
	float amp=sin(time/2.)*amplitude;
	float angle=radians(rotangle)/branchsegments;
	bool rotstart=false;
	float dtree;
	float minit=maxiter;
	vec3 minp=pos;
	float mouseit=iMouse.y/iResolution.y*maxiter; //mouse iterations
	bool mouse=length(iMouse.xy)>0.; //see if mouse was used
	totalit=0.;
	for (float n=0.; n < maxiter; n++) {
		totalit++; //iter count
		if ((n>mouseit && mouse) ||
		  (!mouse && n>inititer)) break;
		float d=length((p+vec3(0,sc,0))*vec3(1,.3,1))-width*sc; //branch segment
		if (n<1.) dtree=d;
		if (d<=dtree) { //test min distance and save iteration & vector
			dtree=d;
			minit=n;
			minp=p;
		}
		if (mod(n,branchsegments) > branchsegments-2.) { 
			p.x=abs(p.x); // fold after max segments reached for each branch
			rotstart=true; // start rotating at first fold
		}
		if (rotstart) { // rotate and animate rotation
			p*=rotationMat(normalize(rotvector),angle+sin(time)*amp);
		}
		p.y-=height*sc; // go up
		sc*=scaling; // scale size
		amp*=dynscaling; // scale amplitude
		time/=dynscaling; // scale time
		angle+=radians(anglevary); // vary rotation
	}
	if (minit<leavestart){ //apply texture displacement
		dtree+=length(texture(iChannel1,vec2(minp.y*2.,atan(minp.x,minp.z)*1.)).xyz)*.04;
	} 
	
	float dterr=terrain(pos);
	float de=min(dterr,dtree);
	float col;
	if (de==dterr) col=0.; else col=minit+1.; // return coloring parameter
	return vec2(de,col);
}


// finite difference normal
vec3 normal(vec3 pos) {
	vec3 e = vec3(0.0,detail,0.0);
	
	return normalize(vec3(
			DE(pos+e.yxx).x-DE(pos-e.yxx).x,
			DE(pos+e.xyx).x-DE(pos-e.xyx).x,
			DE(pos+e.xxy).x-DE(pos-e.xxy).x
			)
		);	
}

// coloring
vec3 color(float obj, vec3 p) {

	if (obj<1.) { //terrain texture
		vec3 tex=texture(iChannel0,p.xz*.4).xyz;
		return mix(vec3(.55,.7,.3),tex,.75)*(.5+smoothstep(0.,1.0,length(p.xz)*.35));
	} 
	else if (obj>0. && obj<leavestart) { //branches
		return vec3(.55,.4,.25);
	} else { //leaves (vary brightness by iteration, kind of fake AO)
		return vec3(.80,1,.6)*1.1*(1.-.7*(totalit-obj)/(totalit-leavestart));
	}
	
}

//lighting
vec3 light(vec3 p) {
vec3 ldir=normalize(lightdir);
vec3 n=normal(p);
float diff=max(max(0.0,dot(-n, ldir))*diffuse,ambient);
vec3 r = reflect(ldir,n);
float spec=max(0.,dot(dir,-r));
return vec3(diff+pow(spec,specularexp)*specular);	
}

//raytracing
vec3 trace(vec3 from, vec3 dir) {
	vec3 p;
	float totdist=0.;
	vec3 col;
	vec2 d;
	for (int i=1; i<maxsteps; i++) {
		p=from+totdist*dir;
		d=DE(p);
		if (d.x<detail || totdist>maxdist) break;
		totdist+=d.x; 
	}
	vec3 back=mix(vec3(.9),vec3(.6,.7,.8),clamp((dir.y+.15)*6.,0.,1.)); //background gradient
	if (d.x<detail) {
		col=color(d.y,p)*light(p-detail*dir*.5); //apply color+light
		col=mix(col,back,smoothstep(0.,1.,totdist*totdist/maxdist*.03)); //a bit of fog
	} else { //background sky with moving clouds (and some contrails? :D)
		col=back+vec3(1,.9,.6)*texture(iChannel1,
		vec2(dir.y*4.,atan(dir.z,dir.x)*1.5+iTime*.02)*.15).g*(dir.y*.7+.15);
	}
	return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	//Camera
	//limited view angle to reduce symmetry appreciation
	//(introducing assymmetry breaks the distance field, any suggestions?)
	pix=fragCoord.xy / iResolution.xy;
	float viewangle=-135.+(iMouse.x/iResolution.x)*90.; 
	mat3 rotview=rotationMat(vec3(0.,1.,0.),radians(viewangle));
	coord = pix-vec2(.5);
	coord.y*=iResolution.y/iResolution.x;
	vec3 from=vec3(0.,0.,7.5)*rotview*zoom;
	from+=vec3(0.,3,0.);
	dir=normalize(vec3(coord*2.,-1.))*rotview;
	vec3 col=vec3(0.);
	float view=length(coord*vec2(.8,1.)*4.);
	if (view<viewsize*2.) col=trace(from,dir); 	//trace only inside view area
	col=col*.9+vec3(.1); //desaturate a bit
	col = mix(col, vec3(0.73), smoothstep(0.5,1.,view*view/pow(viewsize*2.,2.))); //smooth edges
	fragColor = vec4(col,1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 0.0, 0.0);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}