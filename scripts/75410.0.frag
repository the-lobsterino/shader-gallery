// line - line intersection and basic raycast

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;


float line(vec2 p, vec2 a, vec2 b) {
	vec2 ap = a - p;
	vec2 ab = a - b;
	return length(ap - ab * clamp(dot(ap, ab) / dot(ab, ab), 0., 1.));
}


vec2 intersect(vec2 a, vec2 b, vec2 c, vec2 d) 
{
	vec2 r 	= b - a;
	vec2 s 	= d - c;
	float i = 1./(r.x * s.y - r.y * s.x);
	vec2 q	= vec2((c.x - a.x) * r.y - (c.y - a.y) * r.x, (c.x - a.x) * s.y - (c.y - a.y) * s.x) * i;
	return a + normalize(b-a) * (clamp(q, 0., 1.) == q ? distance(a, a + r * q.y) : length(a-b));
}


float unit_atan(in float x, in float y)
{
	return atan(x, y) * .159154943 + .5;
}


mat2 rmat(float t)
{
	float c = cos(t);	
	float s = sin(t);
	return mat2(c, s, -s, c);
}


void main() 
{
	const float TAU = 8. * atan(1.);
	float RAYS 	= 56.;

	vec2 aspect 	= (resolution/min(resolution.x, resolution.y));
	vec2 uv 	= gl_FragCoord.xy / resolution * aspect;
	vec2 st 	= gl_FragCoord.xy / resolution;

	float range 	= 8.75;
	
	mat2 rotation 	= rmat(time * .25);
	
	
	vec2 origin 	= vec2(mouse) * aspect;

	
	float arc 	= TAU * (1./RAYS);	
	float angle 	= floor(unit_atan(origin.y - uv.y, origin.x - uv.x) * RAYS + .5)*arc;
	vec2 extent 	= origin + vec2(cos(angle), sin(angle)) * range;
	
	
	vec2 bound[4];
	bound[0]	= ((vec2( .25,  .25) - .5) * aspect * rotation + .5 * aspect);
	bound[1]	= ((vec2( .75,  .25) - .5) * aspect * rotation + .5 * aspect);
	bound[2]	= ((vec2( .75,  .75) - .5) * aspect * rotation + .5 * aspect);
	bound[3]	= ((vec2( .25,  .75) - .5) * aspect * rotation + .5 * aspect);
	
	vec2 hit[4];
	hit[0] 		= intersect(origin, extent, bound[0], bound[1]);
	hit[1] 		= intersect(origin, extent, bound[1], bound[2]);
	hit[2] 		= intersect(origin, extent, bound[2], bound[3]);
	hit[3] 		= intersect(origin, extent, bound[3], bound[0]);
	

	vec2 minima 	= vec2(0x0FFFFFFF,0x0FFFFFFF);
	vec2 maxima 	= vec2(0xFFFFFFFF,0xFFFFFFFF);	
	minima.x 	= min(min(min(hit[0].x, hit[1].x), hit[2].x), hit[3].x);
	minima.y 	= min(min(min(hit[0].y, hit[1].y), hit[2].y), hit[3].y);
	maxima.x 	= max(max(max(hit[0].x, hit[1].x), hit[2].x), hit[3].x);
	maxima.y 	= max(max(max(hit[0].y, hit[1].y), hit[2].y), hit[3].y);
	
	vec2 intercept 	= vec2(0.,0.);
	intercept.x	= abs(origin.x-minima.x) <= abs(origin.x-maxima.x) ? minima.x : maxima.x;
	intercept.y	= abs(origin.y-minima.y) <= abs(origin.y-maxima.y) ? minima.y : maxima.y;
	
	gl_FragColor 	+= smoothstep(.005, .0, length(origin-intercept) < range-.01 ?abs(length(uv-intercept) - .005) : 1.);
	gl_FragColor 	+= smoothstep(.005, .0, line(uv + sin(length(uv-origin)*512.-time*32.)*.001,  origin,  intercept));
	gl_FragColor.x 	+= smoothstep( .01, .0, line(uv, bound[0],   bound[1]));
	gl_FragColor.x 	+= smoothstep( .01, .0, line(uv, bound[1],   bound[2]));	
	gl_FragColor.x 	+= smoothstep( .01, .0, line(uv, bound[2],   bound[3]));	
	gl_FragColor.x 	+= smoothstep( .01, .0, line(uv, bound[3],   bound[0]));	
	gl_FragColor.w 	= 1.;	
}//mods by sphinx