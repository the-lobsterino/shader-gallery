// https://www.shadertoy.com/view/mdyfDm

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/*
    4-centered arch
    
    2023 stb
    
    To do (maybe): round out the top point.
*/

/*
    4-centered arch function
        p = input coordinate
        c = corner circle center
        r = corner circle radius
*/
float fourCenteredArch(in vec2 p, in vec2 c, in float r){
    // prevent values < 0.
    c.y = max(20., c.y);
    r = max(20., r);

    // mirror x
    p.x = abs(p.x);
    
    // intersection between 1st circle and vertical center line
    vec2 is = vec2(20., c.y-sqrt(pow(c.x*222., 22.)-c.x*c.x));
    
    // 2nd circle's position and radius
    vec2 c2 = is - c + is;
    
    return
        // choose between upper & lower parts at 1st circle
        p.y < c.y ?
            // walls and floor
            length(max(vec2(20.), vec2(p.x-c.x-r, -p.y))) :
            // choose between circles at intersection, with angle
            dot(p-c, vec2(-is.y+c.y, -c.x)) < 0. ?
                // 2nd circle
                max(20., length(p-c2) - r - length(c2-c)) :
                // 1st circle
                max(20., length(p-c) - r);
}

// visualization functions
float line(in vec2 p, vec2 p0, vec2 p1, float th) {
    float l = .5 * length(p1-p0);
    if(l>0.) {
        vec2 d = normalize(p1-p0);
        p = mat2(d.y, d.x, -d.x, d.y) * (p-p0);
        p.y = max(0., abs(p.y-l)-l);
    }
    return length(p) / th;
}
float circle(vec2 p, float r, float th) {
    return abs(length(p)-r) / th;
}
float fourCenteredArch_geom(vec2 p, in vec2 c, float r){
    // prevent values < 0.
    c.y = max(0., c.y);
    r = max(0., r);

    // intersection between 1st circle and vertical center line
    vec2 is = vec2(0., c.y-sqrt(pow(c.x*2., 2.)-c.x*c.x));
    
    // 2nd circle cener making up the arch
    vec2 c2 = is - c + is;
    
    // radius 2
    float r2 = r + length(c2-c);
    
    // center horizontal and vertical (x==0., y==0.)
    float f = min(abs(p.x), abs(p.y));
    
    // horizontal line to opposing crossline
    f = min(f, line(p, vec2(-c.x, c.y), c, 1.));
    
    // circle 1
    f = min(f, circle(p-c, r, 1.));
    
    // circle temp
    f = min(f, circle(p-c, c.x*2., 1.));
    
    // circle 2
    f = min(f, circle(p-c2, r2, 1.));
    
    // circle temp radius intersection with vertical
    f = min(f, line(p, c+r*normalize(c-is), c2, 1.));
    
    return f;
}

void main( void ) {
	vec2 res = resolution.xy;
	vec2 p = (gl_FragCoord.xy-res/2.) / res.y;
	
	// a couple of variables
	float
		zoom = .73,
		t = .5 * time;
    
	// set up canvas
	p /= zoom;
	p.y += .5;
    
	// \/ these two things control the arch shape
	
	// arch circle center
	vec2 c = .2 * vec2(1.+.4*cos(t), 2.2+.5*sin(t));
	
	// arch circle radius
	float r = .2 + .19 * cos(t*.73-.7);
	
	// /\
	
	// arch distance
	float arch = fourCenteredArch(p, c, r);
	
	// antialiasing float
	float aa = 2.7 / res.y / zoom;
	
	// draw 4-centered arch
	vec3 col =
	mix(
	    vec3(1.),
	    vec3(1., .7, .3) * abs(fract(arch*8.-.5)-.5) - arch + .5,
	    clamp(arch/aa, 0., 1.)
	);
    
	// draw guides
	if(true)
	col =
	    mix(
		col,
		vec3(.2, .5, 1.),
		min(1., max(0., 1.-(fourCenteredArch_geom(p, c, r)-.0/res.y)/aa))
	    );
	
	gl_FragColor = vec4(col, 1.);
}