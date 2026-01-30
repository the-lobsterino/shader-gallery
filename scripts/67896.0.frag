// N250920N This are rotating points of a 3D sphere
// 	    The color is the min distance to each point
// N260920N Corrected
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


#define PI 3.141592653
#define TWO_PI 2.0*PI
#define t time*0.3
#define MAX 30.
void main( void ) {
	vec2 uv = surfacePosition;
	uv *= 4.;
	
	float f = length(uv)/dot(uv,uv);
	vec3 c = vec3(0.);
	float mindist = 1e10;
	
	for (float i1=0.0;i1<=PI;i1+=0.3) {
		for (float i2=0.0;i2<=TWO_PI;i2+=0.3) {
			float x = sin(i1)*cos(i2);
			float y = sin(i1)*sin(i2);
			float z = cos(i1);
			vec3 p = vec3(.5) - vec3(x,y,z);
			
			p = rotate(p, vec3(1., 1., 1.), TWO_PI*sin(t));
					
			float dist = distance(p, vec3(uv.x,uv.y,0.));				
			mindist = min(mindist,dist);
			
			//e += 0.001/abs(p.x+dist);
			//e += 0.001/abs(p.y+dist);
			// e += 0.001/abs(p.z+dist);
			
			//c += normalize(p);
		}
	}
	
	
	
	
	// gl_FragColor = vec4(vec3(smoothstep(0.0,0.5,mindist)), 1.0);
	gl_FragColor = vec4(vec3(1.-sqrt(mindist)), 1.0);	
}