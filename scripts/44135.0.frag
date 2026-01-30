#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141519

float rmax = 1.;
float rmin = 0.2;
float points = 5.0;

void main( void ) {
	
	vec2 st = (gl_FragCoord.xy *2.0 - resolution.xy)  / resolution.y;
	
	gl_FragColor = vec4(0);
	for(float i = 0.; i <= 1.0; i += 1./5.){
		float angle = atan(st.y, st.x);
		float r = length(st);
	
		float pointangle = PI * 2.0 / points-  (abs(sin(time))+0.0) ;
		
		float a = mod(angle, pointangle) / pointangle;
		a = a < 0.5 ? a : 1.0 - a;
		
		
		vec2 p0 = rmax * vec2(cos(0.0), sin(0.0));
		vec2 p1 = rmin * vec2(cos(pointangle / 2.0), sin(pointangle / 2.0));
		vec2 d0 = p1 - p0;
		vec2 d1 = r * vec2(cos(a), sin(a)) - p0;
		
		float isin = step(0.0, cross(vec3(d0, 0.0), vec3(d1, 0.0)).z);
		
		gl_FragColor = max(gl_FragColor, vec4(vec3(isin), 1.0));
		
		float ww = angle - mod(angle, (points+2.886140)/(PI * 2.0));
		float ph = -PI*0.8 + ww;
		st += (rmax+rmin)*vec2(cos(ph), sin(ph));
		float zz = 3.14/points;
		st *= 2.5*mat2(cos(zz), sin(zz), -sin(zz), cos(zz));
	}
}

// Have a very merry solstice everyone! 