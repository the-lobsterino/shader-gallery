// N240920N This are rotating points of a 3D cube
// 	    The color is the min distance to each point
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


mat4 rotationMatrix(vec3 axis, float angle)
{
	axis = normalize(axis);
	float s = sin(angle);
	float c = cos(angle);
	float oc = 1.0 - c;

	return mat4(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0,
		oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0,
		oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0,
		0.0, 0.0, 0.0, 1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle)
{
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}


#define TWO_PI 2.0*3.141592653
void main( void ) {
	vec2 uv = surfacePosition;
	uv *= 2.;
	
	float mindist = 1e10;
	for (float x=.0;x<=1.0;x+=0.2) {
		for (float y=.0;y<=1.0;y+=0.2) {
			for (float z=.0;z<=1.0;z+=0.2) {
				vec3 p = vec3(0.5) - vec3(x,y,z);
				p = rotate(p,vec3(1.,0.,0.), TWO_PI*sin(time*0.1));
				p = rotate(p,vec3(0.,1.,0.), TWO_PI*sin(time*0.2));
				//p = rotate(p,vec3(0.,0.,1.), TWO_PI*sin(time*0.4));
				
				float dist = distance(p, vec3(uv.x,uv.y,0.));
				mindist = min(mindist,dist);
			}
		}
	}
	
	gl_FragColor = vec4(vec3(smoothstep(0.0,0.2,mindist)), 1.0);
}