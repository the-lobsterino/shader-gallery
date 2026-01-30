#ifdef GL_ES
precision mediump float;
#endif


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float pi = 3.14159265359;

vec4 colours[8];

vec3 interpColours (in vec3 orig, in vec3 target, in float t)
{

	return vec3(orig.x + (target.x - orig.x)*t, 
	    	orig.y + (target.y - orig.y)*t,
	    	orig.z + (target.z - orig.z)*t);
}

float cosEase (in float angle, in float resolution, in float offset)
{
	return (1.-(1.-((1.+cos(angle*resolution+offset*pi))/2.)));
}

float deformCircle (in float angle, in float deformationAmount, in float phase)
{
	return cosEase(angle,4.,phase)*deformationAmount + 1.-deformationAmount;
}

void main( void ) {
	colours[0] = vec4 (vec3(255.,155.,69.) / 255.0, 1.0);
	colours[1] = vec4 (vec3(225.,214.,66.) / 255.0, 1.0);
	colours[2] = vec4 (vec3(63.,179.,163.) / 255.0, 1.0);
	colours[3] = vec4 (vec3(56.,127.,184.) / 255.0, 1.0);
	colours[4] = vec4 (vec3(37.,84.,163.) / 255.0, 1.0);
	colours[5] = vec4 (vec3(101.,86.,163.) / 255.0, 1.0);
	colours[6] = vec4 (vec3(178.,87.,159.) / 255.0, 1.0);
	colours[7] = vec4 (vec3(238.,75.,93.) / 255.0, 1.0);
	vec2 position = ( gl_FragCoord.xy / min (resolution.x, resolution.y) ) * 2.0 - 1.0;
	float a = atan (position.x, position.y);
	float r = length (position);
        vec3 col = vec3(0.);
	float grad = abs(a) / pi;
	float edgeLim = mouse.y;
	float innerEdge = edgeLim - 0.1;
	for (int i=0; i<8; i++)
	{
		float phase = sin(time)*sin(((float(i)+1.)/4.0)*time)/2.;
		vec3 rc;
		if(float(i)==7.)
		{
			rc = interpColours(colours[i].xyz,colours[0].xyz,grad);

		}
		else
		{
			rc = interpColours(colours[i].xyz,colours[i+1].xyz,grad);
		}
		
		float edge = deformCircle (a, mouse.x * 0.5, phase) * edgeLim;
		float inEdge = deformCircle (a, mouse.x * 0.5, phase) * innerEdge;
		col += clamp(float(r < edge) * (smoothstep (r, edge, edge-0.01)),0.,1.) * rc;
		//col -= clamp(float(r < inEdge && r < edge) * (smoothstep (r, inEdge, inEdge-0.01)),0.,1.) * rc;
		edgeLim = innerEdge;
		innerEdge = edgeLim - 0.1;
	}
	
	
	
	gl_FragColor = vec4( col, 1.0 );
	
}
