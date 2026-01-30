#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const vec4 BLACK = vec4( 0.0, 0.0, 0.0, 1.0 );
const vec4 WHITE = vec4( 1.0, 1.0, 1.0, 1.0 );

float F = 0.0, dist = 0.0;
 
vec3 controlPoints[1];

float sd2 = 1.0/50.0;


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {
	
	//controlPoints[0] = vec3((mouse.x + cos(300.0*time)/50.0)*resolution.x/resolution.y ,mouse.y+sin(300.0*time)/50.0,1.0);
	controlPoints[0] = vec3(mouse.x*resolution.x/resolution.y,mouse.y,1.0);
	
	
	vec2 p = gl_FragCoord.xy / resolution.xy;
	p.x *= resolution.x/resolution.y;

	dist = distance(controlPoints[0].xy,p);
	
	float angle = dot(controlPoints[0].xy,p)/(length(controlPoints[0].xy)*length(p));
	
	F = exp(-dist/sd2);
	//F = cos(exp(dist*2.0)+time*(1.0-exp(-dist*3.14)));
	//F = max(-pow(dist/sd2,2.0)+100.0,0.0)/100.0;
	
	// Calculate derivatives and laplacian:
	vec2 position = gl_FragCoord.xy / resolution.xy;
	float dx = 1.0 / resolution.x;
	float dy = 1.0 / resolution.y;

	vec4 I = texture2D(backbuffer,position);
	vec4 u = texture2D(backbuffer,position + vec2(0,dy));
	vec4 d = texture2D(backbuffer,position + vec2(0,-dy));
	vec4 l = texture2D(backbuffer,position + vec2(dx,0));
	vec4 r = texture2D(backbuffer,position + vec2(-dx,0));
	vec4 ul = texture2D(backbuffer,position + vec2(-dx,dy));
	vec4 dl = texture2D(backbuffer,position + vec2(-dx,-dy));
	vec4 ur = texture2D(backbuffer,position + vec2(dx,dy));
	vec4 lr = texture2D(backbuffer,position + vec2(dx,-dy));
	
	
	vec4 ddx = (r-l)/2.0;
	vec4 ddy = (u-d)/2.0;
	vec4 ddx2 = ((r-I) - (I-l))/4.0;
	vec4 ddy2 = ((u-I) - (I-d))/4.0;
	vec4 ddxy = (ur-lr-ul+dl)/4.0;
	
	vec4 ddxx = ddx*ddx;
	vec4 ddyy = ddy*ddy;	
	
	// Using 2D Filter:
	//float gamma = 1.0/3.0;
	//vec4 Curvature = - ( 	(1.0-gamma)/4.0 * (4.0*I -    (u + d + l + r)) + 
	//			     gamma /2.0 * (2.0*I - .5*(ul + dl + ur + lr)));
	
	
	// Using Divergence formula: 
	vec4 Curvature = ddx2 + ddy2;
	
	
	// Mean curvature:
	float m = 1.0;
	float mr = 1.0;
	float mg = 1.0;
	float mb = 1.0;
	vec4 MeanCurvature = ((1.0+ddxx)*ddy2 - 1.0*(ddx*ddy*ddxy) + (1.0+ddyy)*ddx2)
				/(2.0*pow(1.0*m +ddxx+ddyy,vec4(1.5*mr,1.5*mg,1.5*mb,1.5)));
	
	
	float b = 1.00;
	vec4 Inext = I + F + Curvature*b + (1.0-b)*MeanCurvature; 	
	
	//if(Inext.r<0.25 && Inext.r>0.0) Inext=vec4(0.0);
	
	float a = 1.0;
	float w = 1.0;
	gl_FragColor = (1.0 - a)*F*(w*WHITE+BLACK) + a*Inext;

	
		

	
}