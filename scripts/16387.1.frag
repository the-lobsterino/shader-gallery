#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
vec2 fold=vec2(0.5,-0.5);
vec2 translate=vec2(1.5);
float scale=1.3;

vec2 rotate(vec2 p,float a){
	return vec2(p.x*cos(a)-p.y*sin(a),p.x*sin(a)+p.y*cos(a));
}


vec4 circle(float r,vec2 p0,vec2 p1,vec3 color){
	return vec4(color,step(distance(p0,p1),r));
}

vec4 cutcircle1(float r,vec2 p0,vec2 p1,vec3 color,float cut){
	vec4 c=circle(r,p0,p1,color);
	return vec4(c.xyz,c.w*step(cut,((p1.y-p0.y)+r)/(2.0*r)));
}

vec4 cutcircle2(float r,vec2 p0,vec2 p1,vec3 color,float cut){
	vec4 c=circle(r,p0,p1,color);
	return vec4(c.xyz,c.w*step(cut,1.0-((p1.y-p0.y)+r)/(2.0*r)));
}

vec3 smiley(vec2 p){
	p=fract(p);
	vec3 c=vec3(0);
	//yellow
	vec4 temp=circle(0.45,vec2(0.5),p,vec3(0.9,0.8,0.2));
	c=mix(c,temp.xyz,temp.w);
	//mouth border
	temp=cutcircle2(0.34,vec2(0.47,0.42),p,vec3(0),0.45);
	c=mix(c,temp.xyz,temp.w);
	//mouth inside
	temp=cutcircle2(0.3,vec2(0.47,0.4),p,vec3(0.5,0.0,0.2),0.45);
	c=mix(c,temp.xyz,temp.w);
	//eye1 border
	temp=cutcircle1(0.15,vec2(0.25,0.62),p,vec3(0),0.2);
	c=mix(c,temp.xyz,temp.w);
	//eye1 inside
	temp=cutcircle1(0.12,vec2(0.25,0.63),p,vec3(1),0.2);
	c=mix(c,temp.xyz,temp.w);
	//eye2 border
	temp=cutcircle1(0.15,vec2(0.63,0.62),p,vec3(0),0.2);
	c=mix(c,temp.xyz,temp.w);
	//eye2 inside
	temp=cutcircle1(0.12,vec2(0.63,0.63),p,vec3(1),0.2);
	c=mix(c,temp.xyz,temp.w);
	//eye1 pupil
	temp=circle(0.05,vec2(0.69,0.69),p,vec3(0));
	c=mix(c,temp.xyz,temp.w);
	//eye2 pupil
	temp=circle(0.05,vec2(0.31,0.69),p,vec3(0));
	c=mix(c,temp.xyz,temp.w);
	return c;
}


void main( void ) {
	vec2 p = -1.0+0.5*gl_FragCoord.xy/resolution;
	p.x *= resolution.x/resolution.y;
	//p = surfacePosition;
	p *= 0.002;
	p.x += time*0.0001;
	p = abs(mod(p,8.0)-4.0);
	for(int i=0;i<35;i++){
		p=abs(p-fold)+fold;
		p=p*scale-translate;
		p=rotate(p,3.14159/8.0);
	}
	gl_FragColor = vec4(smiley(vec2(sin(p.x*1.5),fract(sin(time)*1.5*p.y))),1.0);
}