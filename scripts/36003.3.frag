#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 hsv){return ((clamp(abs(fract(hsv.x+vec3(0.,2./3.,1./3.))*2.-1.)*3.-1.,0.,1.)-1.)*hsv.y+1.)*hsv.z;}
float circle(vec2 pos,float radius){return radius-length(pos)>0.?0.:1.;}
vec2 rot2(vec2 pos,float a){pos*=mat2(sin(a),cos(a),-cos(a),sin(a));return pos;}

void main( void ) {

	vec2 uv=(gl_FragCoord.xy/resolution.xy)-.5,mo=.5-mouse;
	uv.x*=resolution.x/resolution.y;
	mo.x*=resolution.x/resolution.y;
	vec3 color = vec3(1.);

	float colors=36.;
	float radius=1.;

	float angle=3.1415926/colors*0.075/abs(sin(time*0.27)+1.0);
	float a=0.,r=length(uv);
	float r1=radius,r2=0.,sa=sin(angle),t=0.,v=1.;

	for(float i=.0;i<1.;i+=.019){
		uv=rot2(uv,time*(.44-i));
		a=uv.y>0.0?atan(uv.y, uv.x):6.2831853+atan(uv.y, uv.x);
		t=ceil((a/angle-1.)/2.)*angle*2.;
		r2=r1/(1./sa+1.);
		v=circle(uv-vec2(cos(t),sin(t))*(r1-r2),r2);
		if(v<1.)break;
		r1=r1-2.*r2;
	}
	color=v<1.?hsv2rgb(vec3(t/6.2831853,1.,1.))+v:hsv2rgb(vec3(t/6.2831853,radius-length(uv)/1.4,1.));

	gl_FragColor = vec4(color,1.);

}
