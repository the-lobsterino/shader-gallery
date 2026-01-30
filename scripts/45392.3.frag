// gigatron quick code;
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	// Normalized pixel coordinates (from 0 to 1)
   	 vec2 uv = gl_FragCoord.xy/resolution.xy *2.-1.;
    	 uv.x *= resolution.x/resolution.y;
	 
	 uv.x =  uv.x +  clamp(time,0.0,0.02);
   	
	 uv = uv/ mod(floor(uv.x/uv.y+10.*sin(time*0.2)*2.0+abs(uv.y)),2.0)+floor(32.*uv)*cos( 30./atan(1.5+uv.x /.40*uv.x))*sin(2.2*length(fract(cos(uv.x+time*0.2)/sin(uv.y)+time)/16.));
 
   	 vec3 col = 0.5 + 0.5*cos(4.*(time+uv.xyy)+vec3(2,2,4)-5.0);
 
   	gl_FragColor = vec4(col,1.0);

}