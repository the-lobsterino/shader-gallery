/*  
    WIP RAYMARCHING
┌──
│
│ CafeOh     @cafeohio  
│  CafeOhio@gmail.com   
│ http://3D.cafeoh.net  
│
└──
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159

#define FOVDEG 90.
#define FOV FOVDEG*PI/180.

void main( void ) {

	// Screen coords to [-1,1],[-1,1] coordinates
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position = position*2.-1.;
	
	// Camera setup
	
	float angspan = 1./tan(FOV/2.); // Use the FOV to determine the Frustum width
	vec2 frustum = vec2(angspan*resolution.x/resolution.y,angspan); // Fix the Frustum ratio

	vec3 prp = vec3(0.,0.,0.); // Projection Reference Point OR The camera position
	vec3 vrp = vec3(0.,0.,1.); // Viewing Reference Point OR The LookAt position
	vec3 vuv = vec3(0.,1.,0.); // View Up Vector OR Typically the Y Axis (doesn't depend on the camera rotation)
	
	vec3 vpn = normalize(vrp-prp); // View Plane Normal OR The frustum direction vector
	vec3 rsv = normalize(cross(vpn,vuv)); // Real Side Vector
	vec3 ruv = 	     cross(vpn,rsv); // Real Up Vector (implicit normalization)
	vec3 vcv = prp+vpn; // View Coordinate Vector OR Absolute normalized lookat position
	vec3 scp = prp+rsv*frustum.x+ruv*frustum.y; // Screen Coordinate Position OR Projected 3D Screen position
	vec3 svp = normalize(scp-prp); // Screen Vector Position OR Local Frustum Plane
	
	// At this point, make use of svp for the direction vector for raymarching, and pos for translation
	
	float color = 0.0;
	
	for(float i=0.; i<100. ; i+=1.){
		vec3 pos = prp+svp*i*0.1;	
		color=length(vec3(0.,0.,-1.)-pos)/15.;
	}

	gl_FragColor = vec4( vec3(color), 1.0 );

}