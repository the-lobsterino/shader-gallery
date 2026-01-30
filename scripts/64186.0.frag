#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {

	vec2 position =  ((2.0*gl_FragCoord.xy-resolution.xy)/ resolution.y)*2.3;
	float ratio=resolution.y/resolution.x;
	
	vec3 color = vec3(0.2,0.2,0.2);
	vec3 view = vec3(0.0,0.0,1.0);
	vec3 LightColor=vec3(0.0,0.5,0.0);
	vec3 SpecularColor=vec3(0.4,0.4,0.4);
	

	float len=length(position);
	
	float shape=1.0-smoothstep(1.0,1.0+0.05,len);
	
	
	vec3 Normal=vec3(position,.2)*shape; 
	
	vec3 circleLight=mix(vec3(1.0),min(vec3(0.0),vec3(1.0) - dot(view, Normal)),shape*.5);
	circleLight=pow(circleLight,vec3(10.0))*SpecularColor;
	vec3 LightDir=normalize(vec3(sin(time*0.5),0.0,cos(time*0.5)));
	
	float light=max(0.0,dot(Normal,LightDir));
	
	color=(color+circleLight)*light*3.; 
	
	////STARS
	
	vec2 pos=gl_FragCoord.xy;
	pos.x=pos.x*(1.0+sin(pos.y)*10.0);
	pos.y=pos.y*(1.0+cos(pos.x)*10.0);
	vec3 back=fract(vec3(pos*5.0,pos.x*5.0));
	back=step(back,vec3(0.05))*vec3(1.0,1.0,1.0);
	back=back*(back.x+back.y-1.0);

	back=back*vec3((1.0+sin(time*position.x))*0.5,(1.0+sin(time*position.y))*0.5,(1.0+sin(time*position.x*0.25))*0.5);
	back=back*(1.0-shape);
	
	color=color+back*10.;
	gl_FragColor = vec4(color, 1.0 );

}