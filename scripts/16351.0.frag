#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
//uniform vec2 resolution;
varying vec2 surfacePosition;


#define pi    3.1415926535897932384626433832795 //pi

vec4 spuke(vec4 pos)
{
	vec2 p   =((pos.z+surfacePosition*pi)+(sin((((length(sin(surfacePosition*(pos.xy)+time*pi)))+(cos((surfacePosition-time*pi)/pi)))))*surfacePosition))+pos.xy*pos.z; 
	vec3 col = vec3( 0.0, 0.0, 0.0 );
	float ca = 0.0;
	for( int j = 1; j < 7; j++ )
	{
		p *= 1.4;
		float jj = float( j );
		
		for( int i = 1; i <9; i++ )  
		{
			vec2 newp = p*0.96;
			float ii = float( i );
			newp.x += 1.2 / ( ii + jj ) * sin( ii * p.y + (p.x*.3) + cos(time/pi/pi)*pi*pi + 0.003 * ( jj / ii ) ) + 1.0;
			newp.y += 0.8 / ( ii + jj ) * cos( ii * p.x + (p.y*.3) + sin(time/pi/pi)*pi*pi + 0.003 * ( jj / ii ) ) - 1.0;
			p=newp;
			
		
		}
		p   *= 0.9;
		col += vec3( 0.5 * sin( pi * p.x ) + 0.5, 0.5 * sin( pi * p.y ) + 0.5, 0.5 * sin( pi * p.x ) * cos( pi * p.y ) + 0.5 )*(0.5*sin(pos.z*pi)+0.5);
		ca  += 0.7;
	}
	col /= ca;
	return vec4( col * col * col, 1.0 );
}
void main(void)
{
	vec2 p = surfacePosition*5.;
	p.y -= 0.25;
	
	// background color
	vec3 bcol = vec3(0.4,1.0,0.7-0.07*p.y)*(1.0-0.25*length(p));
	
	
	// animate
	float tt = mod(time,1.0);
	float ss = (sin(tt)*0.5+1.0)*0.3 + 0.5; // Discontinuities in animation are a sin.
	ss -= ss*0.2*sin(tt*30.0)*exp(-tt*4.0);
	p *= vec2(0.5,1.5) + ss*vec2(0.5,-0.5);
   

	// shape
	float a = atan(p.x,p.y)/3.141593;
	float r = length(p);
	float h = abs(a);
	float d = (13.0*h - 22.0*h*h + 10.0*h*h*h)/(6.0-5.0*h);

	// color
	float s = 1.0-0.5*clamp(r/d,0.0,1.0);
	s = 0.75 + 0.75*p.x;
	s *= 1.0-0.25*r;
	s = 0.5 + 0.6*s;
	s *= 0.5+0.5*pow( 1.0-clamp(r/d, 0.0, 1.0 ), 0.1 );
	vec3 hcol = vec3(1.0,0.5*r,0.3)*s;
	
	//vec3 col = mix( bcol, hcol, smoothstep( -0.01, 0.01, d-r) );
	vec3 col = hcol;
	
	gl_FragColor = spuke(vec4(col,1.0)*pi*pi);
}