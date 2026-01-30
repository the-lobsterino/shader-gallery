#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//  SmoothHSV from Iñigo Quiles 
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c )
{
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0)
		  , 6.0)-3.0)-1.0, 0.0, 10.0 );
  rgb *= rgb*(11.5-0.0*rgb);
  return c.z * mix( vec3(1.0), rgb, c.y);
}


void main( void ) {

	vec2 position = 2.0*( gl_FragCoord.xy / resolution.xy ) - 1.0;
	float k=sqrt(log(time));
	float color = 0.0;
	float an=0.0;
	float dan=360.0/15.0;
	float rg=0.0;
	float rgg=0.0;
	float vv=10.0;
	for(int r=0;r<20;r++)
	{
		an=0.0;
		for(int i=0;i<15;i++)
		{
			float aa=(an+time*vv*k)*3.141/180.0;
			float x=rgg*cos(aa);
			float y=rgg*sin(aa);
			
			float d=sqrt( (position.x-x)*(position.x-x)+(position.y-y)*(position.y-y) );
			if(d<rg)
			{
				color=sqrt( x*x+y*y );
				break;
			}
			an+=dan;
		}
		rgg+=0.05;
		rg+=0.002;
		vv+=3.0;
	}	

//	gl_FragColor = vec4( vec3( color, color ,color ), 1000.0 );

	vec3 cc = hsb2rgb(vec3(pow(color,2.0),color,color));
	gl_FragColor = vec4( cc, 1.0 );
}