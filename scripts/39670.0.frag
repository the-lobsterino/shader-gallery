#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
 vec2 surfacePosition;
	
vec3 dv1(vec3 v)
{
	float a = (mouse.x/gl_FragCoord.x)*5.0;
    	for(float i = 1.0; i < 5.0; i+=1.0)//original one is int i = 0; i < 5; i++
    	{
        	v.yzx += sin((v.zxy+vec3(0.0,2.094395102,4.188790205))*(float(i)*0.3183098862))*3.141592654;//or you can change the 3.14 , use x pos tp map it 
    	}
	return v;
}

vec3 dv2(vec3 v)
{
	vec4 v4 = vec4(dv1(v),(v.x+v.y+v.z)*0.3678794412);
    	for(int i = 1; i <3; i++)
    	{
        	v.yzx += (dv1(v4.xyz)+dv1(v4.yzw)+dv1(v4.zwx)+dv1(v4.wxy)+v.zxy)*(float(i)*0.01591549431);
    	}
	return normalize(v);
}


vec3 rotate(vec3 vec, vec3 axis, float ang)
{
    return vec * cos(ang) + cross(axis, vec) * sin(ang) + axis * dot(axis, vec) * (1.0 - cos(ang));
}


vec3 spin(vec3 v)
{
    for(int i = 1; i <6; i++)
    {
	vec3 t = (vec3(sin(v.x),sin(v.y+1.04719),sin(v.z+4.18879))*0.5+0.5).zxy;
        v=(1.145*rotate((v),t,float(i*i))*float(i));
	v=(vec3(sin(v.x+1.04719),sin(v.y+4.18879),sin(v.z))*0.5+0.5).yzx;
    }
    return (v.xyz);
}
void main( void ) {
	
	vec3 pos = dv1(vec3(surfacePosition ,cos(time*0.03263098862)+sin(time*0.06183098862))*3.14159265)*100.;//use second blob to change time 

	vec3 clr = spin(dv2(pos))*0.49+0.5;
	clr *= ((clr.x+clr.x+clr.x+clr.y+clr.z+clr.z)*0.166666);
	
	gl_FragColor = vec4( clr, 1.0 );

}