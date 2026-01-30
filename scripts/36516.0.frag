// uninitialized variables... yuck

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define STEPS 16
#define PRECISION 0.01
#define DEPTH 15.0
#define PI 3.14

vec3 eye = vec3(0,0.5,-1)*3.0;
vec3 light = vec3(0,1,-1);

const float lineWidth = 0.02;
const float border = 0.05;
const float scale = 0.07;

float bounding=0., ground=0., letters=0.;
const float groundPosition = -0.5;
const vec3 boundingSize = vec3(30,12,0.8)*scale;

float t = time;
float scene(vec3);

// Utilities
float udBox(vec3 p, vec3 s) { return length(max(abs(p)-s,0.0)); }

/*
    mat4 rotX = mat4(      vec4(1,0,0,0),
                           vec4(0,c,-s,0),
                           vec4(0,s,c,0),
                           vec4(0,0,0,1) );
    
    mat4 rotY = mat4(      vec4(c,0,-s,0),
                           vec4(0,1,0,0),
                           vec4(s,0,c,0),
                           vec4(0,0,0,1) );
    
    mat4 rotZ = mat4(      vec4(c,s,0,0),
                           vec4(-s,c,0,0),
                           vec4(0,0,1,0),
                           vec4(0,0,0,1) );
    
    mat4 pos = mat4(       vec4(1,0,0,s),
                           vec4(0,1,0,0),
                           vec4(0,0,1,c),
                           vec4(0,0,0,1) );
*/
mat3 rotX(float a) {float s=sin(a); float c=cos(a); return mat3(1,0,0,0,c,-s,0,s,c);}
mat3 rotY(float a) {float s=sin(a); float c=cos(a); return mat3(c,0,-s,0,1,0,s,0,c);}

// Letter code (https://dl.dropboxusercontent.com/u/14645664/files/glsl-text.txt)
float line(vec2 p, vec2 s, vec2 e) {s*=scale;e*=scale;float l=length(s-e);vec2 d=vec2(e-s)/l;p-=vec2(s.x,-s.y);p=vec2(p.x*d.x+p.y*-d.y,p.x*d.y+p.y*d.x);return length(max(abs(p-vec2(l/2.0,0))-vec2(l/2.0,lineWidth/2.0),0.0))-border;}


// Marching
vec3 getNormal(vec3 p){vec2 e=vec2(PRECISION,0);return(normalize(vec3(scene(p+e.xyy)-scene(p-e.xyy),scene(p+e.yxy)-scene(p-e.yxy),scene(p+e.yyx)-scene(p-e.yyx))));}
vec3 march(vec3 ro,vec3 rd){float t=0.0,d;for(int i=0;i<STEPS;i++){d=scene(ro+rd*t);if(d<PRECISION||t>DEPTH){break;}t+=d;}return(ro+rd*t);}
vec3 lookAt(vec3 o,vec3 t){vec2 uv=(2.0*gl_FragCoord.xy-resolution.xy)/resolution.xx;vec3 d=normalize(t-o),u=vec3(0,1,0),r=cross(u,d);return(normalize(r*uv.x+cross(d,r)*uv.y+d));}

vec3 processColor(vec3 p)
{
	float d = 1e10;
	
	vec3 n = getNormal(p);
	vec3 l = normalize(light-p);
	vec3 col=vec3(0.);
	
	float dist = length(light-p);
	float diff = max(dot(n, normalize(light-p)),0.0);
	float spec = pow(diff, 100.0);
	
	if (ground<d) { col = vec3(diff+spec*0.3)*vec3(0.8,0.3,0.6); d = ground; }
	if (letters<d) { col = vec3(0,p.y*0.5+0.5,.1)+diff+spec; }
		
	col *= min(1.0, 1.0/dist);
	col.g += cos(t+PI/4.)/10.;
	col.b += sin(t+PI)/20.;
	col.r += cos(t)/5.;
	return col;
}

float scene(vec3 p)
{	
	return 0.0;
}


void glow(float d) {
	float br = 0.005 * resolution.y;
	gl_FragColor.rgb += vec3(0.3, 0.15, 0.45) * br / d;
}

void line( vec2 a, vec2 l ) {
	l.x *= resolution.y/resolution.x;
	l += 0.5;
	l *= resolution;
	
	vec2 P = gl_FragCoord.xy;
	a.x *= resolution.y/resolution.x;
	a += 0.5;
	a *= resolution;
	
	vec2 aP = P-a;
	vec2 al = l-a;
	vec3 al3 = vec3(al, 0.0);
	vec3 aP3 = vec3(aP, 0.0);
	//float q = length(dot(aP,al))/length(al);
	float q = length(cross(aP3,al3))/length(al3);
	
	float d = q;
	if ( dot(al, aP) <= 0.0 ) { // before start
               d = distance(P, a);
	}
        else if ( dot(al, al) <= dot(al, aP) ) { // after end
               d = distance(P, l);
	}
	glow(d);
}

void point(vec2 a) {
	//a.x *= resolution.y/resolution.x;
	a += 0.5;
	a *= resolution;

	vec2 P = gl_FragCoord.xy;
	float d = distance(P, a);
	glow(d);
}

float rand(int seed) {
	return fract(sin(float(seed)*15.234234) + sin(float(seed)*4.3456342) * 372.4532);
}

	
void main()
{	
	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);

	//eye *= rotY(mouse.x - 0.5 + 0.5*sin(t));
	//eye *= rotX(mouse.y - 0.45);
	light.x = sin(t);

	vec3 p = march(eye,lookAt(eye,vec3(0)));
	vec3 col = processColor(p);
	// Horizontal grid lines
	float y = 0.0;
	for (int l=1; l<13; l++) {
		y = -1.0/(0.6 * sin(time * 0.0) + float(l)*1.2) + 0.25;
		line(vec2(-1.0, float(l-3) * -0.25 ), vec2(1.0, float(l-3) * -0.25) );
		
	}
	
	// Perpendicular grid lines
	for (int l=-30; l<31; l++) {
		float x = float(l) + fract(time * 0.0);
		line(vec2(x * 0.25, 1.0), vec2(x * 0.25, -1.0));
	}
	
	// Starfield
	for (int l=1; l<200; l++) {
		float sx = (fract(rand(l+342) + time * (0.002 + 0.01*rand(l)))-0.5) * 3.0;
		float sy = fract(y *rand(l+421) + time * 0.1 * rand(l+8324)-0.4)*2.;
		point(vec2(sx,sy-1.));
	}
	
	gl_FragColor += vec4(col.yyx,1.0);
}