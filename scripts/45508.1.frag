#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 pos = gl_FragCoord.xy;
	gl_FragColor = vec4(1.0 + cos(pos.y * 0.3),2.0,3.0 + sin(pos.x * 0.3),4.0) * 0.4;
	float alpha = abs(sin(time));
			    
	//http://digitalrune.github.io/DigitalRune-Documentation/html/fa431d48-b457-4c70-a590-d44b0840ab1e.htm
	int x_index = int(mod(pos.x, 4.0));
	int y_index = int(mod(pos.y, 4.0));
	vec4  mvalue = vec4(0.0);
	float rvalue = (0.0);
	if(x_index == 0) mvalue = vec4(1.0 / 17.0,  9.0 / 17.0,  3.0 / 17.0, 11.0 / 17.0); 
	if(x_index == 1) mvalue = vec4(13.0 / 17.0,  5.0 / 17.0, 15.0 / 17.0,  7.0 / 17.0);
	if(x_index == 2) mvalue = vec4(4.0 / 17.0, 12.0 / 17.0,  2.0 / 17.0, 10.0 / 17.0); 
	if(x_index == 3) mvalue = vec4(16.0 / 17.0,  8.0 / 17.0, 14.0 / 17.0,  6.0 / 17.0);
	if(y_index == 0) rvalue = mvalue.x;
	if(y_index == 1) rvalue = mvalue.y;
	if(y_index == 2) rvalue = mvalue.z;
	if(y_index == 3) rvalue = mvalue.w;

	float value = alpha - rvalue;

	if(value < 0.0) {
		discard;
	}
	

}