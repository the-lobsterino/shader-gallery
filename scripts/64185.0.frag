#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {

	vec2 position =  ((2.0*gl_FragCoord.xy-resolution.xy)/ resolution.y)*3.;
	float ratio=resolution.y/resolution.x;
	
	vec3 color = vec3(0.1,0.1,0.1);
	vec3 view = vec3(0.0,0.0,1.0);
	vec3 LightColor=vec3(0.0,0.5,0.0);
	vec3 SpecularColor=vec3(0.4,0.4,0.5);
	

	float len=length(position);
	
	float shape=1.0-smoothstep(1.0,1.0+0.075,len);
	

	float z = sqrt(max(0.0,1.0 - dot(position, position)));
	
	vec3 Normal=vec3(position,z)*shape; 
	
	vec3 circleLight=mix(vec3(0.0),max(vec3(0.0),vec3(1.0) - dot(view, Normal)),shape);
	circleLight=pow(circleLight,vec3(4.0))*SpecularColor;
	vec3 LightDir=normalize(vec3(sin(time*0.5)*0.9,0.0,cos(time*0.5)*0.9));
	
	float light=max(0.0,dot(Normal,LightDir));
	light=light*2.0;
	color=(color+circleLight)*light; 
	
	////STARS
	
	vec2 pos=gl_FragCoord.xy;
	pos.x=pos.x*(1.0+sin(pos.y)*10.0);
	pos.y=pos.y*(1.0+cos(pos.x)*10.0);
	vec3 back=fract(vec3(pos*5.0,pos.x*5.0));
	back=step(back,vec3(0.05))*vec3(1.0,1.0,1.0);
	back=back*(back.x+back.y-1.0);
	back=back*sin(time*0.5*(position.x+position.y)/len);
	
	back=back*vec3((1.0+sin(time*position.x))*0.5,(1.0+sin(time*position.y))*0.5,(1.0+sin(time*position.x*0.25))*0.5);
	back=back*(1.0-shape);
	
	color=color+back;
	gl_FragColor = vec4(color, 1.0 );

}