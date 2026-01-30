#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
    	vec2 v=gl_FragCoord.xy/resolution.y*10.0-vec2(5.0);
//	v.y+=cos(time*2.0+v.x*0.2);
	vec2 u=mod(v,1.0)-0.5;
	float r=length(u);
    	float d = r*r-0.16;
	if(d<0.0){
		float z=sqrt(-d);
		vec3 norm=normalize(vec3(u,z));
		vec3 light=normalize(vec3(sin(time),cos(time),1.5));
		d=dot(norm,light);
		float spec=dot(norm,vec3(-0.50,0.25,0.8));
		spec=pow(spec,45.0);
		d+=spec;
	}
	else d=d*d*10.0;
	gl_FragColor = vec4(d,d,d,1.0);
}