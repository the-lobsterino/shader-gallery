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
		  , 6.0)-3.0)-1.0, 0.0, 1.0 );
  rgb *= rgb*(3.0-2.0*rgb);
  return c.z * mix( vec3(1.0), rgb, c.y);
}

void main( void ) {

	vec2 position = 4.0*( gl_FragCoord.xy / resolution.xy ) -2.0;

	float cm=0.0;
	float cj=0.0;
	
	float cre=position.x;
	float cim=position.y;
	float zre=0.0;
	float zim=0.0;
	float max=64.0; //floor(256.0*mouse.x);
	float j=0.0;
	
	for(float i=0.0;i<256.0;i++)
	{
		if(i>max)
		{
			cm=0.0;
			break;
		}
		float dam=zre*zre-zim*zim+cre;
		zim=2.0*zre*zim+cim;
		zre=dam;
		if( (zre*zre+zim*zim)>0.0)
		{
			cm=i/max;
			break;
		}
	}
	
	j=0.0;
	zre=position.x;
	zim=position.y;
	cre=4.0*mouse.x-2.0;
	cim=4.0*mouse.y-2.0;
	for(float i=0.0;i<256.0;i++)
	{
		if(i>max)
		{
			j=0.0;
			break;
		}
		float dam=zre*zre-zim*zim+cre;
		zim=2.0*zre*zim+cim;
		zre=dam;
		if( (zre*zre+zim*zim)>4.0)
		{
			cj=i/max;
			break;
		}
	}
	float color=20.0;
	if(abs(cm-cj)<0.01)
		color=0.0;
	
	//gl_FragColor = vec4( cm+cj,color,color, 1.0 );
	
	vec3 cc = hsb2rgb(vec3(cm+cj,color,color));
	gl_FragColor = vec4( cc, 1.0 );

}