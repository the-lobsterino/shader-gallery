#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;
uniform vec2 surfacePosition;
#define T2(D) texture2D(bb, (D+gl_FragCoord.xy)/resolution)

const int num_balls = 490; // change this, but be careful 
const float coordinate_scale = 10000.;
const float structure_size = 35.0; // Size from 0 to 100, 
const float glow_decay = 1.60; 
#define pi 3.14159265358
const float speed = .489;          //Controls spiral speed
const float trail_decay_rate = 3.; // 0. to 256.
const float rot_speed = 0.;
const float starting_pt = -1000.0; 
const float ball_size = 9.5;

vec4 draw_ball(float i, float j, float size) {
	float balls = float(num_balls);
	float dt = ((starting_pt + sin(time/1000.)*10.) + time) * speed;
	// Map coordinates to 0-1
	vec2 coord = gl_FragCoord.xy/resolution.xy;
	//map coordinates to -coord_scale -> +coord_scale
	coord = coord *coordinate_scale-coordinate_scale/2.;
	coord -= vec2(coord.x/2.,coord.y/2.);
	
	//Controls motion of balls
	float spacing = (2.*pi)/balls;
	
	float x =  (sin(dt*i*spacing)*100. - cos(dt*j*spacing)) * structure_size;
	float y =  (cos(dt*j*spacing)*100. - sin(dt*i*spacing)) * structure_size;
	x *= ((j - dt)/-dt) + sin(i*spacing + dt*sin(dt/100.));
	y *= ((i - dt)/dt)  + cos(i*spacing - dt*cos(dt/100.));
	//Correct aspect ratio
	coord.x *= resolution.x/resolution.y; 
	vec2 pos = vec2(x,y);
	mat2 rot = mat2(cos(dt*rot_speed), -sin(dt*rot_speed), sin(dt*rot_speed), cos(dt*rot_speed));
	pos *= rot;
	float dist = length(coord - pos);
	
	//Controls how quickly brightness falls off
	float intensity = pow(size/dist, glow_decay);
	
	vec4 color = vec4(vec3(1.0) * (abs(sin(vec3(time*0.25,time/2.,time/3.)))*0.8 + 0.2), 1.0);
	return color * intensity;
}

void main( void ) {
	
	vec4 col = vec4(0.0);
	
	for (int i = 0; i < num_balls; i++) {
		vec2 pt = vec2(float(i),float(i));
		col += draw_ball(float(i),mod(float(i),float(num_balls)*2. + 1.), ball_size-distance(pt,vec2(0.))/coordinate_scale);
	}
	
	
	gl_FragColor = max(col, T2(1.8)-trail_decay_rate/256.);
}