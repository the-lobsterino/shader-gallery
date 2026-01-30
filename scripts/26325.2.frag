#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

	
vec3 dv1(vec3 v)
{
    	for(int i = 1; i <4; i++)
    	{
        	v.yzx += sin((v.zxy+vec3(0.0,2.094395102,4.188790205))*(float(i)*0.3183098862))*3.141592654;
    	}
	return v;
}

vec3 dv2(vec3 v)
{
	vec4 v4 = vec4(dv1(v),(v.x+v.y+v.z)*0.3678794412);
    	for(int i = 1; i <8; i++)
    	{
        	v.yzx += (dv1(v4.xyz)+dv1(v4.yzw)+dv1(v4.zwx)+dv1(v4.wxy)+v.zxy)*(float(i)*0.01591549431);
    	}
	return normalize(v)*(3.141592654*sin(time*.166666)+6.283185307);
}

void main( void ) {

	vec3 pos = dv1(vec3(surfacePosition ,time*0.03183098862)*3.141592654);
	vec3 clr = sin(dv2(pos))*0.49+0.5;
	clr *= ((clr.x+clr.x+clr.x+clr.y+clr.z+clr.z)*0.166666);
	gl_FragColor = vec4( clr, 1.0 );

}