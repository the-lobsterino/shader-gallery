
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define THICKNESS 0.2
#define LENGTH 0.07
uniform float time;
uniform vec2 resolution;

float hseed(float t,float ct,float seed)
{
	float cn = floor(t/ct);
	float poff= 10.3+5.7*fract(0.4+5.3147*cn);
	float s = step(0.25,fract(cn*0.5));
	float y = resolution.y*fract((mod(cn,963.7)+2.2)*(1.1+mod(cn,676.7))*(0.27+seed*22.773));
	float x = resolution.x*mix(-0.3,1.3,(t/ct-cn)/(poff)*(1.0-2.0*s)+s);
	float col = max(0.0,1.0-THICKNESS*abs(gl_FragCoord.y-y));
	return col * 150.0/(150.0+LENGTH*(gl_FragCoord.x-x)*(gl_FragCoord.x-x));
}

float vseed(float t,float ct,float seed)
{
	float cn = floor(t/ct);
	float poff= 0.3+0.7*fract(0.4+7.42787*cn);
	float s = step(0.25,fract(cn*0.5));
	float x = resolution.x*fract((mod(cn,912.7)+1.22)*(4.11+mod(cn,674.7))*(0.21+seed*13.773));
	float y = resolution.y*mix(-0.5,1.5,(t/ct-cn)/(poff)*(1.0-2.0*s)+s);
	float col = max(0.0,1.0-THICKNESS*abs(gl_FragCoord.x-x));
	return col * 450.0/(50.0+LENGTH*(gl_FragCoord.y-y)*(gl_FragCoord.y-y));
}

void main( void ) {
	
	float col = 0.0;
	for(float i=0.0;i<40.0;i++)
	{
		//col = (1.0-col)*(1.0-hseed(time,5.0+i/4.0,.10,i/1.0));
		//col = col*(1.0-vseed(time,5.0+i/4.0,1.0,i/10.0));
		col = max(col,hseed(time,4.0+i*0.078,1.0+i/1.0));
		col = max(col,vseed(time,(4.0+i*0.78)*resolution.x/resolution.y,12.0+i/100.0));		
	}
	
	gl_FragColor = vec4( col,col,col*2., 1.0 );

}