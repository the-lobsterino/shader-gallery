precision highp float;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

// ehh. colors
void main(void){
	vec2 p = gl_FragCoord.xy / resolution.xy;
	vec4 dmin = vec4(1000.);
	vec2 z = (-1.0 + 2.0*p)*vec2(1.7,1.0)*0.7;
	float w = .1 * p.x * p.y;
	vec2 op = 1.-p;
	vec2 mv = ((mouse-vec2(0.5))+vec2(1.-acos(op.x*w),1./acos(op.y*w)));
	for( int i=0; i<8; i++ ){
		z = mv+vec2(z.x*z.x-z.y*z.y,2.0*z.x*z.y);
		mv /= (dmin.x+dmin.y);//10.5;
		z += z*.5;
		dmin=min(dmin,vec4(abs(0.0+z.y+0.5*sin(z.x+time*5.)),abs(1.0+z.x+0.5*sin(z.y+time)),dot(z,z),length(fract(z)-0.5)));
	}	
	vec3 color = vec3( mix(vec3(dot(dmin.rgb, -dmin.gba)), dmin.rgb, 1.0-dmin.a) );
	color = mix( color, vec3(1.00,1.00,0.00),  1.00-min(1.0,pow(dmin.z*1.00,0.15)));
	color = mix( color, vec3(0.00,1.00,1.00),  1.00-min(1.0,pow(1.0-dmin.x*0.25,18.20)));
	color = mix( color, vec3(-1.00,0.00,1.00),  1.00-min(1.0,pow(dmin.y*0.50,.1250)));
	color = mix( color, vec3(1.00,1.00,0.00),  1.00-min(1.0,pow(dmin.z*1.00,0.115)));
	color = 1.25 * color*color*color*color;
	color.r *= color.r;
	gl_FragColor = vec4(1.0-color.rgb*(0.5 + 0.5*pow(16.0*p.x*(1.0-p.x)*p.y*(1.0-p.y),1.5)),1.0);}

// http://glslsandbox.com/e#29622.0
// Created by inigo quilez - iq/2013 // glslsandbox mod by Robert Schütze - trirop/2015 - absurd tweaks by bpt
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.