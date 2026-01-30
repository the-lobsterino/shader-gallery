#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy/vec2(640.0,960.0) );
	
	//float x = mix(0.1,0.9,position.x);
	//float y = mix(0.1,0.9,position.y);
	
	//y = mix(x,y,-x);
	//float waveX = min(abs((tan(time)*2.5)-y)-0.8, 0.1) ;

	//float color = 0.0;
	//gl_FragColor = vec4( vec3( -waveX, -waveX, -waveX ), 1.0 )*2.0;
	vec4 texColor = vec4(1.0,0.5,0.4,1.0);
	float alpha = texColor.a;
	vec2 uv =  position;
	float x = mix(0.1,0.9,position.x);
	float y = mix(0.1,0.9,position.y);
	
	y = mix(x,y,-x);
	//float waveX = min(abs((sin(time)/cos(time))-y)-0.8, 0.1);
	float waveX = sin(time);
	
	vec4 rampCol = vec4(0.1,position.x,position.y,0.0);//* texColor ; 
	texColor = vec4( texColor + (-rampCol*2.0) * alpha);
    	gl_FragColor =  vec4(rampCol);

}