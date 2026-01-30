#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

/*
 +++ Tile-based rendering. Finding cases by adding up binary values in a 2x2 square.

	Could be simplified.*/


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//const int nLayers = 8;

float rand(vec2 p){ return fract(sin(dot(p, vec2(12.989, 78.233)))*43758.5453); }

float plane(vec2 p, vec2 n){ return dot(p, normalize(n)); }

// the overall shape of the land
// vec2 o helps randomize noise w/o messing up the overall shape (should be in range 0.-1.)
int binLand(in vec2 p, vec2 o) {
    p = floor(-p);
    
    float noise = rand(p-o);
    float land = noise - p.y/(100.-100.*mouse.x );
    
    return (land < .15 ? 1: 0);
}

// used for some tiles
float roof(vec2 p) {
    return p.y*2.;
}
float wall(vec2 p) {
    return p.x*2.-1.;
}
float ceiling(vec2 p) {
    return -p.y*2.+1.;
}
float ceilingDiag(vec2 p) {
    return dot(p, normalize(vec2(-1., -1.)))*2.+1.;
}

// 16 tile definitions, one for each case
float tileEmpty(vec2 p) {
    return 1.;
}
float tileFilled(vec2 p) {
    return -1.;
}
float tileCornerOut_ul(in vec2 p, float r) {
    p.x = 1.-p.x;
    return max(wall(p), roof(p));
}
float tileCornerOut_ur(in vec2 p, float r) {
    return max(wall(p), roof(p));
}
float tileCornerOut_dl(in vec2 p, float r) {
    vec2 p_ = vec2(1.-p.x, p.y);
    return max(max(wall(p_), ceiling(p)), ceilingDiag(p-.3));
}
float tileCornerOut_dr(in vec2 p, float r) {
    vec2 p_ = vec2(1.-p.x, p.y);
    return max(max(wall(p), ceiling(p)), ceilingDiag(p_-.3));
}
float tileCornerIn_ul(in vec2 p, float r) {
    p.x = 1.-p.x;
    return (min(wall(p), roof(p)));
}
float tileCornerIn_ur(in vec2 p, float r) {
    return (min(wall(p), roof(p)));
}
float tileCornerIn_dl(in vec2 p, float r) {
    p.x = 1. - p.x;
    return min(wall(p), ceiling(p));
}
float tileCornerIn_dr(in vec2 p, float r) {
    return (min(wall(p), ceiling(p)));
}
float tileWall_l(in vec2 p, float r) {
    p.x = 1.-p.x;
    return wall(p);
}
float tileWall_r(in vec2 p, float r) {
    return wall(p);
}
float tileWall_u(in vec2 p, in float r) {
    r *= .4;
    return min(roof(p), clamp(length(p-vec2(r+(1.-2.*r)*r, .5))/r, 1.-r*2.5, 1.));
}
float tileWall_d(in vec2 p, float r) {
    return ceiling(p);
}
float tileJoin_a(in vec2 p, float r) {
    return min(max(wall(vec2(1.-p.x, p.y)), roof(p)), tileCornerOut_dr(p, r));
}
float tileJoin_b(in vec2 p, float r) {
    return min(max(wall(p), roof(p)), tileCornerOut_dl(p, r));
}

// get landscape
float getLand(in vec2 p, vec2 o) {   
	// get decimal value from 2x2 neighborhood of landFunc()
	int dec = 0;
	dec += 1 * binLand(vec2(p.x,	p.y), o);
	dec += 2 * binLand(vec2(p.x+1.,	p.y), o);
	dec += 4 * binLand(vec2(p.x,	p.y+1.), o);
	dec += 8 * binLand(vec2(p.x+1.,	p.y+1.), o);
	
	float r = rand(floor(p));
	
	// choose tile based on decimal value
	p = fract((p*p));
	float f;
    
	// there is probably a more performant method
	if(dec==0)
		f = tileEmpty(p);
	else if(dec==1)
		f = tileCornerOut_ur(p, 0.);
	else if(dec==2)
		f = tileCornerOut_ul(p, 0.);
	else if(dec==3)
		f = tileWall_u(p, r);
	else if(dec==4)
		f = tileCornerOut_dr(p, 0.);
	else if(dec==5)
		f = tileWall_r(p, 0.);
	else if(dec==6)
		f = tileJoin_a(p, 0.);
	else if(dec==7)
		f = tileCornerIn_ur(p, 0.);
	else if(dec==8)
		f = tileCornerOut_dl(p, 0.);
	else if(dec==9)
		f = tileJoin_b(p, 0.);
	else if(dec==10)
		f = tileWall_l(p, 0.);
	else if(dec==11)
		f = tileCornerIn_ul(p, 0.);
	else if(dec==12)
		f = tileWall_d(p, 0.);
	else if(dec==13)
		f = tileCornerIn_dr(p, 0.);
	else if(dec==14)
		f = tileCornerIn_dl(p, 0.);
	else if(dec==15)
		f = tileFilled(p);
	
	
	return clamp(1.-f, 0., 1.);
    
}

void main( void ) {
	vec2 res = resolution;
	vec2 uv = 10.*(gl_FragCoord.xy-0.5*res) / res.y;
	
	
	
	float scale;
	vec3 bg =
		mix(
			vec3(1.975, 1.43, 1.),
			vec3(1., .4, 1.),
			vec3(0., 0., 0.)
		);
	
	vec3 RGB = bg;
	vec2 uvb;
	
	vec2 camPos	= vec2(0., 0.);
	vec2 camLook	= vec2(2.*time, 0.);
	
	vec2 rayDir	= (vec2(uv+camLook));
	
	vec2 v = camPos;
	const float nLayers = 8.;
	for(float i=0.; i<nLayers; i++) {
	
		v += rayDir;
		
		float fTemp = getLand(v.xy, vec2(0., .1*float(i)));
		
		if(fTemp>0.9) {
			RGB = mix(vec3(fTemp+v.y/4.) * vec3(.9, .0, .1), bg, clamp((i+1.)/nLayers, 0.0, 1.));
			break;
		}
	
	}
    
    gl_FragColor = vec4(1.-RGB, 1.0);
}
