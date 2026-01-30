#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

vec3 hsbToRGB(float h,float s,float b){
	return b*(1.0-s)+(b-b*(1.0-s))*clamp(abs(abs(6.0*(h-vec3(0,1,2)/3.0))-3.0)-1.0,0.0,1.0);
}

vec3 colorFunc(float h,float t) {
	return fract(hsbToRGB( h, 1.0, h/(0.5 + (sin(t)*0.5+0.5))));
}

void main( void ) {
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec2 ma = position-mouse;
	float mx = abs(ma.x);
	float my = abs(ma.y);
	
	if(((mx*my) < 0.001)){
		gl_FragColor = vec4( sin(time) );
	}else{
		vec2 pixel = (2.0+0.5*cos(3.14152*time/ma.y))/resolution;
		float buf1 = texture2D(backbuffer, position).g;
		float buf2 = texture2D(backbuffer, position).b;
		
		float b1 = texture2D(backbuffer, position + pixel * vec2(-1,0)).g;
		float b2 = texture2D(backbuffer, position + pixel * vec2(1,0)).g;
		float b3 = texture2D(backbuffer, position + pixel * vec2(0,1)).g;
		float b4 = texture2D(backbuffer, position + pixel * vec2(0,-1)).g;
		
		
		vec4 f = vec4( (b1 + b2 + b3 + b4)/2.0 - buf2 );
		f.r = f.r;//*01.999999999;
		f.b = buf1;
		f.g = f.r;
		f.a = 1.0;
		
		gl_FragColor = clamp(f,0.0,1.0);
	}
}