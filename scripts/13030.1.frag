//lighting of a 3d equation
//mouse is lamp
//- Khlorghaal
#define LIGHT_Z 150

#define AMBIENT 0.1
#define SPECULARITY 0.3
#define DIFFUSIVENESS 0.6

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define SCALE 20.
//magnification, in texels

//unitless
float z(float x, float y){
	
	//return sqrt(1.0-x*x-y*y);
	//return sin(x*y)*10.;
	return sin(sqrt(x*x+y*y))*2.;
}

float specular(vec3 normal, vec3 light){
	return 1.0;
}
float diffuse(vec3 normal, vec3 light){
	return 1.0;	
}

void main( void ) {
	
	vec2 dist2= mouse*resolution-gl_FragCoord.xy;
	
	vec3 pos= vec3(  (gl_FragCoord.xy-(resolution/2.0)) / SCALE  , 0);
	pos.z= z(pos.x, pos.y)*SCALE;
	
	vec3 norm= vec3(0);
	vec3 light= vec3(mouse*resolution, LIGHT_Z);
	light-= float(gl_FragCoord);
	
	float bright= AMBIENT;
	bright+= SPECULARITY * specular(norm, light);
	bright+= DIFFUSIVENESS * diffuse(norm, light);
	
	gl_FragColor= vec4( vec3(bright),1);
}