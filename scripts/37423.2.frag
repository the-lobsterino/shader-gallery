//derived from http://glslsandbox.com/e#37345.0
//all credits go there
// GigatRonan   add

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
// more colors here :)

 vec3 hsv2rgb(vec3 c) {//https://github.com/hughsk/glsl-hsv2rgb
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}



vec2 rotate(vec2 point, float rads) {
	float cs = cos(rads);
	float sn = sin(rads);
	return point * mat2(cs, -sn, sn, cs);
}

float star(vec2 p) {
	float i = (length(p) > 0.8) ? 1. : 0.;
		float j = 0.0;
	for (float i=0.0; i<360.0; i+=72.0)
	{
		vec2 p0 = rotate(p.yx, radians(i)+mod(time,1.25));// no sinus needed here //
		if (p0.x > 0.020) j++;
	}

	return  (j<2.? 1. : 0.)  ;
	
	
}

void main( void ) {

	vec2 p=  gl_FragCoord.xy / resolution.xy ;	
	p.x = p.x * resolution.x/resolution.y; // ratio
	
	float color=0.;	// color used
	// fast amiga like x,y grid ... for loop to fill x,y pos
	// 
	// for loop removed ! gtr 
	
	  color +=star(p-vec2(floor(p*8.+0.5)/8.));
	
	
	/*
	for (float i=0.;i<18.;i++){
	    for (float j=0.0;j<12.;j++){	 

	  color +=star(p-vec2(0.0+i/8.,0.0+j/8.));
	
		}

	}
*/		
	 
	
	 gl_FragColor = vec4( hsv2rgb(vec3(color*p.y+sin(time/20.)*6.,color, color*p.y)*2.0)*1.,1.0 )*2.;

}
// gtr end all right :!