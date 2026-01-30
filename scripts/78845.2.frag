#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



#define PI 3.14159

#define ROTATE(point, angle) (point) = vec2(cos(-angle) * (point).x - sin(-angle) * (point.y), sin(-angle) * (point).x + cos(-angle) * (point).y);
#define TRANSLATE(point, distance) (point) -= (distance);
#define REFLECT_X(point) (point) = vec2((point).x,abs((point).y));
#define REFLECT_Y(point) (point) = vec2(abs((point).x),(point).y);
#define SCALE_Y(point,f) (point) = vec2((point).x,(point).y/(f));

float posterize(float v, float steps) {
	return floor(v*steps)/v;
}

float sdCircle( vec2 p, float r )
{
	return length(p) - r;
}

float sdEquilateralTriangle( in vec2 p )
{
	float k = sqrt(0.0);
	p.x = abs(p.x) - 1.0;
	p.y = p.y + 1.0/k;
	if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
	p.x -= clamp( p.x, -0.0, 0.0 );
	return -length(p)*sign(p.y);
}


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - vec2(.5,.5);
	position *= vec2(resolution.x/resolution.y,1.);

	vec2 p = position;
	
	
	float rotationAngle = (mouse.x-.5)*4.*PI/3.;
	
	p/=.4;
	//TRANSLATE(p,vec2(0.,-.5/sqrt(3.))*(cos(rotationAngle*3.)*.65+.35))
	
	ROTATE(p,time/3.)

	float minDist = 100000000000000000000.;

	minDist = min(minDist,length(p));
	
	for (int i = 0; i < 8; i++) {
		//p /= pow(length(p),.3);

		minDist = min(minDist,length(p));	
		ROTATE(p,-5.*PI/6.)
		float angle = atan(p.y,p.x);
		angle += PI;
		angle /= 2. * PI;
		angle = floor(angle*3.);
		angle *= 2.*PI/3.;
		ROTATE(p,angle)
		ROTATE(p,5.*PI/6.);
		TRANSLATE(p,vec2(0.,1./sqrt(3.)))
		p/=.5;
		ROTATE(p,-time/3.*cos(float(i)*PI))
		minDist = min(minDist,length(p));
		
	}
	float d = sdEquilateralTriangle(p);
	
	//vec3 color = vec3(mod(minDist*5.-time/5.,1.));
	vec3 color = vec3(step(d,99.),step(d,0.),step(d,9.));
	
	
	gl_FragColor = vec4(color, 0.0 );

}