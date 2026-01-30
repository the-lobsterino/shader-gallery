#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define GLSL_SANDBOX // http://glslsandbox.com/e#63288.0
#ifdef GLSL_SANDBOX

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define u_resolution resolution
#define u_mouse mouse
#define u_time time

#else

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#endif

#define GLOW_SMOOTHSETP

// Reference to http://thndl.com/square-shaped-shaders.html

#define PI 3.14159265359
#define TWO_PI 6.28318530718


//https://thebookofshaders.com/07/
//https://math.stackexchange.com/questions/41940/is-there-an-equation-to-describe-regular-polygons/41954#41954
float dRegularPolygons(vec2 st) {
	// Number of sides of your shape
	int N = 3;

	// Angle and radius from the current pixel
	float a = atan(st.x,st.y)+PI;
	float r = TWO_PI/float(N);

	// Shaping function that modulate the distance
	return cos(floor(.5+a/r)*r-a)*length(st);	
}

const float radius = 0.4;
const float lineWidth = 0.01;

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
	st.x *= u_resolution.x/u_resolution.y;

	// Remap the space to -1. to 1.
	st = st *2.-1.;
	float d = dRegularPolygons(st);

#ifdef GLOW_SMOOTHSETP
	vec3 color = vec3(smoothstep(radius,radius+lineWidth,d)-
		smoothstep(radius+lineWidth,radius+lineWidth+lineWidth,d));
#else
	vec3 color = vec3(lineWidth/(d-radius));
#endif
	// vec3 color = vec3(1.0-smoothstep(radius,radius+lineWidth,d))
	// vec3 color = vec3(d);

	gl_FragColor = vec4(color,1.0);
}