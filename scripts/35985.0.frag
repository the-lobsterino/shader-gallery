//--- Kancolle BG (Rainbow) ---
// by Catzpaw 2016

// js : window.open(get_img(192*20, 108*20));

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 hsv){return ((clamp(abs(fract(hsv.x+vec3(0.,2./3.,1./3.))*2.-1.)*3.-1.,0.,1.)-1.)*hsv.y+1.)*hsv.z;}

float bit(float n, float b)
{
	n = floor(n);
	b = floor(b);
	b = floor(n/pow(4.,b));
	return mod(b,4.);
}

float hexTile(vec2 pos){
	float v=1.;
	v*=1.0-sign(abs(pos.x)-1.);
	pos*=mat2(sin(0.523598),cos(0.523598),-cos(0.523598),sin(0.523598));
	v*=1.0-sign(abs(pos.x)-1.);
	pos*=mat2(sin(0.523598),cos(0.523598),-cos(0.523598),sin(0.523598));
	v*=1.0-sign(abs(pos.x)-1.);
	return v;
}

float hexMap(vec2 pos,float data){
	float scale=0.04;
	float v=0.;
	float i=floor((pos.y+.071)/.142);
	pos.y-=i*.142;
	v=bit(data,i)/50.;
	if(v>0.)v*=hexTile(pos/scale);
	if(v>0.)v+=.2;
	return v;
}

float gears(vec2 pos,float r,float p,float c){
	float v=0.;
	float a;
	if (pos.y > 0.0) a = atan(pos.y, pos.x);
	else a = 6.2831853 + atan(pos.y, pos.x);	
	float b=length(pos);
	if((sin(a*p+c)*.1*r+.53*r>b&&b<.521*r||b<.455*r)&&b>.407*r)v=1.;
	if(b<.347*r&&b>.199*r)v=1.;
	if(b<.151*r&&b>.096*r)v=1.;
	return v;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy/resolution.xy)-.5;
	uv.x *=resolution.x/resolution.y;

	float animation=0.;	//1.on 0.off
	
	//base color
	float a,v;
	if(uv.y>0.) a = atan(uv.y,uv.x);
	else a = 6.2831853+atan(uv.y,uv.x);
	if(animation==1.)a=mod(a+time/5.,6.2831853);
	v=clamp(length(uv)+.2,0.0,0.5);
	vec3 color=hsv2rgb(vec3(.57-a/6.2831853,v,0.6));
	
	//mesh wave
	a=0.;
	if(animation==1.)a=time*2.;
	v=(clamp(abs(sin(uv.x*400.)-cos(uv.y*960.))+.5+cos(a+3.+uv.x*7.-uv.y*12.)*.8,0.,1.))*.3;
	v-=(cos(a+6.14159+uv.x*7.-uv.y*12.)+.1)*.1;
	color+=v;
	
	//hex tiles
	v=0.;
	if(uv.x>=-.889&&uv.x<-.397){
		v+=hexMap(uv+vec2(.848,.48),4100.);
		v+=hexMap(uv+vec2(.807,.551),4116.);
		v+=hexMap(uv+vec2(.766,.48),1044.);
		v+=hexMap(uv+vec2(.725,.551),5140.);
		v+=hexMap(uv+vec2(.684,.48),1108.);
		v+=hexMap(uv+vec2(.643,.551),1424.);
		v+=hexMap(uv+vec2(.602,.48),9316.);
		v+=hexMap(uv+vec2(.561,.551),34192.);
		v+=hexMap(uv+vec2(.520,.48),9904.);
		v+=hexMap(uv+vec2(.479,.551),10592.);
		v+=hexMap(uv+vec2(.438,.48),11812.);
	}
	if(uv.x>=-.438&&uv.x<.054){
		v+=hexMap(uv+vec2(.397,.551),11112.);
		v+=hexMap(uv+vec2(.356,.48),7966.);
		v+=hexMap(uv+vec2(.315,.551),29272.);
		v+=hexMap(uv+vec2(.274,.48),9624.);
		v+=hexMap(uv+vec2(.233,.551),38536.);
		v+=hexMap(uv+vec2(.192,.48),8600.);
		v+=hexMap(uv+vec2(.151,.551),9648.);
		v+=hexMap(uv+vec2(.110,.48),7069.);
		v+=hexMap(uv+vec2(.069,.551),27253.);
		v+=hexMap(uv+vec2(.028,.48),18101.);
	}
	if(uv.x>=-.028&&uv.x<.464){
		v+=hexMap(uv+vec2(-.013,0.551),27509.);
		v+=hexMap(uv+vec2(-.054,.48),22461.);
		v+=hexMap(uv+vec2(-.095,.551),23292.);
		v+=hexMap(uv+vec2(-.136,.48),10748.);
		v+=hexMap(uv+vec2(-.177,.551),27556.);
		v+=hexMap(uv+vec2(-.218,.48),15000.);
		v+=hexMap(uv+vec2(-.259,.551),48760.);
		v+=hexMap(uv+vec2(-.300,.48),39613.);
		v+=hexMap(uv+vec2(-.341,.551),19001.);
		v+=hexMap(uv+vec2(-.382,.48),33566.);
		v+=hexMap(uv+vec2(-.423,.551),40750.);
	}
	if(uv.x>=.423&&uv.x<.874){
		v+=hexMap(uv+vec2(-.464,.48),38794.);
		v+=hexMap(uv+vec2(-.505,.551),24170.);
		v+=hexMap(uv+vec2(-.546,.48),9899.);
		v+=hexMap(uv+vec2(-.587,.551),23958.);
		v+=hexMap(uv+vec2(-.628,.48),7285.);
		v+=hexMap(uv+vec2(-.669,.551),31841.);
		v+=hexMap(uv+vec2(-.710,.48),9385.);
		v+=hexMap(uv+vec2(-.751,.551),21284.);
		v+=hexMap(uv+vec2(-.792,.48),17816.);
		v+=hexMap(uv+vec2(-.833,.551),21904.);
	}
	if(v>.0)color=color*(1.-v)+v;
	
	//gears
	v=gears(uv+vec2(0.74,-0.46),1.27,40.,-animation*time*3.);
	if(v>.0)color=color*.5+v*.5;
	v=gears(uv+vec2(-0.692,0.274),1.27,40.,animation*time*2.);
	if(v>.0)color=color*.5+v*.5;
	
	gl_FragColor=vec4(color,1.);
}
