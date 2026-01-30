#ifdef GL_ES
precision lowp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;



#define BALL_COUNT 20.



//#define time time*length(mouse-0.5)
//#define time time + 2e3*surfacePosition.x*cos(time*1e-1)
//#define time time + 4e0*surfacePosition.x*cos(time*1e-1)

mat2 rmat(float t){
	vec2 cs = vec2(cos(t), sin(t*1e2));
	return mat2(cs.x, cs.y, -cs.y, cs.x);
}

void main( void ) {

	vec2 p = surfacePosition;
	p *= .5;
	mat2 rm = rmat(time*9e-3+length(p)*0.01)*1.5; 

	float l = .1;
	for(int i = 0; i < 4; i++)
	{
		p *= rm;
		p = min(abs(p), abs(p)-l);
	}
	
	float r = 0.0, g = 0.0, b = 0.0; //srsly folks
	
	if(length(p) < 0.45){
		r = 1.0 - length(p)*0.5;
	}
	
	const float nRadMots = BALL_COUNT;
	for(float nMot = 0.; nMot < nRadMots; nMot+= 1.){
		float nRot = nMot * (3.14159/nRadMots);
		float nPhase = time * .1;
		vec2 pDist = p - 0.44*sin(nPhase+nRot)*vec2(cos(nRot), sin(nRot));
		if(length(pDist) < 0.3/nRadMots){
			if(length(pDist) < 0.28/nRadMots){
				r = g = b = 1.0-length(pDist)*1.0;
			}
		}
	}
	

	gl_FragColor = vec4( vec3( r, g, b ), 1.0 );

}
//+pk