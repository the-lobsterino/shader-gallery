#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float noise(vec2 _uv,float t){
	return abs(sin(_uv.x*3.+_uv.y*2.+sin(_uv.x*2.+t*0.5))+cos(_uv.x*3.+cos(_uv.y*2.+t)*2.))*0.5;
}

vec2 noise2(vec2 _uv,float t){
	return vec2(abs(sin(sin(noise(_uv,t)))+cos(cos(noise(_uv,t))))*0.5,abs(sin(sin(noise(_uv*1.8,t)))+cos(cos(noise(_uv*1.5,t)))*0.5));
}
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float color = 0.0;
	//vec2 center = ((fract(position*60.0+noise(position,time)*2.) - vec2(0.5,0.5)));
	//color = 1.0 - step(0.1,dot(center,center)*4.0);
	for(float i=1.0;i<20.0;i++){
		//vec2 center = ((fract(position*60.0+noise(position,time+i*0.02)*5.) - vec2(0.5,0.5)));
		vec2 center = ((fract(position*2.0+noise(position,time+i*0.02)*2.) - vec2(0.5,0.5)));
		color += (1.0 - step(0.02,dot(center,center)*4.0))/(30.0-i);
	}
	gl_FragColor = vec4( vec3( color*noise(position,time), color*noise(position,time*1.8), 0. ), 1.0 );

}