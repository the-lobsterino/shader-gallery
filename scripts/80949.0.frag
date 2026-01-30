// ändrom3da
#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform sampler2D bb;        // the backbuffer


#define TAU 6.2831853071
#define time time * 4.25
#define tw(a) sin(a*time)*0.5 + 0.5

#define abc TAU
#define rot(a) mat2(cos(abc*a),-sin(abc*a),sin(abc*a),cos(abc*a))

#define mask0 vec3(1.0, 1.0, 1.0);
#define mask1 vec3(0.5, 0.6, 0.7);

float circle(vec2 p, float r)
{
	float t = atan(p.y/time, p.x);
	float o = step(length(p), r +t/2.+p.x);
	return o;
}

vec3 niceColor(vec2 p)
{
	vec3 c;
	
        c.x = cos(0.0+(8./9.)*p.x);
	c.y = cos(1.0+(8./8.)*p.x);
 	c.z = cos(2.0+(8./7.)*p.x+time); 
	c += 0.25;
	c *= mask1;

	return c;
}

void main( void ) {

        // define tw as "timewave" with speed 1.0
	float tw = tw(1.);
	
	// the fragments
	vec2 p = 1.5*(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 c;  // the color variable
	
	// domain manipulation
	
	
	// this is needed for the backbuffer stuff
	vec2 p0 = gl_FragCoord.xy / resolution.xy;
	
	// rotation
	p *= rot(time*0.9);
	p *= tw+0.5;
	
	// some "night and day" color mask
	c = niceColor(p) * vec3(1.0, 1.0, 4.5);
	
	// the circle
	float radius = tw(1.)/4.;
	c *= circle(p, radius);
	c *= circle(p, radius/8.) * vec3(1.0,1.0,2.0);
	
	c = 0.9*texture2D(bb, p0).xyz + 0.25*c;
	
	gl_FragColor = vec4( c , 1.0 );

}